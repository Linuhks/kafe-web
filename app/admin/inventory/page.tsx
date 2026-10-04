export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInventory } from '@/lib/api/inventory'

export default async function AdminInventoryPage() {
  const { ingredients } = await getInventory()
  const t = await getTranslations('inventoryList.status')
  const ti = await getTranslations('adminInventory')
  const tc = await getTranslations('common')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{ti('title')}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/inventory/movements">{ti('viewMovements')}</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">{tc('name')}</th>
              <th className="px-4 py-3 text-left font-medium">{ti('unit')}</th>
              <th className="px-4 py-3 text-left font-medium">{ti('currentStock')}</th>
              <th className="px-4 py-3 text-left font-medium">{ti('minimumStock')}</th>
              <th className="px-4 py-3 text-left font-medium">{tc('status')}</th>
              <th className="px-4 py-3 text-left font-medium">{tc('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {ti('empty')}
                </td>
              </tr>
            ) : (
              ingredients.map((ingredient) => {
                const isLow =
                  parseFloat(ingredient.currentStock) < parseFloat(ingredient.minimumStock)
                return (
                  <tr key={ingredient.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{ingredient.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ingredient.unit}</td>
                    <td className="px-4 py-3">{ingredient.currentStock}</td>
                    <td className="px-4 py-3">{ingredient.minimumStock}</td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <Badge variant="destructive">{t('low')}</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          {ti('ok')}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/inventory/${ingredient.id}/restock`}>{ti('restock')}</Link>
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
