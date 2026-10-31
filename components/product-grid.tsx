"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  productCategories,
  products,
  type ProductCategory,
} from "@/data/products";

type SortOption = "featured" | "price-asc" | "price-desc";

export function ProductGrid() {
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [sort, setSort] = useState<SortOption>("featured");

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
                onClick={() => setCategory(item.value)}
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
              onChange={(event) => setSort(event.target.value as SortOption)}
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

      <div className="mt-5 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
