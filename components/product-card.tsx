"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProductVisual } from "@/components/product-visual";
import { formatPrice, type Product } from "@/data/products";
import { prefersReducedMotion } from "@/lib/motion";

function useTilt() {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const frame = useRef(0);
  const returnTimer = useRef(0);

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
    element.style.removeProperty("--mx");
    element.style.removeProperty("--my");
  };

  const onPointerEnter = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    window.clearTimeout(returnTimer.current);
    ref.current?.classList.add("is-tilting");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const element = ref.current;
    if (!element || frame.current) return;

    const clientX = event.clientX;
    const clientY = event.clientY;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = element.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      element.style.setProperty("--ry", `${((x - 0.5) * 6).toFixed(2)}deg`);
      element.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
      element.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      element.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    reset();
    const element = ref.current;
    if (!element) return;
    window.clearTimeout(returnTimer.current);
    returnTimer.current = window.setTimeout(() => {
      element.classList.remove("is-tilting");
    }, 240);
  };

  return {
    ref,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    onBlur: onPointerLeave,
  };
}

export function ProductCard({
  product,
  flipId,
}: {
  product: Product;
  flipId?: string;
}) {
  const {
    ref,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    onBlur,
  } = useTilt();

  return (
    <Link
      ref={ref}
      href={`/products/${product.slug}`}
      data-flip-id={flipId}
      className="card tilt border-anim surface group flex h-full flex-col p-4"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <span className="surface-spotlight" aria-hidden="true" />
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
