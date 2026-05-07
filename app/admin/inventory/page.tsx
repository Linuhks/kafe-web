import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInventory } from '@/lib/api/inventory'

export default async function AdminInventoryPage() {
  const { ingredients } = await getInventory()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/inventory/movements">Ver movimentações</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Unidade</th>
              <th className="px-4 py-3 text-left font-medium">Estoque atual</th>
              <th className="px-4 py-3 text-left font-medium">Estoque mínimo</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum ingrediente encontrado.
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
                        <Badge variant="destructive">LOW STOCK</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          OK
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/inventory/${ingredient.id}/restock`}>Reabastecer</Link>
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
