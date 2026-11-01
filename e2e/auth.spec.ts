import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { USERS, authFile, type Role } from './support/users';

function savedToken(role: Role): string {
  const state = JSON.parse(fs.readFileSync(authFile(role), 'utf8')) as { cookies: { name: string; value: string }[] };
  return state.cookies.find((c) => c.name === 'kafe_token')!.value;
}


// The login route handler rate-limits by IP header (10 / 15 min per server instance);
// a distinct address per run keeps repeated local runs from tripping it.
const forwardedFor = `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

test.describe('login page (signed out)', () => {
  test.use({ extraHTTPHeaders: { 'x-forwarded-for': forwardedFor } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders the form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Endereço de E-mail' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Senha' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeEnabled();
  });

  test('blocks an invalid e-mail (native type=email validation) without calling the API', async ({ page }) => {
    // type="email" makes the browser stop the submit before zod runs, so the zod message is never shown.
    let called = false;
    page.on('request', (r) => {
      if (r.url().includes('/api/v1/auth/login')) called = true;
    });
    const email = page.getByRole('textbox', { name: 'Endereço de E-mail' });
    await email.fill('not-an-email');
    await page.getByRole('textbox', { name: 'Senha' }).fill('whatever123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
    await expect(page).toHaveURL(/\/login$/);
    expect(called).toBe(false);
  });

  test('rejects a password shorter than 8 characters', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Endereço de E-mail' }).fill(USERS.admin.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill('short');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('A senha deve ter pelo menos 8 caracteres')).toBeVisible();
  });

  test('shows an error toast for wrong credentials and stays on /login', async ({ page }) => {
    // The throttled API is stubbed; the UI branch under test is "login responded with a non-200".
    await page.route('**/api/v1/auth/login', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Unauthorized' }) }),
    );
    await page.getByRole('textbox', { name: 'Endereço de E-mail' }).fill(USERS.admin.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill('wrong-password-123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('E-mail ou senha inválidos')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'kafe_token')).toBeUndefined();
  });

  test('shows a generic error toast when the API is unreachable', async ({ page }) => {
    await page.route('**/api/v1/auth/login', (route) => route.abort());
    await page.getByRole('textbox', { name: 'Endereço de E-mail' }).fill(USERS.admin.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill('whatever123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Falha no login. Tente novamente.')).toBeVisible();
  });

  test('toggles password visibility', async ({ page }) => {
    const password = page.getByRole('textbox', { name: 'Senha' });
    await expect(password).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Mostrar senha' }).click();
    await expect(password).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: 'Ocultar senha' }).click();
    await expect(password).toHaveAttribute('type', 'password');
  });

  // Stubs the throttled API but sends a real token, so the Next route handler, cookie and proxy are real.
  for (const role of ['admin', 'barista', 'client'] as Role[]) {
    test(`signing in as ${role} lands on ${USERS[role].home} and sets an httpOnly cookie`, async ({ page }) => {
      const token = savedToken(role);
      await page.route('**/api/v1/auth/login', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token, user: { id: role, name: role, email: USERS[role].email, role: role.toUpperCase() } }),
        }),
      );
      await page.getByRole('textbox', { name: 'Endereço de E-mail' }).fill(USERS[role].email);
      await page.getByRole('textbox', { name: 'Senha' }).fill(USERS[role].password);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page).toHaveURL(new RegExp(`${USERS[role].home}$`));

      const cookie = (await page.context().cookies()).find((c) => c.name === 'kafe_token');
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.sameSite).toBe('Strict');
      // httpOnly: scripts must not be able to read it
      expect(await page.evaluate(() => document.cookie)).not.toContain('kafe_token');
    });
  }

  test('real sign-in against kafe-api (admin, unstubbed)', async ({ page }) => {
    const apiResponse = page.waitForResponse('**/api/v1/auth/login');
    await page.getByRole('textbox', { name: 'Endereço de E-mail' }).fill(USERS.admin.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(USERS.admin.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    const res = await apiResponse;
    test.skip(res.status() === 429, 'kafe-api login throttle (5/min) hit — rerun in a minute');
    expect(res.status()).toBe(200);
    await expect(page).toHaveURL(/\/admin\/dashboard$/);
  });
});

test.describe('login route handler', () => {
  test.use({ extraHTTPHeaders: { 'x-forwarded-for': forwardedFor } });

  test('rejects a request without a token', async ({ request }) => {
    const res = await request.post('/api/auth/login', { data: {} });
    expect(res.status()).toBe(400);
  });

  test('rejects a malformed token', async ({ request }) => {
    const res = await request.post('/api/auth/login', { data: { token: 'bad token; DROP TABLE' } });
    expect(res.status()).toBe(400);
  });
});

test.describe('session', () => {
  for (const role of ['admin', 'barista', 'client'] as Role[]) {
    test.describe(`as ${role}`, () => {
      test.use({ storageState: authFile(role) });

      test('/login redirects an authenticated user to their home', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveURL(new RegExp(`${USERS[role].home}$`));
      });

      test('/api/auth/session returns the signed-in user', async ({ request }) => {
        const res = await request.get('/api/auth/session');
        expect(res.status()).toBe(200);
        const body = (await res.json()) as { user: { email: string; role: string } };
        expect(body.user.email).toBe(USERS[role].email);
        expect(body.user.role).toBe(role.toUpperCase());
      });
    });
  }

  test('/api/auth/session is 401 when signed out', async ({ request }) => {
    const res = await request.get('/api/auth/session');
    expect(res.status()).toBe(401);
  });

  test.describe('logout', () => {
    test.use({ storageState: authFile('client') });

    test('clears the cookie and protects /orders/me again', async ({ page }) => {
      await page.goto('/orders/me');
      await page.getByTitle('Sair').click();
      await expect(page).toHaveURL(/\/login$/);
      expect((await page.context().cookies()).find((c) => c.name === 'kafe_token')).toBeUndefined();
      await page.goto('/orders/me');
      await expect(page).toHaveURL(/\/login$/);
    });
  });
});
