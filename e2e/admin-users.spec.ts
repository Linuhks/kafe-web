import { test, expect, type Page } from '@playwright/test';
import { API_URL, apiAs, deleteByName, findByName, uid } from './support/api';
import { authFile } from './support/users';
import { waitForHydration } from './support/hydration';

test.use({ storageState: authFile('admin') });

const created: string[] = [];
test.afterAll(async () => {
  const api = await apiAs('admin');
  for (const name of created) await deleteByName(api, 'users', name);
  await api.dispose();
});

const row = (page: Page, text: string) => page.getByRole('row').filter({ hasText: text });
const PASSWORD = 'e2e-pass-123';

async function createUserViaApi(role: 'CLIENT' | 'BARISTA' | 'ADMIN' = 'CLIENT') {
  const name = uid('user');
  const email = `${name}@e2e.kafe.com`;
  const api = await apiAs('admin');
  const res = await api.post('/api/v1/users', { data: { name, email, password: PASSWORD, role } });
  expect(res.ok()).toBe(true);
  const { id } = (await res.json()) as { id: string };
  await api.dispose();
  created.push(name);
  return { id, name, email };
}

async function chooseRole(page: Page, label: string) {
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: label }).click();
}

test.describe('users list', () => {
  test('shows the seeded users with role and status badges', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'Usuários', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Novo usuário/ })).toBeVisible();
    for (const header of ['Nome', 'Email', 'Papel', 'Status']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
    await expect(row(page, 'admin@kafe.com')).toContainText('Admin');
    await expect(row(page, 'barista@kafe.com')).toContainText('Barista');
    await expect(row(page, 'cliente@kafe.com')).toContainText('Cliente');
    await expect(row(page, 'admin@kafe.com')).toContainText('Ativo');
  });

  test('"Novo usuário" opens the form', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('link', { name: /Novo usuário/ }).click();
    await expect(page).toHaveURL(/\/admin\/users\/new$/);
  });
});

test.describe('create user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users/new');
    await waitForHydration(page, 'form');
  });

  test('name and e-mail are natively required (browser blocks the submit)', async ({ page }) => {
    const name = page.getByLabel('Nome');
    await page.getByLabel('Email').fill('valid@e2e.kafe.com');
    await page.getByLabel('Senha').fill(PASSWORD);
    await page.getByRole('button', { name: 'Criar usuário' }).click();
    expect(await name.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(page).toHaveURL(/\/admin\/users\/new$/);
  });

  test('a password shorter than 8 characters is blocked natively (minlength) before zod runs', async ({ page }) => {
    const password = page.getByLabel('Senha');
    await page.getByLabel('Nome').fill('Alguém');
    await page.getByLabel('Email').fill('valid@e2e.kafe.com');
    await password.fill('short');
    await page.getByRole('button', { name: 'Criar usuário' }).click();
    expect(await password.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
    await expect(page).toHaveURL(/\/admin\/users\/new$/);
  });

  test('blocks an invalid e-mail with native type=email validation', async ({ page }) => {
    const email = page.getByLabel('Email');
    await page.getByLabel('Nome').fill('Alguém');
    await email.fill('nope');
    await page.getByLabel('Senha').fill(PASSWORD);
    await page.getByRole('button', { name: 'Criar usuário' }).click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
    await expect(page).toHaveURL(/\/admin\/users\/new$/);
  });

  test('creates a barista who can then sign in', async ({ page }) => {
    const name = uid('user-new');
    const email = `${name}@e2e.kafe.com`;
    created.push(name);
    await page.getByLabel('Nome').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Senha').fill(PASSWORD);
    await chooseRole(page, 'Barista');
    await page.getByRole('button', { name: 'Criar usuário' }).click();

    await expect(page.getByText('Usuário criado com sucesso.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/users$/);
    await expect(row(page, email)).toContainText('Barista');

    const api = await apiAs('admin');
    const login = await api.post(`${API_URL}/api/v1/auth/login`, { data: { email, password: PASSWORD } });
    expect(login.status()).toBe(200);
    expect(((await login.json()) as { user: { role: string } }).user.role).toBe('BARISTA');
    await api.dispose();
  });

  async function submitDuplicateEmail(page: Page) {
    await page.getByLabel('Nome').fill(uid('dup'));
    await page.getByLabel('Email').fill('admin@kafe.com');
    await page.getByLabel('Senha').fill(PASSWORD);
    await page.getByRole('button', { name: 'Criar usuário' }).click();
  }

  test('a network failure shows the error toast and stays on the form', async ({ page }) => {
    await page.route('**/api/v1/users', (route) => (route.request().method() === 'POST' ? route.abort() : route.continue()));
    await submitDuplicateEmail(page);
    await expect(page.getByText(/Erro ao criar usuário/)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/users\/new$/);
  });

  test('a duplicate e-mail (API 409) is reported as an error and stays on the form', async ({ page }) => {
    await submitDuplicateEmail(page);
    await expect(page.getByText(/Erro ao criar usuário/)).toBeVisible();
    await expect(page.getByText('Usuário criado com sucesso.')).toHaveCount(0);
    await expect(page).toHaveURL(/\/admin\/users\/new$/);
  });
});

test.describe('edit user', () => {
  test('changes the role and deactivates the user', async ({ page }) => {
    const user = await createUserViaApi('CLIENT');
    await page.goto(`/admin/users/${user.id}/edit`);
    await waitForHydration(page, 'form');
    await expect(page.getByRole('heading', { name: 'Editar usuário' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveValue(user.email);
    await expect(page.getByLabel('Email')).toBeDisabled();

    await chooseRole(page, 'Barista');
    await page.getByLabel('Ativo').uncheck();
    await page.getByRole('button', { name: /Salvar/ }).click();
    await expect(page.getByText('Usuário atualizado com sucesso.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/users$/);
    await expect(row(page, user.email)).toContainText('Barista');
    await expect(row(page, user.email)).toContainText('Inativo');

    const api = await apiAs('admin');
    const saved = await findByName<{ id: string; name: string; role: string; isActive: boolean }>(api, 'users', user.name);
    expect(saved).toMatchObject({ role: 'BARISTA', isActive: false });
    await api.dispose();
  });

  test('a clean form cancels without asking; a dirty one asks first', async ({ page }) => {
    const user = await createUserViaApi();
    await page.goto(`/admin/users/${user.id}/edit`);
    await waitForHydration(page, 'form');

    let dialogs = 0;
    page.on('dialog', (d) => {
      dialogs++;
      void d.accept();
    });
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page).toHaveURL(/\/admin\/users$/);
    expect(dialogs).toBe(0);

    await page.goto(`/admin/users/${user.id}/edit`);
    await waitForHydration(page, 'form');
    await page.getByLabel('Nome').fill(`${user.name}-x`);
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect.poll(() => dialogs).toBe(1);
    await expect(page).toHaveURL(/\/admin\/users$/);
  });

  test('the edit page renders for an existing user', async ({ page }) => {
    const user = await createUserViaApi();
    const res = await page.goto(`/admin/users/${user.id}/edit`);
    expect(res?.status()).toBe(200);
  });
});

test.describe('delete user', () => {
  test('confirms, removes the row and the account', async ({ page }) => {
    const user = await createUserViaApi();
    await page.goto('/admin/users');
    await waitForHydration(page, 'table');
    await row(page, user.email).getByRole('button', { name: 'Remover' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Remover usuário')).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(row(page, user.email)).toBeVisible();

    await row(page, user.email).getByRole('button', { name: 'Remover' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Remover' }).click();
    await expect(page.getByText('Usuário removido com sucesso.')).toBeVisible();
    await expect(row(page, user.email)).toHaveCount(0);

    const api = await apiAs('admin');
    expect(await findByName(api, 'users', user.name)).toBeUndefined();
    await api.dispose();
  });
});
