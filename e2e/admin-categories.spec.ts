import { test, expect } from '@playwright/test';
import { apiAs, deleteByName, findByName, uid } from './support/api';
import { authFile } from './support/users';
import { waitForHydration } from './support/hydration';

test.use({ storageState: authFile('admin') });

const created: string[] = [];
test.afterAll(async () => {
  const api = await apiAs('admin');
  for (const name of created) await deleteByName(api, 'categories', name);
  await api.dispose();
});

const row = (page: import('@playwright/test').Page, name: string) => page.getByRole('row').filter({ hasText: name });

test.describe('categories list', () => {
  test('lists categories with order, status and row actions', async ({ page }) => {
    await page.goto('/admin/categories');
    await expect(page.getByRole('heading', { name: 'Categorias', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Nova categoria/ })).toBeVisible();
    const rows = page.getByRole('row');
    expect(await rows.count()).toBeGreaterThan(1);
    await expect(page.getByText(/Exibindo \d+ categorias?/)).toBeVisible();
    await expect(rows.nth(1).getByRole('link', { name: 'Editar' })).toBeVisible();
    await expect(rows.nth(1).getByRole('button', { name: 'Remover' })).toBeVisible();
  });

  test('"Nova categoria" opens the creation form', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.getByRole('link', { name: /Nova categoria/ }).click();
    await expect(page).toHaveURL(/\/admin\/categories\/new$/);
    await expect(page.getByRole('heading', { name: 'Nova categoria' })).toBeVisible();
  });
});

test.describe('create category', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/categories/new');
    await waitForHydration(page, 'form');
  });

  test('requires a name', async ({ page }) => {
    await page.getByRole('button', { name: 'Criar categoria' }).click();
    await expect(page.getByText('Nome é obrigatório.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/categories\/new$/);
  });

  test('creates a category, toasts and shows it in the list', async ({ page }) => {
    const name = uid('cat');
    created.push(name);
    await page.getByLabel('Nome').fill(name);
    await page.getByLabel(/Descrição/).fill('criada pelo e2e');
    await page.getByLabel(/Ordem de exibição/).fill('77');
    await page.getByRole('button', { name: 'Criar categoria' }).click();

    await expect(page.getByText('Categoria criada com sucesso.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/categories$/);
    const r = row(page, name);
    await expect(r).toBeVisible();
    await expect(r).toContainText('criada pelo e2e');
    await expect(r).toContainText('77');
    await expect(r).toContainText('Ativo');
  });

  test('shows an error toast when the API rejects the category', async ({ page }) => {
    await page.route('**/api/v1/categories', (route) =>
      route.request().method() === 'POST' ? route.abort() : route.continue(),
    );
    await page.getByLabel('Nome').fill(uid('cat-fail'));
    await page.getByRole('button', { name: 'Criar categoria' }).click();
    await expect(page.getByText(/Erro ao criar categoria/)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/categories\/new$/);
  });
});

test.describe('edit category', () => {
  test('edits name, deactivates it and persists on the server', async ({ page }) => {
    const name = uid('cat-edit');
    const renamed = `${name}-v2`;
    created.push(name, renamed);
    const api = await apiAs('admin');
    const res = await api.post('/api/v1/categories', { data: { name, description: 'antes', sortOrder: 5 } });
    expect(res.ok()).toBe(true);
    const { id } = (await res.json()) as { id: string };

    await page.goto(`/admin/categories/${id}/edit`);
    await waitForHydration(page, 'form');
    await expect(page.getByRole('heading', { name: 'Editar categoria' })).toBeVisible();
    await expect(page.getByLabel('Nome')).toHaveValue(name);
    await page.getByLabel('Nome').fill(renamed);
    await page.getByLabel('Ativo').uncheck();
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.getByText('Categoria atualizada com sucesso.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/categories$/);
    await expect(row(page, renamed)).toContainText('Inativo');

    const saved = await findByName<{ id: string; name: string; isActive: boolean; description: string }>(api, 'categories', renamed);
    expect(saved?.isActive).toBe(false);
    expect(saved?.description).toBe('antes');
    await api.dispose();
  });

  test('requires a name when editing', async ({ page }) => {
    const name = uid('cat-edit-val');
    created.push(name);
    const api = await apiAs('admin');
    const { id } = (await (await api.post('/api/v1/categories', { data: { name } })).json()) as { id: string };
    await api.dispose();

    await page.goto(`/admin/categories/${id}/edit`);
    await waitForHydration(page, 'form');
    await page.getByLabel('Nome').fill('');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();
    await expect(page.getByText('Nome é obrigatório.')).toBeVisible();
  });

  test('an unknown id renders the 404 page', async ({ page }) => {
    const res = await page.goto('/admin/categories/00000000-0000-0000-0000-000000000000/edit');
    expect(res?.status()).toBe(404);
  });
});

test.describe('delete category', () => {
  test('asks for confirmation, then removes the row', async ({ page }) => {
    const name = uid('cat-del');
    created.push(name);
    const api = await apiAs('admin');
    await api.post('/api/v1/categories', { data: { name } });

    await page.goto('/admin/categories');
    await waitForHydration(page, 'table');
    await row(page, name).getByRole('button', { name: 'Remover' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Remover categoria')).toBeVisible();
    await expect(dialog.getByText(new RegExp(`categoria "${name}"`))).toBeVisible();
    await dialog.getByRole('button', { name: 'Remover' }).click();

    await expect(page.getByText('Categoria removida com sucesso.')).toBeVisible();
    await expect(row(page, name)).toHaveCount(0);
    expect(await findByName(api, 'categories', name)).toBeUndefined();
    await api.dispose();
  });

  test('cancelling the dialog keeps the category', async ({ page }) => {
    const name = uid('cat-keep');
    created.push(name);
    const api = await apiAs('admin');
    await api.post('/api/v1/categories', { data: { name } });
    await api.dispose();

    await page.goto('/admin/categories');
    await waitForHydration(page, 'table');
    await row(page, name).getByRole('button', { name: 'Remover' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(row(page, name)).toBeVisible();
  });
});
