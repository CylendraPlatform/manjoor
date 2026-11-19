/** Clearly labeled slot. This is not a photograph of workshop output. */
export default function PlaceholderVisual({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-manjoor-walnut via-[#7a5340] to-manjoor-charcoal ${className}`}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(220,198,163,0.45), transparent 42%), radial-gradient(circle at 70% 60%, rgba(184,137,70,0.35), transparent 36%)",
        }}
      />
      <div className="absolute inset-x-3 bottom-3 rounded-md bg-black/45 px-2 py-1 text-[11px] text-manjoor-sand">
        {label}
      </div>
    </div>
  );
}
