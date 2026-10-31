import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="type-label text-accent">404</p>
      <h1 className="type-display-2 mt-4">This page is not here.</h1>
      <p className="prose-measure mt-4 type-body-lg text-muted">
        The link may be from the old static site. Courses are gone for good;
        everything else now lives on the product shelf or the projects page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className="btn btn-primary">
          Browse products
        </Link>
        <Link href="/" className="btn btn-secondary">
          Back home
        </Link>
      </div>
    </div>
  );
}
