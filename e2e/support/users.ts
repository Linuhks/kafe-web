// Accounts created by `pnpm seed` in kafe-api.
export type Role = 'admin' | 'barista' | 'client';

export const USERS: Record<Role, { email: string; password: string; home: string }> = {
  admin: { email: 'admin@kafe.com', password: 'admin123', home: '/admin/dashboard' },
  barista: { email: 'barista@kafe.com', password: 'barista123', home: '/barista/queue' },
  client: { email: 'cliente@kafe.com', password: 'cliente123', home: '/orders/me' },
};

export const authFile = (role: Role) => `playwright/.auth/${role}.json`;
