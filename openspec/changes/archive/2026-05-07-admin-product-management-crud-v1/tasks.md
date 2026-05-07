## 1. API Layer — Write Wrappers

- [x] 1.1 Add `createProduct(data: CreateProductDto): Promise<ProductResponseDto>` to `lib/api/products.ts`, wrapping `productsControllerCreate` — throw if response status is not 201
- [x] 1.2 Add `updateProduct(id: string, data: UpdateProductDto): Promise<ProductResponseDto>` to `lib/api/products.ts`, wrapping `productsControllerUpdate` — throw if response status is not 200
- [x] 1.3 Add `deleteProduct(id: string): Promise<void>` to `lib/api/products.ts`, wrapping `productsControllerRemove` — throw if response status is not 200/204
- [x] 1.4 Add `toggleProductAvailability(id: string): Promise<void>` to `lib/api/products.ts`, wrapping `productsControllerToggleAvail` — throw if response status is not 200

## 2. API Layer — Ingredient Wrappers

- [x] 2.1 Add `getProductIngredients(productId: string): Promise<ProductIngredientResponseDto[]>` to `lib/api/products.ts`, wrapping `productsControllerListIngredients`
- [x] 2.2 Add `addProductIngredient(productId: string, data: AddProductIngredientDto): Promise<ProductIngredientResponseDto>` to `lib/api/products.ts`, wrapping `productsControllerAddIngredient` — throw if response status is not 201
- [x] 2.3 Add `removeProductIngredient(productId: string, ingredientId: string): Promise<void>` to `lib/api/products.ts`, wrapping `productsControllerRemoveIngredient` — throw if response status is not 200/204
