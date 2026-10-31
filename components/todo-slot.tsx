export function TodoSlot({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="todo-slot">
      <p className="type-label text-accent">TODO · {label}</p>
      <div className="mt-3 type-body-sm text-muted">{children}</div>
    </div>
  );
}
