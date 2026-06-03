## 1. Update DEMO_ITEMS fixture

- [x] 1.1 Add an `imageUrl` field to each item in the `DEMO_ITEMS` array in `app/checkout/page.tsx`, using the Stitch reference image URLs for Midnight Blend and V60 Ceramic Dripper

## 2. Swap icon containers for image thumbnails

- [x] 2.1 Remove the `icon` and `iconBg` fields from the `DEMO_ITEMS` type / object shape
- [x] 2.2 Replace the icon `<div>` (containing `<span class="material-symbols-outlined">`) with a `<img>` element: `w-full h-full object-cover`, `src={item.imageUrl}`, `alt={item.name}`, and `onError` that sets `src` to `/images/product-placeholder.svg`

## 3. Verify

- [x] 3.1 Load `/checkout` in the browser and confirm both order summary thumbnails show product photos
- [x] 3.2 Temporarily set one `imageUrl` to an invalid URL and confirm the placeholder SVG renders without layout shift
