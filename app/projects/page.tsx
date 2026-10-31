import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCatalogue } from "@/components/project-catalogue";
import { ProjectEnquiryForm } from "@/components/project-enquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { TodoSlot } from "@/components/todo-slot";
import {
  projectService,
  projects,
  projectTags,
  featuredProjects,
} from "@/data/projects";
import { site, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Custom final-year, mini and micro projects across EEE, robotics, IoT, AI/ML, solar, EV and power electronics. IEEE-format documentation and viva support, with 97 catalogue starting points.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Custom engineering projects | BuildYourProjects",
    description:
      "97 IEEE-aligned project starting points across EEE, IoT, AI/ML, solar, EV and robotics. Custom builds with documentation and viva support.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-stroke">
        <div className="container-site py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="type-body-sm text-muted">
            <Link href="/" className="hover:text-text">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Projects</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end">
            <div>
              <p className="type-label text-accent">{projectService.eyebrow}</p>
              <h1 className="type-display-2 mt-4 max-w-[15ch]">
                {projectService.title}
              </h1>
              <p className="prose-measure mt-5 type-body-lg text-muted">
                {projectService.subtitle}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#enquiry" className="btn btn-primary">
                  Enquire about a custom project
                </a>
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

            <div className="card p-5">
              <p className="type-label text-muted">At a glance</p>
              <dl className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between gap-4 border-b border-stroke pb-3">
                  <dt className="type-body-sm text-muted">Catalogue</dt>
                  <dd className="type-body font-semibold tabular">
                    {projects.length} projects
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-stroke pb-3">
                  <dt className="type-body-sm text-muted">Featured</dt>
                  <dd className="type-body font-semibold tabular">
                    {featuredProjects.length}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-stroke pb-3">
                  <dt className="type-body-sm text-muted">Starting band</dt>
                  <dd className="type-body font-semibold tabular">
                    {projectService.pricing.band}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="type-body-sm text-muted">Turnaround</dt>
                  <dd className="type-body font-semibold">1–2 weeks</dd>
                </div>
              </dl>
              <p className="mt-4 type-body-sm text-muted">
                {projectService.enquiry.responseWindow}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="How we work"
              title="Four steps from requirement to handover."
              description="The same service that has been running through WhatsApp, now written down. Scope and price are confirmed before work starts."
            />
            <div className="mt-6 rounded-lg border border-stroke bg-surface p-5">
              <p className="type-label text-muted">Price band</p>
              <p className="type-price tabular mt-2">
                {projectService.pricing.band}
              </p>
              <p className="mt-3 type-body-sm text-muted">
                {projectService.pricing.note}
              </p>
              <a
                href="#enquiry"
                className="btn btn-primary mt-5 w-full sm:w-auto"
              >
                Start an enquiry
              </a>
            </div>
          </div>

          <ol className="space-y-3">
            {projectService.process.map((step, index) => (
              <li key={step.title} className="card p-6">
                <div className="flex gap-4">
                  <span className="type-label flex size-9 shrink-0 items-center justify-center rounded-full border border-stroke-strong text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-h3">{step.title}</h3>
                    <p className="mt-2 type-body-sm text-muted">{step.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-y border-stroke bg-surface">
        <div className="container-site">
          <SectionHeading
            eyebrow="What's included"
            title="The build and the paperwork around it."
            description="Every custom project is scoped individually, but these are the services that go into a typical build."
          />

          <div className="mt-10 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {projectService.inclusions.map((item) => (
              <div key={item.title} className="rounded-lg border border-stroke bg-page p-5">
                <span
                  aria-hidden="true"
                  className="block size-2 rounded-full bg-accent"
                />
                <h3 className="mt-4 type-h3">{item.title}</h3>
                <p className="mt-2 type-body-sm text-muted">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {projectService.guarantees.map((item) => (
              <div key={item.title} className="border-t border-stroke pt-4">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 type-body-sm text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="section scroll-mt-24">
        <div className="container-site grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Enquiry"
              title={projectService.promiseTitle}
              description={projectService.promise}
            />
            <div className="mt-6 space-y-3">
              {projectService.pricing.includes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 size-2 shrink-0 rounded-full bg-accent"
                  />
                  <span className="type-body-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 type-body-sm text-muted">
              Prefer a direct message?{" "}
              <a
                href={whatsappLink(projectService.enquiry.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                Open WhatsApp
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
              .
            </p>
            <div className="mt-6">
              <TodoSlot label="Owner review">
                Confirm the written process, turnaround promises and price band
                match how the service is actually run before this page is
                promoted. The enquiry form currently opens WhatsApp and stores
                nothing.
              </TodoSlot>
            </div>
          </div>

          <ProjectEnquiryForm />
        </div>
      </section>

      <section
        id="catalogue"
        className="section scroll-mt-24 border-t border-stroke bg-surface"
      >
        <div className="container-site">
          <SectionHeading
            eyebrow="Project catalogue"
            title="Start from a published project."
            description="Search the existing catalogue by title, description or technology. Each card opens a WhatsApp thread with the project name attached."
          />
          <div className="mt-8">
            <ProjectCatalogue projects={projects} tags={projectTags} />
          </div>
          <p className="mt-6 type-body-sm text-muted">
            Prices marked “Starting from” are indicative. “Contact for pricing”
            projects need a scoped quote. {projectService.deliveryNote}
          </p>
        </div>
      </section>

      <section className="border-t border-stroke">
        <div className="container-site flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="type-label text-muted">Not sure what to pick?</p>
            <h2 className="type-h1 mt-3">Send the requirement. Get a scope.</h2>
            <p className="mt-2 type-body-sm text-muted">
              Branch, deadline and a rough idea are enough to start.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#enquiry" className="btn btn-primary">
              Enquire about a custom project
            </a>
            <Link href="/products" className="btn btn-secondary">
              See the low-cost kits
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
