import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel } from "@/components/buy-panel";
import { FaqAccordion } from "@/components/faq-accordion";
import { ProductDemo } from "@/components/product-demo";
import Image from "next/image";
import { ProductVisual } from "@/components/product-visual";
import { Reveal, RevealGroup } from "@/components/reveal";
import { TodoSlot } from "@/components/todo-slot";
import { formatPrice, getProduct, products } from "@/data/products";
import { site, whatsappLink } from "@/data/site";
import { getPaymentConfig } from "@/lib/config";

type PageProps = { params: Promise<{ slug: string }> };

const mockups: Record<string, string> = {
  "submission-kit": "/media/product-submission-kit.webp",
  reportforge: "/media/product-reportforge.webp",
  "viva-vault": "/media/product-viva-vault.webp",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | BuildYourProjects`,
      description: product.summary,
      url: `/products/${product.slug}`,
      images: ["/images/og-image.png"],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug);
  const paymentsEnabled = getPaymentConfig().enabled;

  return (
    <div className="pb-24 md:pb-0">
      <section className="border-b border-stroke">
        <div className="container-site py-10 md:py-16">
          <nav aria-label="Breadcrumb" className="type-body-sm text-muted">
            <Link href="/" className="hover:text-text">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href="/products" className="hover:text-text">
              Products
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div data-parallax="40" className="clip-reveal scroll-scale">
                {mockups[product.slug] ? (
                  <Image
                    src={mockups[product.slug]}
                    alt={`${product.name} pack preview on a dark workbench`}
                    width={1100}
                    height={1375}
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="h-auto w-full rounded-lg border border-stroke object-cover"
                  />
                ) : (
                  <ProductVisual product={product} className="aspect-[4/5]" />
                )}
              </div>
              <div className="mt-4">
                <TodoSlot label="Demo / preview slot">
                  Replace this block with the real product demo, sample pages or
                  a short muted loop. Do not use a fabricated screenshot or imply
                  a deliverable that does not exist yet.
                </TodoSlot>
              </div>
            </div>

            <div>
              <p className="type-label text-accent">{product.kicker}</p>
              <h1 className="type-display-2 mt-4">{product.name}</h1>
              <p className="product-copy mt-5 type-body-lg text-muted">
                {product.tagline}
              </p>

              <div className="mt-8 flex flex-wrap items-end gap-4">
                <span className="type-price tabular">
                  {formatPrice(product.price)}
                </span>
                <span className="type-body-sm text-muted">
                  one-time price · inclusive of taxes as applicable
                </span>
              </div>

              <BuyPanel
                product={{
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                }}
              />

              <a
                href={whatsappLink(
                  `Hi! I have a question about ${product.name}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary mt-3 w-full sm:w-auto"
              >
                Ask on WhatsApp
              </a>

              <div className="mt-8 rounded-lg border border-stroke bg-surface p-5">
                <p className="type-label text-muted">Delivery</p>
                <p className="mt-2 type-body-sm text-muted">
                  After the payment webhook is verified, you receive an email
                  receipt with a signed download link that expires and is
                  limited to this order. Links are not issued before payment is
                  confirmed.
                </p>
                <p className="mt-3 type-body-sm text-muted">
                  Read the{" "}
                  <Link
                    href="/refund"
                    className="font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    refund policy draft
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    terms
                  </Link>
                  .
                </p>
              </div>

              <p className="mt-4 type-body-sm text-muted">{product.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-y border-stroke bg-surface">
        <div className="container-site">
          <Reveal className="max-w-2xl">
            <p className="type-label text-muted">The demo</p>
            <h2 className="type-h2 mt-3">Three beats, one pack.</h2>
            <p className="mt-3 type-body text-muted">
              On a wide screen the demo pins and steps through code, report and
              viva as you scroll. On mobile the same beats are a tab set, with
              no pin and no lost content.
            </p>
          </Reveal>
          <div className="mt-8">
            <ProductDemo slug={product.slug} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Reveal>
            <p className="type-label text-muted">What you get</p>
            <h2 className="type-h2 mt-3">{product.name} contents</h2>
            <p className="mt-3 type-body-sm text-muted">
              The exact pack. Final sample pages and any format list will be
              published before checkout opens.
            </p>
          </Reveal>

          <RevealGroup
            as="ol"
            className="divide-y divide-stroke border-y border-stroke"
          >
            {product.deliverables.map((item, index) => (
              <li key={item.title} className="flex gap-4 py-5">
                <span className="type-label flex size-8 shrink-0 items-center justify-center rounded-full border border-stroke-strong text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-1 type-body-sm text-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section border-y border-stroke bg-surface">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="type-label text-muted">Best for</p>
            <h2 className="type-h2 mt-3">Who this is for</h2>
            <ul className="mt-6 space-y-3">
              {product.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 size-2 shrink-0 rounded-full bg-accent"
                  />
                  <span className="type-body text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <p className="type-label text-muted">Sample pages</p>
            <h2 className="type-h2 mt-3">Show the deliverable</h2>
            <div className="mt-6">
              <TodoSlot label="Sample pages and demo">
                Add redacted sample pages, a short screen recording or a
                downloadable contents sheet here. Until then the page explains
                the pack instead of pretending to show a finished product.
              </TodoSlot>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Reveal>
            <p className="type-label text-muted">FAQ</p>
            <h2 className="type-h2 mt-3">{product.name} questions</h2>
            <p className="mt-3 type-body-sm text-muted">
              Still unsure?{" "}
              <a
                href={whatsappLink(`Hi! I have a question about ${product.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                Message {site.name} on WhatsApp
              </a>
              .
            </p>
          </Reveal>
          <FaqAccordion items={product.faq} />
        </div>
      </section>

      <section className="border-t border-stroke">
        <div className="container-site py-14 md:py-20">
          <p className="type-label text-muted">Keep browsing</p>
          <h2 className="type-h2 mt-3">The other packs</h2>
          <RevealGroup className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="card card-interactive flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="type-label text-muted">{item.categoryLabel}</p>
                  <p className="mt-1 text-base font-semibold">{item.name}</p>
                </div>
                <span className="type-body-sm tabular text-muted">
                  {formatPrice(item.price)}
                </span>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[var(--z-filter)] border-t border-stroke bg-page/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="type-label text-muted">{product.name}</p>
            <p className="type-price tabular mt-1 text-xl">
              {formatPrice(product.price)}
            </p>
          </div>
          {paymentsEnabled ? (
            <a href="#buy" className="btn btn-primary shrink-0">
              Buy now
            </a>
          ) : (
            <button type="button" disabled className="btn btn-primary shrink-0">
              Coming soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
