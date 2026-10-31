import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { TodoSlot } from "@/components/todo-slot";
import { products } from "@/data/products";
import { getPaymentConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Submission Kit (₹499), ReportForge (₹299) and Viva Vault (₹149): submission packs, report formatting and viva preparation for engineering students.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Products | BuildYourProjects",
    description:
      "Submission Kit, ReportForge and Viva Vault. Read the exact contents before checkout opens.",
    url: "/products",
  },
};

export default function ProductsPage() {
  const paymentsEnabled = getPaymentConfig().enabled;
  return (
    <>
      <section className="border-b border-stroke">
        <div className="container-site py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="type-body-sm text-muted">
            <Link href="/" className="hover:text-text">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Products</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
            <div>
              <p className="type-label text-accent">The product shelf</p>
              <h1 className="type-display-2 mt-4 max-w-[14ch]">
                Three tools. One submission.
              </h1>
              <p className="prose-measure mt-5 type-body-lg text-muted">
                The kit for a complete pack, the formatter for content you
                already have, and the question bank for the night before viva.
                Read what is inside each one; nobody is buying a mystery box.
              </p>
            </div>

            <div className="card p-5">
              <p className="type-label text-muted">Status</p>
              <p className="mt-3 type-h3">
                {paymentsEnabled ? "Checkout is open" : "Checkout is coming soon"}
              </p>
              <p className="mt-2 type-body-sm text-muted">
                {paymentsEnabled
                  ? "Test-mode checkout is enabled. Your download link is emailed only after the payment webhook is verified."
                  : "Payments and delivery are built but waiting for test keys. Buy buttons stay disabled and no order can be created until the provider is configured."}
              </p>
              <p className="mt-3 type-body-sm text-muted">
                {products.length} products published. Bundle pricing is not on
                sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site">
          <SectionHeading
            eyebrow="Browse"
            title="Filter by the job you need done."
            description="All three packs are study aids or tools. None of them writes or submits academic work for you."
          />
          <div className="mt-8">
            <ProductGrid paymentsEnabled={paymentsEnabled} />
          </div>
        </div>
      </section>

      <section className="border-t border-stroke">
        <div className="container-site py-14 md:py-20">
          <div className="grid gap-6 lg:grid-cols-3">
            <TodoSlot label="Product media">
              Product mockups and demo loops arrive in the assets phase. Until
              then the cards use a neutral spec preview, not a fake screenshot.
            </TodoSlot>
            <TodoSlot label="Bundle approval">
              A ₹799 bundle is proposed in the research. Do not render it on the
              storefront until the owner approves the price and contents.
            </TodoSlot>
            <TodoSlot label="Sample pages">
              Add real redacted sample pages to each product detail page before
              checkout opens. No placeholder screenshots should imply a finished
              deliverable.
            </TodoSlot>
          </div>
        </div>
      </section>
    </>
  );
}
