import { request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { USERS, type Role } from './users';

export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3333';

export interface LoginResult {
  token: string;
  user: { id: string; name: string; email: string; role: string };
}

/** Signs in straight against kafe-api (bypasses the UI and the Next login rate limit). */
export async function apiLogin(role: Role, api?: APIRequestContext): Promise<LoginResult> {
  const ctx = api ?? (await playwrightRequest.newContext({ baseURL: API_URL }));
  const res = await ctx.post(`${API_URL}/api/v1/auth/login`, {
    data: { email: USERS[role].email, password: USERS[role].password },
  });
  if (res.status() !== 200) throw new Error(`API login as ${role} failed: ${res.status()}`);
  const body = (await res.json()) as LoginResult;
  if (!api) await ctx.dispose();
  return body;
}

/** An authenticated API client for arranging or inspecting data. */
export async function apiAs(role: Role): Promise<APIRequestContext> {
  const { token } = await apiLogin(role);
  return playwrightRequest.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });
}

/** Unique, greppable suffix so tests can find (and clean up) what they created. */
export const uid = (prefix = 'e2e') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

interface Page<T> {
  data: T[];
}

export async function listProducts(api: APIRequestContext) {
  const res = await api.get('/api/v1/products');
  return ((await res.json()) as Page<{ id: string; name: string; isAvailable: boolean; price: string }>).data;
}

export async function listCategories(api: APIRequestContext) {
  const res = await api.get('/api/v1/categories');
  return ((await res.json()) as Page<{ id: string; name: string }>).data;
}

/** Creates an order (as the signed-in API client) and returns its id. */
export async function createOrder(
  api: APIRequestContext,
  opts: { clientName?: string; notes?: string; productId?: string; quantity?: number } = {},
) {
  const productId = opts.productId ?? (await listProducts(api)).find((p) => p.isAvailable)?.id;
  if (!productId) throw new Error('No available product to order');
  const res = await api.post('/api/v1/orders', {
    data: {
      clientName: opts.clientName ?? uid('cliente'),
      notes: opts.notes,
      items: [{ productId, quantity: opts.quantity ?? 1 }],
    },
  });
  if (res.status() >= 300) throw new Error(`createOrder failed: ${res.status()} ${await res.text()}`);
  const body = (await res.json()) as { id?: string; data?: { id: string } };
  return (body.id ?? body.data?.id) as string;
}

type Collection = 'categories' | 'products' | 'users';

/** Best-effort removal of rows a test created (matched by exact name). */
export async function deleteByName(api: APIRequestContext, collection: Collection, name: string) {
  const res = await api.get(`/api/v1/${collection}`);
  if (!res.ok()) return;
  const rows = ((await res.json()) as { data?: { id: string; name: string }[] }).data ?? [];
  for (const row of rows.filter((r) => r.name === name)) await api.delete(`/api/v1/${collection}/${row.id}`);
}

export async function findByName<T extends { id: string; name: string }>(
  api: APIRequestContext,
  collection: Collection,
  name: string,
): Promise<T | undefined> {
  const res = await api.get(`/api/v1/${collection}`);
  const rows = ((await res.json()) as { data?: T[] }).data ?? [];
  return rows.find((r) => r.name === name);
}

/** An order placed without signing in, so the API keeps the given client name verbatim. */
export async function createAnonymousOrder(clientName: string) {
  const ctx = await playwrightRequest.newContext({ baseURL: API_URL });
  const products = (await (await ctx.get('/api/v1/products')).json()) as { data: { id: string; isAvailable: boolean }[] };
  const productId = products.data.find((p) => p.isAvailable)!.id;
  const res = await ctx.post('/api/v1/orders', { data: { clientName, items: [{ productId, quantity: 1 }] } });
  if (res.status() !== 201) throw new Error(`anonymous order failed: ${res.status()}`);
  const { id } = (await res.json()) as { id: string };
  await ctx.dispose();
  return id;
}
