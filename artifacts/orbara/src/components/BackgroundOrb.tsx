interface BackgroundOrbProps {
  isDark: boolean;
  size?: number;
  offsetX?: string;
  offsetY?: string;
  className?: string;
}

export function BackgroundOrb({
  isDark,
  size = 860,
  offsetX = "-8%",
  offsetY = "50%",
  className = "",
}: BackgroundOrbProps) {
  const ringColor = isDark ? "rgba(255,250,250,0.055)" : "rgba(255,93,0,0.07)";
  const dotColor = isDark ? "#fffafa" : "#ff5d00";
  const dotOpacity = isDark ? 0.35 : 0.28;
  const dotOpacityMid = isDark ? 0.22 : 0.18;
  const dotOpacityInner = isDark ? 0.28 : 0.22;

  const half = size / 2;
  const r1 = half * 0.97;
  const r2 = half * 0.76;
  const r3 = half * 0.55;
  const r4 = half * 0.35;

  return (
    <div
      className={`absolute pointer-events-none overflow-hidden ${className}`}
      style={{
        right: offsetX,
        top: offsetY,
        transform: "translateY(-50%)",
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outermost ring */}
        <circle cx={half} cy={half} r={r1} stroke={ringColor} strokeWidth="1" />

        {/* Second ring */}
        <circle cx={half} cy={half} r={r2} stroke={ringColor} strokeWidth="1.1" />

        {/* Third ring */}
        <circle cx={half} cy={half} r={r3} stroke={ringColor} strokeWidth="1" />

        {/* Innermost ring */}
        <circle
          cx={half}
          cy={half}
          r={r4}
          stroke={ringColor}
          strokeWidth="0.8"
          strokeOpacity="0.7"
        />

        {/* Dot tracing main ring (r2) */}
        <circle r="5" fill={dotColor} opacity={dotOpacity}>
          <animateMotion dur="26s" repeatCount="indefinite">
            <mpath href="#bg-ring-main" />
          </animateMotion>
        </circle>
        <path
          id="bg-ring-main"
          d={`M ${half + r2},${half} A ${r2},${r2} 0 1,1 ${half + r2 - 0.01},${half}`}
        />

        {/* Smaller dot tracing outer ring, offset in time */}
        <circle r="3.5" fill={dotColor} opacity={dotOpacityMid}>
          <animateMotion dur="40s" begin="-14s" repeatCount="indefinite">
            <mpath href="#bg-ring-outer" />
          </animateMotion>
        </circle>
        <path
          id="bg-ring-outer"
          d={`M ${half + r1},${half} A ${r1},${r1} 0 1,1 ${half + r1 - 0.01},${half}`}
        />

        {/* Tiny dot on inner ring, fast */}
        <circle r="2.5" fill={dotColor} opacity={dotOpacityInner}>
          <animateMotion dur="17s" begin="-6s" repeatCount="indefinite">
            <mpath href="#bg-ring-inner" />
          </animateMotion>
        </circle>
        <path
          id="bg-ring-inner"
          d={`M ${half + r3},${half} A ${r3},${r3} 0 1,1 ${half + r3 - 0.01},${half}`}
        />
      </svg>
    </div>
  );
}
