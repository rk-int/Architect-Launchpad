/**
 * ProgressRing — SVG arc with accessible HTML text overlay.
 * Uses an absolute-positioned <div> instead of SVG <text> for
 * screen reader compatibility and system font scaling.
 */
export default function ProgressRing({ pct = 0, size = 80, stroke = 6, color = '#C8421A', label }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div
      role="img"
      aria-label={`${label ? label + ': ' : ''}${pct}% complete`}
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* SVG ring — visual only */}
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        className="absolute inset-0"
      >
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#292524" strokeWidth={stroke}
        />
        {/* Glow layer */}
        {pct > 0 && (
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke + 4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            opacity={0.15}
            style={{ transition: 'stroke-dashoffset 0.7s ease', filter: `blur(4px)` }}
          />
        )}
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>

      {/* HTML text overlay — accessible, respects system font size */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black mono leading-none"
          style={{ fontSize: size * 0.2, color: 'white' }}
        >
          {pct}%
        </span>
        {label && (
          <span
            className="text-stone-500 leading-none mt-0.5"
            style={{ fontSize: size * 0.12 }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
