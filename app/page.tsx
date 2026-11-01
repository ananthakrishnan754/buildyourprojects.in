import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/faq-accordion";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { TodoSlot } from "@/components/todo-slot";
import { products, formatPrice } from "@/data/products";
import { projectService, projects } from "@/data/projects";
import { site, whatsappLink } from "@/data/site";
import { getPaymentConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Submission kits for engineering students",
  description:
    "Working code, an IEEE-format report, a defence deck and viva answers for engineering students. Plus report formatting, viva prep and custom final-year project builds.",
  alternates: { canonical: "/" },
};

const howItWorks = [
  {
    title: "Choose your tool",
    detail:
      "Start with the Submission Kit, ReportForge or Viva Vault depending on what is actually missing.",
  },
  {
    title: "Check out securely",
    detail:
      "Razorpay checkout is being built and tested in the payments phase. TEST MODE only until the owner approves going live.",
  },
  {
    title: "Download and prepare",
    detail:
      "The intended delivery is a gated download link plus an email receipt. Every pack is a study aid you still need to understand and defend.",
  },
];

const homeFaq = [
  {
    question: "Are these products live yet?",
    answer:
      "Not yet. Checkout is being built and tested in the next phase. You can read the full pack contents now; buy buttons stay disabled until payment and delivery are verified.",
  },
  {
    question: "Is using a kit cheating?",
    answer:
      "The products are study aids and templates. The Submission Kit report has fields for your own results, and you must be able to explain what you submit. ReportForge formats the content you supply; it does not write it for you.",
  },
  {
    question: "How will delivery work?",
    answer:
      "The intended flow is a gated download link plus an email receipt after payment confirmation. Final delivery details will be confirmed before checkout opens.",
  },
  {
    question: "Can I still get a custom project built?",
    answer:
      "Yes. The custom project service is unchanged: send your branch, idea and deadline on WhatsApp and we will scope a quote. Published starting prices run from ₹15,200.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "The refund policy is drafted at /refund and still needs owner review before checkout opens. Digital products are generally non-refundable after download, but failed or duplicate payments will be investigated.",
  },
  {
    question: "Do you offer a bundle?",
    answer:
      "A bundle is proposed but not on sale. It will only appear after the owner approves the price and contents.",
  },
];

export default function HomePage() {
  const paymentsEnabled = getPaymentConfig().enabled;
  return (
    <>
      <section className="relative overflow-hidden border-b border-stroke">
        <div className="container-site grid gap-12 py-16 md:grid-cols-[7fr_5fr] md:items-center md:py-24 lg:py-28">
          <div>
            <p className="type-label text-muted" data-reveal style={{ "--i": 0 } as React.CSSProperties}>
              For Indian engineering students
            </p>
            <h1 className="type-display-1 mt-5 max-w-[13ch]" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              Your project. Submission-ready.
            </h1>
            <p className="prose-measure mt-6 type-body-lg text-muted" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              Working code, an IEEE-format report, a defence deck and viva
              answers. Built for the student who needs to submit and defend, not
              just watch another tutorial.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
              <Link
                href="/products/submission-kit"
                className="btn btn-primary w-full sm:w-auto"
              >
                Get the Submission Kit · ₹499
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center text-sm font-medium text-muted underline-offset-4 hover:text-text hover:underline"
              >
                or browse all products
              </Link>
            </div>
            <p className="mt-6 type-body-sm text-muted">
              Checkout opens after the payments phase. Pack contents are
              published now.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto h-[340px] w-full max-w-[440px] md:h-[420px]"
            data-parallax="34"
          >
            <div className="absolute inset-x-8 top-6 h-56 rotate-[-7deg] rounded-xl border border-stroke bg-elevated/80 p-5 shadow-e2" data-parallax="22">
              <span className="type-label text-muted">Code</span>
              <div className="mt-5 space-y-2">
                <div className="h-2 w-2/3 rounded-full bg-n-4/50" />
                <div className="h-2 w-5/6 rounded-full bg-n-4/30" />
                <div className="h-2 w-1/2 rounded-full bg-n-4/40" />
                <div className="h-2 w-3/4 rounded-full bg-n-4/20" />
              </div>
            </div>
            <div className="absolute inset-x-12 top-28 h-56 rotate-[3deg] rounded-xl border border-stroke-strong bg-n-2 p-5 shadow-e3" data-parallax="46">
              <span className="type-label text-muted">Report</span>
              <div className="mt-5 space-y-2">
                <div className="h-2 w-1/3 rounded-full bg-n-5/60" />
                <div className="h-2 w-full rounded-full bg-n-4/30" />
                <div className="h-2 w-11/12 rounded-full bg-n-4/30" />
                <div className="h-2 w-4/5 rounded-full bg-n-4/20" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-14 rounded-sm border border-stroke" />
                  <div className="h-14 rounded-sm border border-stroke" />
                  <div className="h-14 rounded-sm border border-stroke-strong" />
                </div>
              </div>
            </div>
            <div className="absolute inset-x-4 bottom-2 h-40 rotate-[-2deg] rounded-xl border border-stroke bg-surface p-5 shadow-e2" data-parallax="12">
              <span className="type-label text-muted">Viva</span>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-16 rounded-sm border border-stroke bg-elevated" />
                <div className="h-16 rounded-sm border border-stroke bg-elevated" />
                <div className="h-16 rounded-sm border border-stroke bg-elevated" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-stroke" aria-label="Inside a project workspace">
        <div className="container-wide py-8 md:py-12">
          <div className="clip-reveal" data-parallax="60">
            <Image
              src="/media/hero-workbench.webp"
              alt="A dark workbench with a rolled technical blueprint, an open laptop and thin lime accent lighting"
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full rounded-lg border border-stroke object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-stroke">
        <div className="container-wide grid grid-cols-1 divide-y divide-stroke sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-6 sm:px-8">
            <p className="type-price tabular">3</p>
            <p className="mt-2 type-body-sm text-muted">
              product specifications published
            </p>
          </div>
          <div className="px-5 py-6 sm:px-8">
            <p className="type-price tabular">{projects.length}</p>
            <p className="mt-2 type-body-sm text-muted">
              projects in the custom-build catalogue
            </p>
          </div>
          <div className="px-5 py-6 sm:px-8">
            <p className="type-price tabular">
              {projectService.inclusions.length}
            </p>
            <p className="mt-2 type-body-sm text-muted">
              services included in a custom build
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Products"
              title="Three tools for the week before submission."
              description="Start with the pack that matches the problem in front of you. No fake urgency, no invented testimonials."
            />
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Browse all products
            </Link>
          </div>

          <div className="mt-10 grid gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                paymentsEnabled={paymentsEnabled}
              />
            ))}
          </div>
          <p className="mt-6 type-body-sm text-muted">
            A ₹799 bundle is proposed but not on sale. It needs owner approval
            before it can appear here.
          </p>
        </div>
      </section>

      <section className="section border-y border-stroke bg-surface">
        <div className="container-site grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="Custom projects"
              title="Need something built from scratch?"
              description={projectService.promise}
            />
            <div className="mt-6 rounded-lg border border-stroke bg-elevated p-5">
              <p className="type-label text-muted">Indicative price band</p>
              <p className="type-price tabular mt-2">
                {projectService.pricing.band}
              </p>
              <p className="mt-3 type-body-sm text-muted">
                {projectService.pricing.note}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className="btn btn-primary">
                Enquire about a custom project
              </Link>
              <a
                href={whatsappLink(projectService.enquiry.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Talk on WhatsApp
              </a>
            </div>
          </div>

          <div>
            <ol className="space-y-3">
              {projectService.process.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-lg border border-stroke bg-page p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="type-label flex size-8 shrink-0 items-center justify-center rounded-full border border-stroke-strong text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="type-h3">{step.title}</h3>
                      <p className="mt-2 type-body-sm text-muted">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {projectService.inclusions.slice(0, 4).map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-md border border-stroke p-4"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 size-2 shrink-0 rounded-full bg-accent"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 type-body-sm text-muted">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="container-site">
          <SectionHeading
            eyebrow="How it works"
            title="Buy, download, prepare."
            description="The purchase flow is being built now. These are the three steps the storefront is designed around."
          />

          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <li key={step.title} className="card p-6">
                <span className="type-label flex size-9 items-center justify-center rounded-full border border-stroke-strong text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h3 mt-5">{step.title}</h3>
                <p className="mt-2 type-body-sm text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <TodoSlot label="Checkout and delivery copy">
              Replace the payment and delivery language with verified copy when
              Phase 4 ships Razorpay TEST MODE and the download service. No
              delivery promise should go live before the full test flow passes.
            </TodoSlot>
          </div>
        </div>
      </section>

      <section className="section border-y border-stroke bg-surface">
        <div className="container-site grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <SectionHeading
            eyebrow="Social proof"
            title="Real proof goes here, once it exists."
            description="No invented testimonials, star ratings or client names. This section stays empty until the owner supplies verified student quotes or outcome numbers."
          />
          <TodoSlot label="Verified social proof">
            Owner to provide attributable student quotes and any verifiable
            outcome numbers. Until then this is a clearly marked placeholder and
            nothing on the page should imply customer volume.
          </TodoSlot>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              title="The questions before checkout."
              description="Payment, delivery, refunds and the line between a study aid and ghost-writing."
            />
            <p className="mt-6 type-body-sm text-muted">
              Still unsure?{" "}
              <a
                href={whatsappLink("Hi! I have a question about the products.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                WhatsApp us
              </a>{" "}
              or{" "}
              <Link
                href="/contact"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                see contact options
              </Link>
              .
            </p>
          </div>
          <FaqAccordion items={homeFaq} />
        </div>
      </section>

      <section className="border-t border-stroke">
        <div className="container-site flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="type-label text-muted">Start here</p>
            <h2 className="type-h1 mt-3">
              The Submission Kit is {formatPrice(499)}.
            </h2>
            <p className="mt-2 type-body-sm text-muted">
              Read the full pack before checkout opens.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products/submission-kit"
              className="btn btn-primary"
            >
              See what&apos;s inside
            </Link>
            <a
              href={whatsappLink(
                `Hi! I have a question about ${site.name} products.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
