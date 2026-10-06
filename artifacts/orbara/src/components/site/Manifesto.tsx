import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/motion";
import { OrbitDecoration } from "@/components/OrbitDecoration";
import { tokens } from "./tokens";

const LEFT = [
  { t: "Atraímos atenção.", k: "title" },
  { t: "Não pela insistência, mas pela construção.", k: "body" },
  { t: "Cada escolha direciona. Cada detalhe posiciona. Cada elemento tem função.", k: "body" },
  { t: "Porque atenção não se pede. Se conquista.", k: "em" },
];

const RIGHT = [
  { t: "Entregamos resultado.", k: "title" },
  { t: "Sem atalhos. Sem distrações. Sem fazer o cliente dar voltas.", k: "body" },
  { t: "Transformamos interesse em ação com clareza, ritmo e intenção.", k: "body" },
  { t: "No fim, não é sobre estar presente. É sobre ser o ponto para onde tudo retorna.", k: "em" },
];

function Column({ lines }: { lines: typeof LEFT }) {
  return (
    <div className="flex flex-col gap-6">
      {lines.map((l, i) => (
        <p
          key={i}
          className={`manifesto-text ${
            l.k === "title"
              ? "font-black text-[#0d0101] leading-[1.02] tracking-tight"
              : l.k === "em"
                ? "font-extrabold italic text-[#0d0101] leading-snug"
                : "font-semibold text-[#0d0101] leading-snug"
          }`}
          style={{ fontSize: l.k === "title" ? "clamp(2.2rem, 4.4vw, 4rem)" : "clamp(1.2rem, 2.1vw, 1.65rem)" }}
        >
          {l.t}
        </p>
      ))}
    </div>
  );
}

export function Manifesto({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Card "abre" ao entrar
      gsap.fromTo(".manifesto-card",
        { scale: 0.9, borderRadius: "120px" },
        { scale: 1, borderRadius: "56px", ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 20%", scrub: true } }
      );

      // Palavras acendem conforme a rolagem
      const split = SplitText.create(".manifesto-text", { type: "words" });
      gsap.fromTo(split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".manifesto-grid", start: "top 75%", end: "bottom 45%", scrub: true },
        }
      );

      gsap.to(".manifesto-ring", { rotation: 360, duration: 60, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(".manifesto-ring-rev", { rotation: -360, duration: 40, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    });
  }, { scope: ref });

  return (
    <section id="manifesto" ref={ref} className={`py-6 md:py-10 ${t.bg}`}>
      <div className="manifesto-card bg-[#ff5d00] rounded-[40px] md:rounded-[56px] mx-3 md:mx-8 py-24 md:py-36 px-7 md:px-20 relative overflow-hidden will-change-transform">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <g className="manifesto-ring" style={{ transformBox: "fill-box" }}>
            <ellipse cx="900" cy="350" rx="520" ry="200" fill="none" stroke="#0d0101" strokeOpacity="0.08" />
          </g>
          <g className="manifesto-ring-rev" style={{ transformBox: "fill-box" }}>
            <ellipse cx="900" cy="350" rx="360" ry="140" fill="none" stroke="#0d0101" strokeOpacity="0.06" strokeDasharray="6 10" />
          </g>
          <ellipse cx="200" cy="580" rx="260" ry="100" fill="none" stroke="#0d0101" strokeOpacity="0.06" />
          <circle r="5" fill="#0d0101" fillOpacity="0.2">
            <animateMotion dur="18s" repeatCount="indefinite" path="M380,350 a520,200 0 1,1 1,0" />
          </circle>
        </svg>
        <OrbitDecoration size={160} opacity={0.08} speed={32} color="#0d0101" className="absolute top-8 left-8" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-4 mb-14">
            <span className="font-black tracking-[0.35em] text-xs text-[#0d0101]/60 uppercase">Manifesto</span>
            <span className="h-px flex-1 bg-[#0d0101]/15" />
            <span className="font-black text-xs text-[#0d0101]/60 tabular-nums">ORBARA ©</span>
          </div>
          <div className="manifesto-grid grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <Column lines={LEFT} />
            <Column lines={RIGHT} />
          </div>
        </div>
      </div>
    </section>
  );
}
