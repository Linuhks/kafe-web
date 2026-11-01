import { test, expect, type Page } from '@playwright/test';
import { authFile } from './support/users';
import { uid } from './support/api';

// Cart rows are <li>s; sonner toasts are <li data-sonner-toast> and must not match.
const cartRow = (page: Page, name: string) => page.locator('li:not([data-sonner-toast])').filter({ hasText: name });
const cartButton = (page: Page) => page.getByRole('button', { name: 'Carrinho' });
const firstAvailable = (page: Page) => page.locator('article').filter({ has: page.getByRole('button', { name: 'Adicionar' }) }).first();

async function addFirstProduct(page: Page) {
  const card = firstAvailable(page);
  const name = (await card.getByRole('heading', { level: 3 }).innerText()).trim();
  await card.getByRole('button', { name: 'Adicionar' }).click();
  return name;
}

test.describe('landing page', () => {
  test('presents the brand and links to the menu', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Kafe' })).toBeVisible();
    await expect(page.getByText('Café & Experiências')).toBeVisible();
    await page.getByRole('button', { name: /Explorar Cardápio/ }).click();
    await expect(page).toHaveURL(/\/cardapio$/);
  });
});

test.describe('menu (/cardapio)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cardapio');
  });

  test('lists categories and products from the API', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Cardápio' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Todos' })).toBeVisible();
    expect(await page.locator('article').count()).toBeGreaterThan(0);
    // every card shows a BRL price
    await expect(page.locator('article').first()).toContainText(/R\$\s?\d/);
  });

  test('filters products by category and restores them with "Todos"', async ({ page }) => {
    const all = await page.locator('article').count();
    await page.getByRole('button', { name: 'Doces' }).click();
    await expect.poll(() => page.locator('article').count()).toBeLessThan(all);
    await expect.poll(() => page.locator('article').count()).toBeGreaterThan(0);
    await page.getByRole('button', { name: 'Todos' }).click();
    await expect.poll(() => page.locator('article').count()).toBe(all);
  });

  test('anonymous visitors see the cart but no logout / "Meus Pedidos"', async ({ page }) => {
    await expect(cartButton(page)).toBeVisible();
    await expect(page.getByTitle('Sair')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Meus Pedidos/ })).toHaveCount(0);
  });
});

test.describe('cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cardapio');
  });

  test('starts empty with checkout disabled', async ({ page }) => {
    await cartButton(page).click();
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finalizar Pedido' })).toBeDisabled();
    await expect(page.getByText('R$ 0,00')).toBeVisible();
  });

  test('adding a product toasts, badges the cart and lists the item', async ({ page }) => {
    const name = await addFirstProduct(page);
    await expect(page.getByText(`${name} adicionado ao carrinho`)).toBeVisible();
    await expect(cartButton(page)).toContainText('1');
    await cartButton(page).click();
    const row = cartRow(page, name);
    await expect(row).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finalizar Pedido' })).toBeEnabled();
  });

  test('quantity buttons change the quantity and the total; trash empties the cart', async ({ page }) => {
    const name = await addFirstProduct(page);
    await cartButton(page).click();
    const row = cartRow(page, name);
    const [minus, plus, trash] = await row.getByRole('button').all();

    const totalText = () => page.getByText('Total', { exact: true }).locator('xpath=following-sibling::span').innerText();
    const unit = await totalText();

    await plus.click();
    await expect(row).toContainText('2');
    expect(await totalText()).not.toBe(unit);

    await minus.click();
    await expect(row).toContainText('1');
    await expect.poll(totalText).toBe(unit);

    await trash.click();
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible();
  });

  test('repeated adds of the same product merge into one line', async ({ page }) => {
    const card = firstAvailable(page);
    const name = (await card.getByRole('heading', { level: 3 }).innerText()).trim();
    await card.getByRole('button', { name: 'Adicionar' }).click();
    await card.getByRole('button', { name: 'Adicionar' }).click();
    await expect(cartButton(page)).toContainText('2');
    await cartButton(page).click();
    await expect(cartRow(page, name)).toHaveCount(1);
  });

  test('keeps the cart across a reload (sessionStorage)', async ({ page }) => {
    const name = await addFirstProduct(page);
    await page.reload();
    await expect(cartButton(page)).toContainText('1');
    await cartButton(page).click();
    await expect(cartRow(page, name)).toBeVisible();
  });

  test('"Continuar comprando" closes the sidebar', async ({ page }) => {
    await cartButton(page).click();
    // The sidebar slides off-screen with a transform (it stays in the DOM), so check the viewport.
    await expect(page.getByRole('heading', { name: 'Sua Seleção' })).toBeInViewport();
    await page.getByRole('button', { name: 'Continuar comprando' }).click();
    await expect(page.getByRole('heading', { name: 'Sua Seleção' })).not.toBeInViewport();
  });
});

test.describe('placing an order from the menu', () => {
  test('creates the order and shows its id, then empties the cart', async ({ page }) => {
    await page.goto('/cardapio');
    await addFirstProduct(page);
    await cartButton(page).click();
    await page.getByRole('button', { name: 'Finalizar Pedido' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Finalizar pedido')).toBeVisible();
    await dialog.getByLabel('Seu nome').fill(uid('anon'));
    await dialog.getByLabel('Observações').fill('sem açúcar');
    await dialog.getByRole('button', { name: 'Confirmar pedido' }).click();

    await expect(dialog.getByText('Pedido confirmado!')).toBeVisible();
    await expect(dialog.getByText(/^ID: /)).toBeVisible();
    await dialog.getByRole('button', { name: 'Fechar' }).first().click();
    await expect(dialog).toBeHidden();
    await expect(cartButton(page)).not.toContainText(/\d/);
  });

  test('rejects a name longer than 100 characters', async ({ page }) => {
    await page.goto('/cardapio');
    await addFirstProduct(page);
    await cartButton(page).click();
    await page.getByRole('button', { name: 'Finalizar Pedido' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Seu nome').fill('x'.repeat(101));
    await dialog.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(dialog.getByText('Nome deve ter no máximo 100 caracteres')).toBeVisible();
  });

  async function submitOrderWithStubbedApi(page: Page, fulfillOrAbort: 'abort' | 500) {
    await page.route('**/api/v1/orders', (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      return fulfillOrAbort === 'abort' ? route.abort() : route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/cardapio');
    await addFirstProduct(page);
    await cartButton(page).click();
    await page.getByRole('button', { name: 'Finalizar Pedido' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Confirmar pedido' }).click();
  }

  test('shows an error toast when the request fails (network error) and keeps the cart', async ({ page }) => {
    await submitOrderWithStubbedApi(page, 'abort');
    await expect(page.getByText('Erro ao criar pedido')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).first().click();
    await expect(cartButton(page)).toContainText('1');
  });

  test('shows an error toast when the API answers 500 and keeps the cart', async ({ page }) => {
    await submitOrderWithStubbedApi(page, 500);
    await expect(page.getByText('Erro ao criar pedido')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).first().click();
    await expect(cartButton(page)).toContainText('1');
  });
});

test.describe('signed-in client', () => {
  test.use({ storageState: authFile('client') });

  test('menu nav shows the user, logout and "Meus Pedidos"', async ({ page }) => {
    await page.goto('/cardapio');
    await expect(page.getByTitle('Sair')).toBeVisible();
    await expect(page.getByRole('link', { name: /Meus Pedidos/ })).toBeVisible();
    await expect(cartButton(page)).toBeVisible();
  });

  test('an order placed from the menu appears in "Meus Pedidos"', async ({ page }) => {
    await page.goto('/cardapio');
    await addFirstProduct(page);
    await cartButton(page).click();
    await page.getByRole('button', { name: 'Finalizar Pedido' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(dialog.getByText('Pedido confirmado!')).toBeVisible();
    // The API names the order after the signed-in user, so match on the order id instead.
    const id = (await dialog.getByText(/^ID: /).innerText()).replace('ID: ', '').trim();

    await page.goto('/orders/me');
    await expect(page.getByText(id.slice(0, 8)).first()).toBeVisible();
  });

  test('"Meus Pedidos" lists orders with status badges and BRL totals', async ({ page }) => {
    await page.goto('/orders/me');
    await expect(page.getByRole('heading', { name: 'Meus Pedidos' })).toBeVisible();
    await expect(page.getByText(/× \d+/).first()).toBeVisible();
    await expect(page.getByText(/R\$\s?\d/).first()).toBeVisible();
    await expect(page.getByText(/Recebido|Em preparo|Pronto|Entregue|Cancelado/).first()).toBeVisible();
  });

  test('barista/admin-only cart is hidden for staff roles', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: authFile('barista') });
    const page = await ctx.newPage();
    await page.goto('/cardapio');
    await expect(page.getByTitle('Sair')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Carrinho' })).toHaveCount(0);
    await ctx.close();
  });
});

test.describe('checkout and confirmation pages', () => {
  test('/checkout renders the three sections, the summary and the confirm button', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: 'Finalizar Compra' })).toBeVisible();
    for (const section of ['Informações de Contato', 'Endereço de Entrega', 'Forma de Pagamento']) {
      await expect(page.getByText(section)).toBeVisible();
    }
    await expect(page.getByText('Resumo do Pedido')).toBeVisible();
    await expect(page.getByRole('button', { name: /Confirmar Compra/ })).toBeVisible();
  });

  test('/checkout/confirmation thanks the customer and links back to the menu', async ({ page }) => {
    await page.goto('/checkout/confirmation');
    await expect(page.getByRole('heading', { name: 'Obrigado pelo seu pedido' })).toBeVisible();
    await page.getByRole('link', { name: /Voltar à Loja/ }).click();
    await expect(page).toHaveURL(/\/cardapio$/);
  });
});
