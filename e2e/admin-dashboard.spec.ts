import { test, expect } from '@playwright/test';
import { apiAs } from './support/api';
import { authFile } from './support/users';
import { waitForHydration } from './support/hydration';

const todayLocal = () => new Date().toLocaleDateString('sv-SE');
// The same day boundaries the page sends to the API (see lib/api/dashboard.ts).
const dayQuery = (from: string, to: string) =>
  `from=${encodeURIComponent(new Date(`${from}T00:00:00`).toISOString())}&to=${encodeURIComponent(new Date(`${to}T23:59:59.999`).toISOString())}`;

const brl = (value: string | number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)).replace(/ /g, ' ');

test.describe('admin dashboard', () => {
  test.use({ storageState: authFile('admin') });

  test('shows the three summary cards with the API numbers', async ({ page }) => {
    const api = await apiAs('admin');
    const summary = (await (await api.get(`/api/v1/dashboard/summary?${dayQuery(todayLocal(), todayLocal())}`)).json()) as {
      totalOrders: number;
      totalRevenue: string;
      avgOrderValue: string;
    };
    await api.dispose();

    await page.goto('/admin/dashboard');
    await expect(page.getByRole('heading', { name: 'Visão Geral' })).toBeVisible();
    const cards = page.locator('p', { hasText: /^(Total de Pedidos|Receita Total|Ticket Médio)$/i });
    await expect(cards).toHaveCount(3);
    const text = (await page.locator('main, body').first().innerText()).replace(/ /g, ' ');
    expect(text).toContain(String(summary.totalOrders));
    expect(text).toContain(brl(summary.totalRevenue));
    expect(text).toContain(brl(summary.avgOrderValue));
  });

  test('does not invent trend percentages on the cards', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page.getByRole('heading', { name: 'Visão Geral' })).toBeVisible();
    await expect(page.getByText(/^[+-]\d+%$/)).toHaveCount(0);
  });

  test('lists top products from the API, best seller first', async ({ page }) => {
    const api = await apiAs('admin');
    const top = (await (await api.get(`/api/v1/dashboard/top-products?limit=10&${dayQuery(todayLocal(), todayLocal())}`)).json()) as {
      productName: string;
      quantitySold: number;
    }[];
    await api.dispose();
    test.skip(top.length === 0, 'no sales today');

    await page.goto('/admin/dashboard');
    const table = page.getByRole('table');
    await expect(table.getByRole('columnheader', { name: 'Produto' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Qtd. Vendida' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Receita' })).toBeVisible();
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(top.length);
    await expect(rows.first()).toContainText(top[0].productName);
    await expect(rows.first()).toContainText(String(top[0].quantitySold));
  });

  test('renders the peak-hours chart with one bar per hour', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const chart = page.getByLabel('Pedidos por hora do dia');
    await expect(chart).toBeVisible();
    await expect(chart.locator('rect')).toHaveCount(24);
  });

  test('peak-hours chart text is legible (>= 9px rendered)', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const label = page.getByLabel('Pedidos por hora do dia').locator('text').first();
    await expect(label).toBeVisible();
    const px = await label.evaluate((el) => {
      const svg = (el as SVGTextElement).ownerSVGElement!;
      const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      return parseFloat(getComputedStyle(el).fontSize) * scale;
    });
    expect(px).toBeGreaterThanOrEqual(9);
  });

  test('"Gerar Relatório" shows the confirmation toast', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const generate = page.getByRole('button', { name: 'Gerar Relatório' });
    await waitForHydration(page, generate);
    await generate.click();
    await expect(page.getByText('Geração de relatório iniciada')).toBeVisible();
  });

  test('the date pickers write from/to to the URL', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await waitForHydration(page, '#date-from');
    await page.getByLabel('De', { exact: true }).fill('2026-01-10');
    await expect(page).toHaveURL(/from=2026-01-10/);
    await page.getByLabel('Até', { exact: true }).fill('2026-01-20');
    await expect(page).toHaveURL(/to=2026-01-20/);
    await expect(page.getByLabel('De', { exact: true })).toHaveValue('2026-01-10');
    await expect(page.getByLabel('Até', { exact: true })).toHaveValue('2026-01-20');
  });

  test('defaults the date pickers to today (local day)', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page.getByLabel('De', { exact: true })).toHaveValue(todayLocal());
    await expect(page.getByLabel('Até', { exact: true })).toHaveValue(todayLocal());
  });

  test('a range with no sales shows zeros and the empty states', async ({ page }) => {
    await page.goto('/admin/dashboard?from=2000-01-01&to=2000-01-02');
    await expect(page.getByText('R$ 0,00').first()).toBeVisible();
    await expect(page.getByText('Ainda sem dados de vendas')).toBeVisible();
    await expect(page.getByText('Aguardando Tráfego Horário')).toBeVisible();
  });

  test('a wide range shows at least today\'s numbers', async ({ page }) => {
    const api = await apiAs('admin');
    const wide = (await (await api.get(`/api/v1/dashboard/summary?${dayQuery('2000-01-01', todayLocal())}`)).json()) as {
      totalOrders: number;
    };
    await api.dispose();
    await page.goto(`/admin/dashboard?from=2000-01-01&to=${todayLocal()}`);
    await expect(page.getByText(String(wide.totalOrders), { exact: true }).first()).toBeVisible();
  });

  test('has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/admin/dashboard');
    await expect(page.getByRole('heading', { name: 'Visão Geral' })).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
});

test.describe('admin sidebar', () => {
  test.use({ storageState: authFile('admin') });

  test('shows the signed-in admin and role', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const aside = page.locator('aside');
    await expect(aside.getByText('Admin Kafe')).toBeVisible();
    await expect(aside.getByText('ADMIN', { exact: true })).toBeVisible();
    await expect(aside.getByText('Configurações')).toBeVisible();
  });

  const links: [string, RegExp][] = [
    ['Produtos', /\/admin\/products$/],
    ['Categorias', /\/admin\/categories$/],
    ['Usuários', /\/admin\/users$/],
    ['Estoque', /\/admin\/inventory$/],
    ['Dashboard', /\/admin\/dashboard$/],
  ];
  for (const [label, url] of links) {
    test(`"${label}" navigates to ${url.source}`, async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.locator('aside').getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(url);
    });
  }
});
