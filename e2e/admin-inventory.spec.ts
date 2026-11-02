import { test, expect, type Page } from '@playwright/test';
import { apiAs, uid } from './support/api';
import { authFile } from './support/users';
import { waitForHydration } from './support/hydration';

test.use({ storageState: authFile('admin') });

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: string;
  minimumStock: string;
}

async function ingredients(): Promise<Ingredient[]> {
  const api = await apiAs('admin');
  const body = (await (await api.get('/api/v1/inventory')).json()) as { data: Ingredient[] };
  await api.dispose();
  return body.data;
}

const row = (page: Page, name: string) => page.getByRole('row').filter({ has: page.getByRole('cell', { name, exact: true }) });

test.describe('inventory list', () => {
  test('lists ingredients with stock figures and a status badge', async ({ page }) => {
    const all = await ingredients();
    test.skip(all.length === 0, 'seed has no ingredients');
    await page.goto('/admin/inventory');
    await expect(page.getByRole('heading', { name: 'Estoque', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver movimentações' })).toBeVisible();
    for (const header of ['Unidade', 'Estoque atual', 'Estoque mínimo']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
    await expect(page.getByRole('row')).toHaveCount(all.length + 1);
    const first = all[0];
    await expect(row(page, first.name)).toContainText(first.unit);
    await expect(row(page, first.name)).toContainText(first.currentStock);
    await expect(row(page, first.name)).toContainText(first.minimumStock);
  });

  test('flags ingredients below the minimum stock', async ({ page }) => {
    const all = await ingredients();
    await page.goto('/admin/inventory');
    for (const ing of all) {
      const low = parseFloat(ing.currentStock) < parseFloat(ing.minimumStock);
      await expect(row(page, ing.name)).toContainText(low ? 'ESTOQUE BAIXO' : 'OK');
    }
  });

  test('"Reabastecer" opens the restock page for that ingredient', async ({ page }) => {
    const [first] = await ingredients();
    await page.goto('/admin/inventory');
    await row(page, first.name).getByRole('link', { name: 'Reabastecer' }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/inventory/${first.id}/restock$`));
    await expect(page.getByRole('heading', { name: 'Reabastecer ingrediente' })).toBeVisible();
  });
});

test.describe('restock', () => {
  test('adds stock, toasts, returns to the list and records a movement', async ({ page }) => {
    const [first] = await ingredients();
    const note = uid('restock');
    await page.goto(`/admin/inventory/${first.id}/restock`);
    await waitForHydration(page, 'form');
    await page.getByLabel('Quantidade a adicionar').fill('2.5');
    await page.getByLabel(/Nota/).fill(note);
    await page.getByRole('button', { name: 'Reabastecer', exact: true }).click();

    await expect(page.getByText('Estoque atualizado com sucesso.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/inventory$/);

    const after = (await ingredients()).find((i) => i.id === first.id)!;
    expect(parseFloat(after.currentStock)).toBeCloseTo(parseFloat(first.currentStock) + 2.5);

    await page.goto('/admin/inventory/movements');
    await expect(page.getByText(note)).toBeVisible();
  });

  test('blocks a zero or negative quantity (native min=0.01)', async ({ page }) => {
    const [first] = await ingredients();
    await page.goto(`/admin/inventory/${first.id}/restock`);
    await waitForHydration(page, 'form');
    const quantity = page.getByLabel('Quantidade a adicionar');
    await quantity.fill('0');
    await page.getByRole('button', { name: 'Reabastecer', exact: true }).click();
    expect(await quantity.evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
    await expect(page).toHaveURL(/\/restock$/);
  });

  test('shows an error toast when the request fails', async ({ page }) => {
    const [first] = await ingredients();
    await page.route('**/api/v1/inventory/*/restock', (route) => route.abort());
    await page.goto(`/admin/inventory/${first.id}/restock`);
    await waitForHydration(page, 'form');
    await page.getByLabel('Quantidade a adicionar').fill('1');
    await page.getByRole('button', { name: 'Reabastecer', exact: true }).click();
    await expect(page.getByText('Erro ao reabastecer. Tente novamente.')).toBeVisible();
    await expect(page).toHaveURL(/\/restock$/);
  });

  test('"Cancelar" goes back to the list', async ({ page }) => {
    const [first] = await ingredients();
    await page.goto(`/admin/inventory/${first.id}/restock`);
    await waitForHydration(page, 'form');
    await page.getByRole('button', { name: /Voltar|Cancelar/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/inventory$/);
  });
});

test.describe('stock movements', () => {
  test('lists movements with their columns', async ({ page }) => {
    await page.goto('/admin/inventory/movements');
    await expect(page.getByRole('heading', { name: 'Movimentações de estoque' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Voltar ao estoque/ })).toBeVisible();
    for (const header of ['Ingrediente', 'Tipo', 'Quantidade', 'Nota', 'Pedido', 'Data']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
  });

  test('a future date range shows the empty state', async ({ page }) => {
    await page.goto('/admin/inventory/movements?from=2999-01-01&to=2999-12-31');
    await expect(page.getByText('Nenhuma movimentação encontrada.')).toBeVisible();
  });

  test('the date pickers update the URL', async ({ page }) => {
    await page.goto('/admin/inventory/movements');
    await waitForHydration(page, '#date-from');
    await page.getByLabel('De', { exact: true }).fill('2026-01-01');
    await expect(page).toHaveURL(/from=2026-01-01/);
  });

  test('the ingredient filter narrows the rows to one ingredient', async ({ page }) => {
    const [first] = await ingredients();
    await page.goto(`/admin/inventory/movements?ingredientId=${first.id}`);
    const rows = page.getByRole('row');
    const count = await rows.count();
    for (let i = 1; i < count; i++) {
      const text = await rows.nth(i).innerText();
      if (text.includes('Nenhuma movimentação')) continue;
      expect(text).toContain(first.name);
    }
  });

  test('"Voltar ao estoque" returns to the list', async ({ page }) => {
    await page.goto('/admin/inventory/movements');
    await page.getByRole('link', { name: /Voltar ao estoque/ }).click();
    await expect(page).toHaveURL(/\/admin\/inventory$/);
  });
});
