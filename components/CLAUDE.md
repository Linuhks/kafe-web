# components/

## Structure

| Folder | Contents |
|---|---|
| `ui/` | Shadcn/Radix primitives — button, input, dialog, select, badge, skeleton, pagination, sonner |
| `catalog/` | CategoryTabs, ProductCard, CartSidebar, OrderForm |
| `barista/` | OrderQueueCard, InventoryAlertBanner, StatusButton |
| `layout/` | NavBar |

## Rules

- Check `components/ui/` before building a new primitive — it likely already exists
- Always merge Tailwind classes with `cn()` from `lib/utils.ts`
- Icons: use `lucide-react`
- Do not add new UI primitives unless they are genuinely missing from `components/ui/`
