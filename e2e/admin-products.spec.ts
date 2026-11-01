import { test, expect, type Page } from '@playwright/test';
import { apiAs, deleteByName, findByName, listCategories, uid } from './support/api';
import type { APIRequestContext } from '@playwright/test';
import { authFile } from './support/users';
import { waitForHydration } from './support/hydration';

test.use({ storageState: authFile('admin') });

const created: string[] = [];
test.afterAll(async () => {
  const api = await apiAs('admin');
  for (const name of created) await deleteByName(api, 'products', name);
  await api.dispose();
});

const row = (page: Page, name: string) => page.getByRole('row').filter({ hasText: name });

/** The list is server-paginated (20/page) and search/chips only filter the current page. */
async function productsPageOf(api: APIRequestContext, name: string) {
  for (let pageNo = 1; pageNo < 20; pageNo++) {
    const body = (await (await api.get(`/api/v1/products?page=${pageNo}&limit=20`)).json()) as {
      data: { name: string }[];
      pagination: { totalPages: number };
    };
    if (body.data.some((p) => p.name === name)) return pageNo;
    if (pageNo >= body.pagination.totalPages) break;
  }
  throw new Error(`product ${name} not found in any page`);
}

async function openListWith(page: Page, name: string) {
  const api = await apiAs('admin');
  const pageNo = await productsPageOf(api, name);
  await api.dispose();
  await page.goto(`/admin/products?page=${pageNo}`);
  await waitForHydration(page, 'table');
}

async function createProductViaApi(name: string, price = '9.90') {
  const api = await apiAs('admin');
  const [category] = await listCategories(api);
  const res = await api.post('/api/v1/products', { data: { name, description: 'e2e', price, categoryId: category.id } });
  expect(res.ok()).toBe(true);
  const { id } = (await res.json()) as { id: string };
  await api.dispose();
  created.push(name);
  return id;
}

test.describe('products list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/products');
    await waitForHydration(page, 'table');
  });

  test('renders the catalog with price, category and availability', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Catálogo de Produtos' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Adicionar Produto/ })).toBeVisible();
    for (const header of ['Nome do Produto', 'Categoria', 'Preço', 'Disponibilidade', 'Ações']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
    expect(await page.getByRole('row').count()).toBeGreaterThan(1);
    await expect(page.getByText(/Mostrando \d+ de \d+ produtos/)).toBeVisible();
    await expect(page.getByRole('row').nth(1)).toContainText(/R\$\s?\d/);
  });

  test('search narrows the list and shows an empty state', async ({ page }) => {
    const all = await page.getByRole('row').count();
    const first = (await page.getByRole('row').nth(1).locator('td').first().innerText()).split('\n')[0].trim();
    await page.getByPlaceholder('Buscar produtos…').fill(first);
    await expect.poll(() => page.getByRole('row').count()).toBeLessThanOrEqual(all);
    await expect(row(page, first).first()).toBeVisible();

    await page.getByPlaceholder('Buscar produtos…').fill('zzzz-nao-existe');
    await expect(page.getByText('Nenhum produto encontrado.')).toBeVisible();
  });

  test('category chips filter and "Todos" restores', async ({ page }) => {
    const all = await page.getByRole('row').count();
    await page.getByRole('button', { name: 'Doces', exact: true }).click();
    await expect.poll(() => page.getByRole('row').count()).toBeLessThan(all);
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    await expect.poll(() => page.getByRole('row').count()).toBe(all);
  });

  test('sorting by price toggles the order', async ({ page }) => {
    const prices = async () =>
      (await page.getByRole('row').locator('td:nth-child(3)').allInnerTexts()).map((t) =>
        parseFloat(t.replace(/[^\d,]/g, '').replace(',', '.')),
      );
    await page.getByRole('columnheader', { name: 'Preço' }).click();
    const first = await prices();
    await page.getByRole('columnheader', { name: 'Preço' }).click();
    const second = await prices();
    const sorted = [...first].sort((a, b) => a - b);
    expect([JSON.stringify(first), JSON.stringify(second)]).toContain(JSON.stringify(sorted));
    expect(JSON.stringify(first)).not.toBe(JSON.stringify(second));
  });

  test('the availability switch persists to the API', async ({ page }) => {
    const name = uid('prod-switch');
    const id = await createProductViaApi(name);
    await openListWith(page, name);
    const toggle = page.getByRole('switch', { name: `Disponibilidade de ${name}` });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    const api = await apiAs('admin');
    await expect
      .poll(async () => ((await (await api.get(`/api/v1/products/${id}`)).json()) as { isAvailable: boolean }).isAvailable)
      .toBe(false);
    await api.dispose();
  });

  test('delete asks for confirmation and removes the product', async ({ page }) => {
    const name = uid('prod-del');
    await createProductViaApi(name);
    await openListWith(page, name);
    await row(page, name).getByRole('button', { name: 'Remover' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Remover produto')).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(row(page, name)).toBeVisible();

    await row(page, name).getByRole('button', { name: 'Remover' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Remover' }).click();
    await expect(row(page, name)).toHaveCount(0);
    const api = await apiAs('admin');
    expect(await findByName(api, 'products', name)).toBeUndefined();
    await api.dispose();
  });
});

test.describe('create product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/products/new');
    await waitForHydration(page, 'form');
  });

  test('validates name, category and price', async ({ page }) => {
    await page.getByRole('button', { name: 'Criar Produto' }).click();
    await expect(page.getByText('Nome é obrigatório.')).toBeVisible();
    await expect(page.getByText('Categoria é obrigatória.')).toBeVisible();
    await expect(page.getByText('Preço é obrigatório.')).toBeVisible();

    // min=0.01 on the number input: the browser blocks the submit first (native, browser-locale message),
    // so the custom "Preço deve ser um número positivo." is never reached for negative values.
    const price = page.getByLabel('Preço');
    await price.fill('-3');
    await page.getByRole('button', { name: 'Criar Produto' }).click();
    expect(await price.evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
    await expect(page).toHaveURL(/\/admin\/products\/new$/);
  });

  test('creates a product and lists it with the formatted price', async ({ page }) => {
    const name = uid('prod-new');
    created.push(name);
    await page.getByLabel('Nome', { exact: true }).fill(name);
    await page.getByLabel('Descrição').fill('feito no e2e');
    await page.locator('#categoryId').selectOption({ index: 1 });
    await page.getByLabel('Preço').fill('12.5');
    await page.getByRole('button', { name: 'Criar Produto' }).click();

    await expect(page.getByText('Produto criado com sucesso.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/products$/);
    await openListWith(page, name);
    await expect(row(page, name)).toContainText('R$ 12,50');
  });

  test('"Cancelar" returns to the list without saving', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);
  });
});

test.describe('edit product', () => {
  test('updates the price and persists it', async ({ page }) => {
    const name = uid('prod-edit');
    const id = await createProductViaApi(name, '10.00');
    await page.goto(`/admin/products/${id}/edit`);
    await waitForHydration(page, 'form');
    await expect(page.getByRole('heading', { name: 'Editar produto' })).toBeVisible();
    await expect(page.getByLabel('Nome')).toHaveValue(name);

    await page.getByLabel('Preço').fill('15.75');
    await page.getByRole('button', { name: /Salvar/ }).click();
    await expect(page.getByText('Produto atualizado com sucesso.')).toBeVisible();

    const api = await apiAs('admin');
    const saved = (await (await api.get(`/api/v1/products/${id}`)).json()) as { price: string };
    expect(Number(saved.price)).toBeCloseTo(15.75);
    await api.dispose();
  });

  test('adds and removes an ingredient', async ({ page }) => {
    const name = uid('prod-ingr');
    const id = await createProductViaApi(name);
    const api = await apiAs('admin');
    const ingredients = ((await (await api.get('/api/v1/inventory')).json()) as { data?: { name: string }[] }).data ?? [];
    await api.dispose();
    test.skip(ingredients.length === 0, 'seed has no ingredients');
    const ingredient = ingredients[0].name;

    await page.goto(`/admin/products/${id}/edit`);
    await waitForHydration(page, 'form');
    await expect(page.getByText('Nenhum ingrediente adicionado.')).toBeVisible();
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: ingredient }).click();
    await page.getByPlaceholder('Qtd.').fill('2');
    await page.getByRole('button', { name: 'Adicionar ingrediente' }).click();
    await expect(page.getByText('Ingrediente adicionado.')).toBeVisible();
    await expect(page.getByText('Nenhum ingrediente adicionado.')).toHaveCount(0);

    await page.getByRole('button', { name: /Remover ingrediente/ }).first().click();
    await expect(page.getByText('Ingrediente removido.')).toBeVisible();
    await expect(page.getByText('Nenhum ingrediente adicionado.')).toBeVisible();
  });

  test('an unknown id renders the 404 page', async ({ page }) => {
    const res = await page.goto('/admin/products/00000000-0000-0000-0000-000000000000/edit');
    expect(res?.status()).toBe(404);
  });
});
