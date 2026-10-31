import type { Product } from "@/data/products";

export function ProductVisual({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-lg border border-stroke bg-[radial-gradient(circle_at_25%_15%,rgba(200,255,61,0.14),transparent_42%),linear-gradient(145deg,#17171c_0%,#0d0d10_58%,#050506_100%)] ${className}`}
    >
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(244,244,247,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(244,244,247,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 space-y-2">
        <div className="h-2 w-1/3 rounded-full bg-accent/70" />
        <div className="h-2 w-4/5 rounded-full bg-n-4/50" />
        <div className="h-2 w-2/3 rounded-full bg-n-4/30" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-12 rounded-sm border border-stroke bg-n-2/80" />
          <div className="h-12 rounded-sm border border-stroke bg-n-2/80" />
          <div className="h-12 rounded-sm border border-accent/40 bg-accent/5" />
        </div>
      </div>
      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
        <span className="type-label text-n-4">{product.categoryLabel}</span>
        <span className="size-1.5 rounded-full bg-accent" />
      </div>
    </div>
  );
}
