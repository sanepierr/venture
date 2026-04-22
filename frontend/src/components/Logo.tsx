export function LogoMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Venture"
    >
      {/* Compass-arrow: triangle pointing up-right inside a subtle ring */}
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <path
        d="M9 23 L23 9 M23 9 L16 9 M23 9 L23 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="9" r="2.2" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="font-serif italic text-[22px] leading-none tracking-tight">
        venture
      </span>
    </div>
  );
}
