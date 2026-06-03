export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import AdminOrderQueueClient from '@/components/admin/AdminOrderQueueClient'

export const metadata: Metadata = {
  title: 'Fila de pedidos | Kafe Admin',
}

export default function AdminOrdersPage() {
  return <AdminOrderQueueClient />
}
