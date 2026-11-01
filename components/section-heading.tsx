export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`} data-reveal>
      {eyebrow ? <p className="type-label text-accent">{eyebrow}</p> : null}
      <h2 className={`type-h2 ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
      {description ? (
        <p className="mt-4 type-body text-muted">{description}</p>
      ) : null}
    </div>
  );
}
