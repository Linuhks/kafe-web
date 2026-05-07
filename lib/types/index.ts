export type {
  UserResponseDto as User,
  UserResponseDtoRole as UserRole,
  CategoryResponseDto as Category,
  ProductResponseDto as Product,
  OrderResponseDto as Order,
  OrderItemResponseDto as OrderItem,
  OrderResponseDtoStatus as OrderStatus,
  IngredientResponseDto as Ingredient,
  InventoryMovementResponseDto as StockMovement,
  OrderSummaryResponseDto as DashboardSummary,
  TopProductResponseDto as TopProduct,
  PeakHourResponseDto as PeakHour,
} from '@/lib/api/generated/api'

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
