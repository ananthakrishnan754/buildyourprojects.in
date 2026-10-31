import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 items-center gap-2.5 rounded-sm text-text ${className}`}
      aria-label="BuildYourProjects home"
    >
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-[10px] border border-stroke-strong bg-surface text-[13px] font-bold tracking-tight text-accent"
      >
        BY
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        BuildYourProjects
      </span>
    </Link>
  );
}
