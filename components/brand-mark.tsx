import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 items-center gap-2.5 rounded-sm text-text ${className}`}
      aria-label="BuildYourProjects home"
    >
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
        className="size-8 shrink-0 text-accent"
      >
        <g fill="currentColor">
          <rect x="10" y="10" width="10" height="19" rx="1" />
          <rect x="10" y="35" width="10" height="19" rx="1" />
          <path d="M24 10h14l18 22-18 22H24l14-22z" />
        </g>
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">
        BuildYourProjects
      </span>
    </Link>
  );
}
