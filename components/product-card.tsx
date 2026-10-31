import Link from "next/link";
import { formatPrice, type Product } from "@/data/products";

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

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="card card-interactive group flex h-full flex-col p-4"
    >
      <ProductVisual product={product} className="aspect-[4/5]" />
      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="type-label text-muted">{product.kicker}</p>
            <h3 className="mt-2 type-h3">{product.name}</h3>
          </div>
          <span className="badge shrink-0">Coming soon</span>
        </div>
        <p className="mt-3 type-body-sm text-muted">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <span className="type-price tabular">
            {formatPrice(product.price)}
          </span>
          <span className="inline-flex min-h-11 items-center text-sm font-semibold text-accent">
            View pack
            <svg
              aria-hidden="true"
              className="ml-1.5"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
