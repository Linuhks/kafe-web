import { test, expect, type Page } from '@playwright/test';
import { apiAs, createAnonymousOrder, uid } from './support/api';
import { authFile } from './support/users';

test.use({ storageState: authFile('admin') });

// Cards are <div role="button"> carrying the client name; the name is unique per test.
const card = (page: Page, name: string) => page.getByRole('button').filter({ hasText: name }).filter({ has: page.getByRole('button', { name: /Iniciar preparo|Concluir|Marcar como entregue/ }) });
const column = (page: Page, label: string) => page.locator('div.flex-none.w-80').filter({ hasText: label });

async function statusOf(id: string) {
  const api = await apiAs('admin');
  const body = (await (await api.get(`/api/v1/orders/${id}`)).json()) as { status: string };
  await api.dispose();
  return body.status;
}

test.describe('admin order queue (/admin/orders)', () => {
  test('renders the toolbar, the three columns and the stats', async ({ page }) => {
    await page.goto('/admin/orders');
    await expect(page.getByRole('heading', { name: 'Fila de pedidos' })).toBeVisible();
    await expect(page.getByText('Acompanhe e avance o status dos pedidos em tempo real.')).toBeVisible();
    await expect(page.getByPlaceholder('Buscar por cliente...')).toBeVisible();
    for (const label of ['Recebidos', 'Em preparo', 'Prontos']) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }
    for (const label of ['Pedidos na Fila', 'Tempo Médio de Preparo', 'Eficiência', 'Operação ativa']) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('a new order shows up in "Recebidos" with its item and the first action', async ({ page }) => {
    const name = uid('kanban');
    await createAnonymousOrder(name);
    await page.goto('/admin/orders');
    const c = card(page, name);
    await expect(c).toBeVisible();
    await expect(column(page, 'Recebidos').getByText(name)).toBeVisible();
    await expect(c.getByText(/×\s?\d+/)).toBeVisible();
    await expect(c.getByRole('button', { name: 'Iniciar preparo' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'Cancelar pedido' })).toBeVisible();
  });

  test('advances RECEIVED → IN_PREPARATION → READY → DELIVERED across the columns', async ({ page }) => {
    const name = uid('kanban-flow');
    const id = await createAnonymousOrder(name);
    await page.goto('/admin/orders');

    await card(page, name).getByRole('button', { name: 'Iniciar preparo' }).click();
    await expect(column(page, 'Em preparo').getByText(name)).toBeVisible();
    expect(await statusOf(id)).toBe('IN_PREPARATION');

    await card(page, name).getByRole('button', { name: 'Concluir' }).click();
    await expect(column(page, 'Prontos').getByText(name)).toBeVisible();
    expect(await statusOf(id)).toBe('READY');
    // READY orders cannot be cancelled from the card
    await expect(card(page, name).getByRole('button', { name: 'Cancelar pedido' })).toHaveCount(0);

    await card(page, name).getByRole('button', { name: 'Marcar como entregue' }).click();
    await expect(page.getByText(name)).toHaveCount(0);
    expect(await statusOf(id)).toBe('DELIVERED');
  });

  // Behaviour worth knowing: the barista queue asks for confirmation before cancelling, this one does not.
  test('the trash button cancels the order immediately (no confirmation)', async ({ page }) => {
    const name = uid('kanban-cancel');
    const id = await createAnonymousOrder(name);
    await page.goto('/admin/orders');
    await card(page, name).getByRole('button', { name: 'Cancelar pedido' }).click();
    await expect(page.getByText(name)).toHaveCount(0);
    expect(await statusOf(id)).toBe('CANCELLED');
  });

  test('search filters the cards by client name', async ({ page }) => {
    const mine = uid('kanban-find');
    const other = uid('kanban-other');
    await createAnonymousOrder(mine);
    await createAnonymousOrder(other);
    await page.goto('/admin/orders');
    await expect(page.getByText(other)).toBeVisible();

    await page.getByPlaceholder('Buscar por cliente...').fill(mine);
    await expect(page.getByText(mine)).toBeVisible();
    await expect(page.getByText(other)).toHaveCount(0);

    await page.getByPlaceholder('Buscar por cliente...').fill('');
    await expect(page.getByText(other)).toBeVisible();
  });

  test('clicking a card opens its detail dialog with an advance button', async ({ page }) => {
    const name = uid('kanban-detail');
    const id = await createAnonymousOrder(name);
    await page.goto('/admin/orders');
    await page.getByRole('button').filter({ hasText: name }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name })).toBeVisible();
    await expect(dialog.getByText(`#${id.slice(-6).toUpperCase()}`)).toBeVisible();
    await expect(dialog.getByText(/×\s?\d+/)).toBeVisible();
    await dialog.getByRole('button', { name: /Iniciar preparo/ }).click();
    await expect(dialog).toBeHidden();
    expect(await statusOf(id)).toBe('IN_PREPARATION');
  });

  test('the sort menu switches between newest and oldest', async ({ page }) => {
    await page.goto('/admin/orders');
    const trigger = page.getByRole('button', { name: 'Mais recentes' });
    await trigger.click();
    await page.getByRole('button', { name: 'Mais antigos' }).click();
    await expect(page.getByRole('button', { name: 'Mais antigos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mais recentes' })).toHaveCount(0);
  });

  test('newest-first puts a fresh order above an older one in the same column', async ({ page }) => {
    const older = uid('kanban-old');
    await createAnonymousOrder(older);
    await new Promise((r) => setTimeout(r, 1100));
    const newer = uid('kanban-new');
    await createAnonymousOrder(newer);
    await page.goto('/admin/orders');
    await expect(page.getByText(newer)).toBeVisible();
    await expect(page.getByText(older)).toBeVisible();
    const names = await column(page, 'Recebidos').locator('[role="button"]').allInnerTexts();
    const idx = (n: string) => names.findIndex((t) => t.includes(n));
    expect(idx(newer)).toBeGreaterThanOrEqual(0);
    expect(idx(newer)).toBeLessThan(idx(older));
  });

  test('the category tabs are present and selectable', async ({ page }) => {
    await page.goto('/admin/orders');
    for (const tab of ['Todos os Pedidos', 'Expressos', 'Lanches']) {
      await expect(page.getByRole('button', { name: tab })).toBeVisible();
    }
    await page.getByRole('button', { name: 'Lanches' }).click();
    await page.getByRole('button', { name: 'Todos os Pedidos' }).click();
    await expect(page.getByRole('heading', { name: 'Fila de pedidos' })).toBeVisible();
  });

  test('shows an error toast when the status update fails', async ({ page }) => {
    const name = uid('kanban-err');
    await createAnonymousOrder(name);
    await page.route('**/api/v1/orders/*/status', (route) => route.abort());
    await page.goto('/admin/orders');
    await card(page, name).getByRole('button', { name: 'Iniciar preparo' }).click();
    await expect(page.getByText('Erro ao atualizar status')).toBeVisible();
    await expect(column(page, 'Recebidos').getByText(name)).toBeVisible();
  });

  test('picks up orders created after load (15 s polling)', async ({ page }) => {
    test.setTimeout(60_000);
    // Create the order only after the first queue response, so it can only arrive through a refetch.
    const firstQueue = page.waitForResponse((r) => r.url().includes('/api/v1/orders/queue'));
    await page.goto('/admin/orders');
    await firstQueue;
    const name = uid('kanban-poll');
    await createAnonymousOrder(name);
    await expect(page.getByText(name)).toBeVisible({ timeout: 25_000 });
  });
});
