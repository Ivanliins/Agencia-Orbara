interface OrbitDecorationProps {
  size?: number;
  opacity?: number;
  speed?: number;
  color?: string;
  className?: string;
}

export function OrbitDecoration({
  size = 200,
  opacity = 0.25,
  speed = 10,
  color = "#ff5d00",
  className = "",
}: OrbitDecorationProps) {
  const ringStyle: React.CSSProperties = {
    width: size,
    height: size * 0.45,
    border: `1.5px solid ${color}`,
    borderRadius: "50%",
    position: "relative",
    transform: "rotateX(70deg)",
    animation: `orbitSpin ${speed}s linear infinite`,
    opacity,
  };

  const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    background: color,
    borderRadius: "50%",
    position: "absolute",
    top: -4,
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
  };

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ perspective: 800, perspectiveOrigin: "50% 50%" }}
    >
      <div style={ringStyle}>
        <div style={dotStyle} />
      </div>
    </div>
  );
}

export function OrbitSystem({
  size = 280,
  color = "#ff5d00",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 1000 }}
      >
        <div
          style={{
            width: size * 0.18,
            height: size * 0.18,
            background: `radial-gradient(circle at 35% 35%, #ff8040, ${color}, #cc3300)`,
            borderRadius: "50%",
            boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`,
          }}
        />
      </div>

      {[
        { r: size * 0.42, tilt: "rotateX(72deg) rotateZ(0deg)", speed: 9 },
        { r: size * 0.42, tilt: "rotateX(72deg) rotateZ(60deg)", speed: 14 },
        { r: size * 0.42, tilt: "rotateX(72deg) rotateZ(120deg)", speed: 20 },
      ].map((ring, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          <div
            style={{
              width: ring.r * 2,
              height: ring.r * 2 * 0.35,
              border: `1px solid ${color}`,
              borderRadius: "50%",
              transform: ring.tilt,
              opacity: 0.3,
              animation: `orbitSpin ${ring.speed}s linear infinite`,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                background: color,
                borderRadius: "50%",
                position: "absolute",
                top: -3,
                left: "50%",
                transform: "translateX(-50%)",
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
