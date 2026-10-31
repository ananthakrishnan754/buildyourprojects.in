import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { products } from "@/data/products";
import { site, whatsappLink } from "@/data/site";

const serviceLinks = [
  { href: "/projects", label: "Custom projects" },
  { href: "/projects#catalogue", label: "Project catalogue" },
  { href: "/#how-it-works", label: "How it works" },
];

const companyLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refund policy" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-stroke bg-surface">
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xs type-body-sm text-muted">
              Submission kits, formatting tools and viva prep for engineering
              students, plus custom project builds.
            </p>
            <Link
              href="/products/submission-kit"
              className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Get the Submission Kit · ₹499
            </Link>
          </div>

          <div>
            <h2 className="type-label text-muted">Products</h2>
            <ul className="mt-4 space-y-1">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex min-h-11 items-center text-sm text-text hover:text-accent"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="type-label text-muted">Service</h2>
            <ul className="mt-4 space-y-1">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-text hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-6 type-label text-muted">Company</h2>
            <ul className="mt-4 space-y-1">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-text hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="type-label text-muted">Contact</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a
                  href={whatsappLink("Hi! I have a question about BuildYourProjects.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-text hover:text-accent"
                >
                  WhatsApp {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center text-text hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-text hover:text-accent"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-text hover:text-accent"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stroke pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 BuildYourProjects. All rights reserved.</p>
          <p>Payments and digital delivery are launching in the next phase.</p>
        </div>
      </div>
    </footer>
  );
}
