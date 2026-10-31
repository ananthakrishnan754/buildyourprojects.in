import Link from "next/link";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container-site py-14 md:py-20">
      <nav aria-label="Breadcrumb" className="type-body-sm text-muted">
        <Link href="/" className="hover:text-text">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{title}</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="type-label text-accent">Policy draft</p>
        <h1 className="type-display-2 mt-4">{title}</h1>
        <p className="mt-4 type-body-sm text-muted">Last updated: {updated}</p>

        <div className="mt-6 rounded-lg border border-warn/40 bg-warn/10 p-4">
          <p className="text-sm font-semibold text-warn">
            Draft for owner and legal review
          </p>
          <p className="mt-2 type-body-sm text-muted">
            This is real placeholder copy written for this storefront, not
            final legal advice. No payment can be taken until the owner approves
            the policy set and the checkout flow is tested.
          </p>
        </div>

        <p className="mt-8 type-body-lg text-muted">{intro}</p>
      </div>

      <div className="mt-10 max-w-[68ch] space-y-8">
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index}`}>
            <h2
              id={`section-${index}`}
              className="type-h3 border-t border-stroke pt-6"
            >
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 type-body text-muted">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="type-body-sm text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-10 max-w-[68ch] rounded-lg border border-stroke bg-surface p-5">
        <p className="type-body-sm text-muted">
          Questions about this draft?{" "}
          <Link
            href="/contact"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            Contact BuildYourProjects
          </Link>
          . The owner must review and replace this text before launch.
        </p>
      </div>
    </div>
  );
}
