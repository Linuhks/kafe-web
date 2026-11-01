import fs from 'node:fs';
import { test as setup } from '@playwright/test';
import { API_URL, apiLogin } from './support/api';
import { authFile, type Role } from './support/users';

const ROLES: Role[] = ['admin', 'barista', 'client'];

/** The saved cookie is reusable while kafe-api still accepts its token. */
async function savedTokenStillValid(role: Role, request: import('@playwright/test').APIRequestContext) {
  const file = authFile(role);
  if (!fs.existsSync(file)) return false;
  const state = JSON.parse(fs.readFileSync(file, 'utf8')) as { cookies: { name: string; value: string }[] };
  const token = state.cookies.find((c) => c.name === 'kafe_token')?.value;
  if (!token) return false;
  const res = await request.get(`${API_URL}/api/auth/get-session`, { headers: { Authorization: `Bearer ${token}` } });
  return res.status() === 200 && Boolean((await res.json())?.user);
}

// kafe-api throttles logins (5/min per IP), so sign in only when there is no valid session on disk.
for (const role of ROLES) {
  setup(`authenticate as ${role}`, async ({ context, baseURL, request }) => {
    if (await savedTokenStillValid(role, request)) return;
    const { token } = await apiLogin(role);
    await context.addCookies([
      { name: 'kafe_token', value: token, url: baseURL, httpOnly: true, sameSite: 'Strict' },
    ]);
    await context.storageState({ path: authFile(role) });
  });
}
