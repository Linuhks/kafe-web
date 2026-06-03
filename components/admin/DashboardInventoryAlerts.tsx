import Link from 'next/link'
import { Package } from 'lucide-react'
import type { InventoryAlert } from '@/lib/api/inventory'

export default function DashboardInventoryAlerts({ alerts }: { alerts: InventoryAlert[] }) {
  if (alerts.length === 0) return null

  return (
    <section className="bg-[var(--kafe-surface-container-lowest)] rounded-3xl border border-[var(--kafe-outline-variant)]/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-headline-md text-[var(--kafe-on-surface)]">Inventory Alerts</h2>
        <span className="px-3 py-1 rounded-full bg-[var(--kafe-error-container)] text-[var(--kafe-on-error-container)] text-label-sm">
          {alerts.length} Items Critical
        </span>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isCritical = alert.stockPct <= 15
          return (
            <div key={alert.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--kafe-surface-container)] flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-[var(--kafe-on-surface-variant)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-sm font-medium text-[var(--kafe-on-surface)] truncate">{alert.name}</p>
                  <p className="text-label-sm text-[var(--kafe-on-surface-variant)] shrink-0 ml-2">
                    {alert.currentStock} {alert.unit}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-[var(--kafe-surface-container)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCritical ? 'bg-[var(--kafe-error)]' : 'bg-[var(--kafe-secondary-fixed-dim)]'
                    }`}
                    style={{ width: `${Math.max(alert.stockPct, 2)}%` }}
                  />
                </div>
              </div>
              <Link
                href="/admin/inventory"
                className="shrink-0 px-3 py-1.5 rounded-lg border border-[var(--kafe-outline-variant)] text-label-sm text-[var(--kafe-primary)] hover:bg-[var(--kafe-surface-container-low)] transition-colors"
              >
                Restock Now
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
