import { test, expect } from '@playwright/test';
import { USERS, authFile, type Role } from './support/users';

type Who = Role | 'anon';

const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/orders',
  '/admin/categories',
  '/admin/categories/new',
  '/admin/products',
  '/admin/products/new',
  '/admin/inventory',
  '/admin/inventory/movements',
  '/admin/users',
  '/admin/users/new',
];
const BARISTA_ROUTES = ['/barista/queue'];
const AUTHENTICATED_ROUTES = ['/orders/me'];
const PUBLIC_ROUTES = ['/', '/cardapio', '/checkout', '/login'];

// Where a role ends up when it is not allowed on a route (proxy → /login → role home).
const bounce = (who: Who) => (who === 'anon' ? '/login' : USERS[who].home);

const allowed: Record<string, Who[]> = {
  admin: ['admin'],
  barista: ['admin', 'barista'],
  authenticated: ['admin', 'barista', 'client'],
};

function matrix(who: Who) {
  test.describe(`as ${who}`, () => {
    if (who !== 'anon') test.use({ storageState: authFile(who) });

    for (const route of ADMIN_ROUTES) {
      test(`${route} ${allowed.admin.includes(who) ? 'is reachable' : 'is blocked'}`, async ({ page }) => {
        await page.goto(route);
        if (allowed.admin.includes(who)) await expect(page).toHaveURL(new RegExp(`${route}$`));
        else await expect(page).toHaveURL(new RegExp(`${bounce(who)}$`));
      });
    }

    for (const route of BARISTA_ROUTES) {
      test(`${route} ${allowed.barista.includes(who) ? 'is reachable' : 'is blocked'}`, async ({ page }) => {
        await page.goto(route);
        if (allowed.barista.includes(who)) await expect(page).toHaveURL(new RegExp(`${route}$`));
        else await expect(page).toHaveURL(new RegExp(`${bounce(who)}$`));
      });
    }

    for (const route of AUTHENTICATED_ROUTES) {
      test(`${route} ${who === 'anon' ? 'is blocked' : 'is reachable'}`, async ({ page }) => {
        await page.goto(route);
        if (who === 'anon') await expect(page).toHaveURL(/\/login$/);
        else await expect(page).toHaveURL(new RegExp(`${route}$`));
      });
    }

    for (const route of PUBLIC_ROUTES) {
      // /login bounces authenticated users to their home on purpose
      if (route === '/login' && who !== 'anon') continue;
      test(`${route} is public`, async ({ page }) => {
        const res = await page.goto(route);
        expect(res?.ok()).toBe(true);
        await expect(page).toHaveURL(new RegExp(`${route === '/' ? '/?$' : `${route}$`}`));
      });
    }
  });
}

test.describe('page access (proxy.ts)', () => {
  for (const who of ['anon', 'client', 'barista', 'admin'] as Who[]) matrix(who);
});

test.describe('data access (API enforces roles, not just the UI)', () => {
  const adminOnly = [
    '/api/v1/dashboard/summary',
    '/api/v1/dashboard/top-products',
    '/api/v1/dashboard/peak-hours',
    '/api/v1/users',
  ];

  test.describe('anon', () => {
    for (const path of adminOnly) {
      test(`GET ${path} is rejected`, async ({ request }) => {
        const res = await request.get(path);
        expect([401, 403]).toContain(res.status());
      });
    }
  });

  for (const role of ['client', 'barista'] as Role[]) {
    test.describe(`as ${role}`, () => {
      test.use({ storageState: authFile(role) });
      for (const path of adminOnly) {
        test(`GET ${path} is forbidden`, async ({ request }) => {
          const res = await request.get(path);
          expect(res.status()).toBe(403);
        });
      }
    });
  }

  test.describe('as admin', () => {
    test.use({ storageState: authFile('admin') });
    for (const path of adminOnly) {
      test(`GET ${path} is allowed`, async ({ request }) => {
        const res = await request.get(path);
        expect(res.status()).toBe(200);
      });
    }
  });
});
