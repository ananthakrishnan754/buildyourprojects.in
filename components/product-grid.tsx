"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useRevealState } from "@/components/reveal";
import {
  productCategories,
  products,
  type ProductCategory,
} from "@/data/products";
import {
  loadFlip,
  prefersReducedMotion,
  type FlipKit,
} from "@/lib/motion";

type SortOption = "featured" | "price-asc" | "price-desc";

type FlipState = ReturnType<FlipKit["Flip"]["getState"]>;

export function ProductGrid({
  paymentsEnabled = false,
}: {
  paymentsEnabled?: boolean;
}) {
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const { ref: gridRef, state: revealState } = useRevealState<HTMLDivElement>();
  const kitRef = useRef<FlipKit | null>(null);
  const flipStateRef = useRef<FlipState | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (media.matches) return;
      void loadFlip().then((kit) => {
        kitRef.current = kit;
      });
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const visible = useMemo(() => {
    const filtered =
      category === "all"
        ? [...products]
        : products.filter((product) => product.category === category);

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [category, sort]);

  const capture = () => {
    const grid = gridRef.current;
    const kit = kitRef.current;
    if (!grid || !kit || prefersReducedMotion()) return;
    flipStateRef.current = kit.Flip.getState(
      grid.querySelectorAll("[data-flip-id]"),
      { props: "opacity" },
    );
  };

  const updateCategory = (next: "all" | ProductCategory) => {
    if (next === category) return;
    capture();
    setCategory(next);
  };

  const updateSort = (next: SortOption) => {
    if (next === sort) return;
    capture();
    setSort(next);
  };

  useLayoutEffect(() => {
    const state = flipStateRef.current;
    const kit = kitRef.current;
    flipStateRef.current = null;
    if (!state || !kit) return;

    const { Flip, gsap } = kit;
    const animation = Flip.from(state, {
      duration: 0.32,
      ease: "power2.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.32, ease: "power2.out" },
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.96,
          duration: 0.2,
          ease: "power2.in",
        }),
    });

    return () => {
      animation.kill();
    };
  }, [category, sort]);

  return (
    <div>
      <div className="sticky top-16 z-[var(--z-filter)] -mx-5 border-y border-stroke bg-page/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1 md:pb-0"
            role="group"
            aria-label="Filter products by need"
          >
            {productCategories.map((item) => (
              <button
                key={item.value}
                type="button"
                className="chip"
                aria-pressed={category === item.value}
                onClick={() => updateCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end">
            <label
              htmlFor="product-sort"
              className="type-body-sm shrink-0 text-muted"
            >
              Sort
            </label>
            <select
              id="product-sort"
              className="field max-w-[190px]"
              value={sort}
              onChange={(event) => updateSort(event.target.value as SortOption)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-5 type-body-sm text-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      <div
        ref={gridRef}
        data-reveal-group={revealState}
        className="relative mt-5 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            flipId={product.slug}
            paymentsEnabled={paymentsEnabled}
          />
        ))}
      </div>
    </div>
  );
}
