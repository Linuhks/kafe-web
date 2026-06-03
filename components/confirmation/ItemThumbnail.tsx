'use client'

export default function ItemThumbnail({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-kafe-surface-container-low">
      <img
        src={src || '/images/product-placeholder.svg'}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => { e.currentTarget.src = '/images/product-placeholder.svg' }}
      />
    </div>
  )
}
