import type { Metadata } from "next";
import Link from "next/link";
import { site, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact BuildYourProjects on WhatsApp, email, phone, LinkedIn or Instagram for product questions and custom project enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | BuildYourProjects",
    description:
      "WhatsApp, email and social contact details for product questions and custom project enquiries.",
    url: "/contact",
  },
};

const channels = [
  {
    label: "WhatsApp",
    value: site.phone,
    href: whatsappLink("Hi! I have a question about BuildYourProjects."),
    detail: "Fastest for project enquiries and quick product questions.",
    external: true,
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    detail: "Best for detailed requirements, documents and order issues.",
    external: false,
  },
  {
    label: "Phone",
    value: site.phone,
    href: site.phoneHref,
    detail: "Call during the day if WhatsApp is not convenient.",
    external: false,
  },
  {
    label: "LinkedIn",
    value: "ananthakrishnan754",
    href: site.linkedin,
    detail: "Professional profile and project work.",
    external: true,
  },
  {
    label: "Instagram",
    value: "@shutter_bug07",
    href: site.instagram,
    detail: "Short videos and behind-the-scenes project builds.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-stroke">
        <div className="container-site py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="type-body-sm text-muted">
            <Link href="/" className="hover:text-text">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Contact</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
            <div>
              <p className="type-label text-accent">Contact</p>
              <h1 className="type-display-2 mt-4 max-w-[14ch]">
                Ask before you buy.
              </h1>
              <p className="prose-measure mt-5 type-body-lg text-muted">
                Product questions, custom project enquiries and order issues all
                reach the same place. WhatsApp is usually fastest; email is
                better for details and files.
              </p>
            </div>
            <div className="card p-5">
              <p className="type-label text-muted">Response</p>
              <p className="mt-3 type-h3">WhatsApp first</p>
              <p className="mt-2 type-body-sm text-muted">
                Message during the day for the fastest reply. Complex custom
                projects may need a short scoping conversation before a quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site">
          <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer" : undefined}
                className="card card-interactive p-5"
              >
                <p className="type-label text-muted">{channel.label}</p>
                <p className="mt-2 break-words text-base font-semibold">
                  {channel.value}
                </p>
                <p className="mt-2 type-body-sm text-muted">{channel.detail}</p>
              </a>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-stroke bg-surface p-6">
              <h2 className="type-h3">Custom project enquiry</h2>
              <p className="mt-2 type-body-sm text-muted">
                Send the branch, project type, deadline and a rough idea. The
                enquiry form opens WhatsApp with those details prefilled.
              </p>
              <Link href="/projects#enquiry" className="btn btn-primary mt-5">
                Open the enquiry form
              </Link>
            </div>

            <div className="rounded-lg border border-stroke bg-surface p-6">
              <h2 className="type-h3">Product question</h2>
              <p className="mt-2 type-body-sm text-muted">
                Read the pack contents and FAQ first. If something is still
                unclear, message us before checkout opens.
              </p>
              <Link href="/products" className="btn btn-secondary mt-5">
                Browse products
              </Link>
            </div>
          </div>

          <p className="mt-8 type-body-sm text-muted">
            BuildYourProjects does not sell courses. Courses have been removed
            and the old course URLs redirect to the product shelf.
          </p>
        </div>
      </section>
    </>
  );
}
