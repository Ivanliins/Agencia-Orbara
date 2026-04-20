import { useState, useMemo } from "react";

interface OrbSceneProps {
  isDark: boolean;
}

const RINGS = [
  { w: 520, h: 188, rx: 68, rz: -18, speed: 13, dotColor: "#ffaa60", dotSize: 13 },
  { w: 680, h: 246, rx: 72, rz: 38,  speed: 21, dotColor: "#fffafa", dotSize: 9  },
  { w: 860, h: 312, rx: 65, rz: -56, speed: 34, dotColor: "#ff5d00", dotSize: 7  },
];

function StarField({ isDark }: { isDark: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.9 + Math.random() * 1.6,
        opacity: 0.15 + Math.random() * 0.6,
        dur: 2 + Math.random() * 3.5,
        delay: Math.random() * 5,
      })),
    []
  );
  if (!isDark) return null;
  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "#fffafa",
            opacity: s.opacity,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </>
  );
}

export function OrbScene({ isDark }: OrbSceneProps) {
  const [tick] = useState(0); // keeps component stable

  // Generate unique keyframes per ring so the rotateX tilt stays while Z rotates
  const dynamicCss = useMemo(
    () =>
      [
        ...RINGS.map(
          (r, i) => `
@keyframes ring${i} {
  from { transform: rotateX(${r.rx}deg) rotateZ(${r.rz}deg); }
  to   { transform: rotateX(${r.rx}deg) rotateZ(${r.rz + 360}deg); }
}`,
        ),
        `@keyframes moonOrbit {
  from { transform: rotateX(76deg) rotateZ(22deg); }
  to   { transform: rotateX(76deg) rotateZ(382deg); }
}`,
        `@keyframes shineDrift {
  0%   { opacity: 0.25; transform: translateX(-10%) translateY(-8%); }
  50%  { opacity: 0.35; transform: translateX(8%) translateY(6%); }
  100% { opacity: 0.25; transform: translateX(-10%) translateY(-8%); }
}`,
        `@keyframes twinkle {
  from { opacity: var(--star-from, 0.2); }
  to   { opacity: var(--star-to, 0.8); }
}`,
        `@keyframes floatRing {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}`,
      ].join("\n"),
    []
  );

  void tick;

  const ringOpacity = isDark ? 0.5 : 0.28;
  const glowShadow = isDark
    ? "0 0 70px #ff5d0045, 0 0 140px #ff5d0020"
    : "0 0 40px #ff5d0030";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <style>{dynamicCss}</style>

      <StarField isDark={isDark} />

      {/* ── Planet + ring system (right side) ─────────────────────────────── */}
      <div
        className="absolute"
        style={{
          right: "-6%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 900,
          height: 900,
        }}
      >
        {/* Orbital rings */}
        {RINGS.map((ring, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: 1100 }}
          >
            <div
              style={{
                width: ring.w,
                height: ring.h,
                border: `1.5px solid #ff5d00`,
                borderRadius: "50%",
                opacity: ringOpacity,
                position: "relative",
                animation: `ring${i} ${ring.speed}s linear infinite`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: ring.dotSize,
                  height: ring.dotSize,
                  background: ring.dotColor,
                  borderRadius: "50%",
                  top: -ring.dotSize / 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: `0 0 ${ring.dotSize * 2}px ${ring.dotColor}, 0 0 ${ring.dotSize * 4}px ${ring.dotColor}60`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Atmosphere haze */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: isDark
                ? "radial-gradient(circle, #ff5d0038 0%, #ff5d0012 50%, transparent 70%)"
                : "radial-gradient(circle, #ff5d0018 0%, transparent 60%)",
              filter: "blur(24px)",
            }}
          />
        </div>

        {/* Planet sphere */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: 250,
              height: 250,
              borderRadius: "50%",
              background: isDark
                ? "radial-gradient(circle at 33% 28%, #ffb070 0%, #ff6010 30%, #ff5d00 55%, #cc2800 80%, #7a0f00 100%)"
                : "radial-gradient(circle at 33% 28%, #ffcc90 0%, #ff7820 30%, #ff5d00 55%, #dd3500 80%, #991500 100%)",
              boxShadow: glowShadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glass shine */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 28% 26%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.07) 45%, transparent 70%)",
                animation: "shineDrift 8s ease-in-out infinite",
              }}
            />
            {/* Surface bands */}
            {[30, 46, 60, 74, 86].map((y, bi) => (
              <div
                key={bi}
                style={{
                  position: "absolute",
                  left: "-10%",
                  right: "-10%",
                  top: `${y}%`,
                  height: bi % 2 === 0 ? 13 : 8,
                  background:
                    bi % 2 === 0
                      ? "rgba(160,30,0,0.25)"
                      : "rgba(255,130,50,0.18)",
                  transform: "skewY(-3deg)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Small moon */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: 900 }}
        >
          <div
            style={{
              width: 340,
              height: 123,
              borderRadius: "50%",
              position: "relative",
              animation: "moonOrbit 7.5s linear infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 22,
                height: 22,
                background:
                  "radial-gradient(circle at 35% 30%, #ffe0b0, #ffaa44, #cc6600)",
                borderRadius: "50%",
                top: -11,
                left: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 0 14px #ffaa44, 0 0 30px #ff880025",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Floating small orbit decoration — far left ─────────────────────── */}
      <div
        className="absolute hidden xl:block"
        style={{
          left: "4%",
          top: "18%",
          perspective: 700,
          animation: "floatRing 6s ease-in-out infinite",
          opacity: isDark ? 0.2 : 0.1,
        }}
      >
        <div
          style={{
            width: 130,
            height: 46,
            border: "1px solid #ff5d00",
            borderRadius: "50%",
            animation: "ring0 16s linear infinite",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 7,
              height: 7,
              background: "#ff5d00",
              borderRadius: "50%",
              top: -3.5,
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 0 8px #ff5d00",
            }}
          />
        </div>
      </div>
    </div>
  );
}
