import { test, expect, type Page } from '@playwright/test';
import { apiAs, createOrder, uid } from './support/api';
import { authFile } from './support/users';

// Orders are found by their (unique) notes: the API names an order after the signed-in client.
const card = (page: Page, marker: string) => page.locator('div').filter({ hasText: marker }).filter({ has: page.getByRole('button') }).last();

async function newOrder(notes = uid('queue')) {
  const api = await apiAs('client');
  const id = await createOrder(api, { notes });
  await api.dispose();
  return { id, notes };
}

test.describe('barista queue', () => {
  test.use({ storageState: authFile('barista') });

  test('lists active orders with items, notes and the first status action', async ({ page }) => {
    const { notes } = await newOrder();
    await page.goto('/barista/queue');
    await expect(page.getByRole('heading', { name: 'Fila de pedidos' })).toBeVisible();
    const c = card(page, notes);
    await expect(c).toBeVisible();
    await expect(c.getByText(/× \d+/)).toBeVisible();
    await expect(c.getByText('Obs:')).toBeVisible();
    await expect(c.getByRole('button', { name: 'Iniciar preparo' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'Cancelar' })).toBeVisible();
  });

  test('advances RECEIVED → IN_PREPARATION → READY and READY leaves the queue', async ({ page }) => {
    const { notes } = await newOrder();
    await page.goto('/barista/queue');

    await card(page, notes).getByRole('button', { name: 'Iniciar preparo' }).click();
    await expect(page.getByText('Status atualizado').first()).toBeVisible();
    await expect(card(page, notes).getByRole('button', { name: 'Marcar como pronto' })).toBeVisible();

    await card(page, notes).getByRole('button', { name: 'Marcar como pronto' }).click();
    // The queue only shows RECEIVED / IN_PREPARATION, so a READY order disappears from it.
    await expect(page.getByText(notes)).toHaveCount(0);
  });

  test('persists the new status on the server', async ({ page }) => {
    const { id, notes } = await newOrder();
    await page.goto('/barista/queue');
    await card(page, notes).getByRole('button', { name: 'Iniciar preparo' }).click();
    await expect(card(page, notes).getByRole('button', { name: 'Marcar como pronto' })).toBeVisible();

    const api = await apiAs('barista');
    const res = await api.get(`/api/v1/orders/${id}`);
    expect(((await res.json()) as { status: string }).status).toBe('IN_PREPARATION');
    await api.dispose();
  });

  test('cancelling needs confirmation; "Voltar" keeps the order', async ({ page }) => {
    const { notes } = await newOrder();
    await page.goto('/barista/queue');
    await card(page, notes).getByRole('button', { name: 'Cancelar' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Cancelar pedido?')).toBeVisible();
    await dialog.getByRole('button', { name: 'Voltar' }).click();
    await expect(dialog).toBeHidden();
    await expect(card(page, notes)).toBeVisible();
  });

  test('confirming the cancellation removes the order from the queue', async ({ page }) => {
    const { id, notes } = await newOrder();
    await page.goto('/barista/queue');
    await card(page, notes).getByRole('button', { name: 'Cancelar' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Confirmar cancelamento' }).click();
    await expect(page.getByText(notes)).toHaveCount(0);

    const api = await apiAs('barista');
    const res = await api.get(`/api/v1/orders/${id}`);
    expect(((await res.json()) as { status: string }).status).toBe('CANCELLED');
    await api.dispose();
  });

  test('picks up orders created after the page loaded (15 s polling)', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/barista/queue');
    await expect(page.getByRole('heading', { name: 'Fila de pedidos' })).toBeVisible();
    const { notes } = await newOrder();
    await expect(page.getByText(notes)).toBeVisible({ timeout: 25_000 });
  });

  test('shows an error toast when the status update fails', async ({ page }) => {
    const { notes } = await newOrder();
    await page.route('**/api/v1/orders/*/status', (route) => route.abort());
    await page.goto('/barista/queue');
    await card(page, notes).getByRole('button', { name: 'Iniciar preparo' }).click();
    await expect(page.getByText('Erro ao atualizar status')).toBeVisible();
    // the order is still in its previous state
    await expect(card(page, notes).getByRole('button', { name: 'Iniciar preparo' })).toBeVisible();
  });

  test('low-stock banner lists the ingredients from /inventory/alerts', async ({ page }) => {
    await page.route('**/api/v1/inventory/alerts', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'a', name: 'Leite Teste', unit: 'L', currentStock: '1', minimumStock: '5', createdAt: '', updatedAt: '' },
          { id: 'b', name: 'Grãos Teste', unit: 'kg', currentStock: '0', minimumStock: '2', createdAt: '', updatedAt: '' },
        ]),
      }),
    );
    await page.goto('/barista/queue');
    await expect(page.getByText('Estoque baixo:')).toBeVisible();
    await expect(page.getByText('Leite Teste, Grãos Teste')).toBeVisible();
  });

  test('no banner when nothing is below the minimum', async ({ page }) => {
    await page.route('**/api/v1/inventory/alerts', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );
    await page.goto('/barista/queue');
    await expect(page.getByRole('heading', { name: 'Fila de pedidos' })).toBeVisible();
    await expect(page.getByText('Estoque baixo:')).toHaveCount(0);
  });

  test('shows the empty state when there are no active orders', async ({ page }) => {
    await page.route('**/api/v1/orders/queue', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );
    await page.goto('/barista/queue');
    await expect(page.getByText('Nenhum pedido ativo no momento.')).toBeVisible();
  });
});

test.describe('barista queue as admin', () => {
  test.use({ storageState: authFile('admin') });

  test('admins can work the same queue', async ({ page }) => {
    const { notes } = await newOrder();
    await page.goto('/barista/queue');
    await expect(card(page, notes).getByRole('button', { name: 'Iniciar preparo' })).toBeVisible();
  });
});
