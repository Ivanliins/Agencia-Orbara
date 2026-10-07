import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Volume2 } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, useGSAP, whileVisible } from "@/lib/motion";
import { OrbitDecoration } from "@/components/OrbitDecoration";
import { Lightbox, ORBARA_FILM, type Format } from "@/components/MotionShowcase";
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

/**
 * Filme de marca dentro do Manifesto: prévia sem som em loop enquanto está na tela
 * (16:9 no desktop, 9:16 no celular) e, ao clicar, o filme com som no lightbox.
 */
function ManifestoFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLVideoElement>(null);
  const mob = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const [lightbox, setLightbox] = useState<Format | null>(null);

  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
  const current = () => (isDesktop() ? desk.current : mob.current);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 90%",
      end: "bottom 10%",
      onToggle: (self) => {
        inView.current = self.isActive;
        const v = current();
        if (self.isActive && !reduced()) v?.play().catch(() => {});
        else [desk.current, mob.current].forEach((x) => x?.pause());
      },
    });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".mf-frame",
        { scale: 0.82, rotationX: 16, y: 60 },
        { scale: 1, rotationX: 0, y: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center 60%", scrub: true } }
      );
      gsap.to(".mf-pulse", { scale: 1.7, opacity: 0, duration: 1.8, ease: "power2.out", repeat: -1, scrollTrigger: whileVisible(ref.current) });
    });
  }, { scope: ref });

  const open = () => {
    [desk.current, mob.current].forEach((x) => x?.pause());
    setLightbox(isDesktop() ? "desktop" : "mobile");
  };
  const close = () => {
    setLightbox(null);
    if (inView.current && !reduced()) current()?.play().catch(() => {});
  };

  return (
    <div ref={ref} className="mt-20 md:mt-28" style={{ perspective: 1600 }}>
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <span className="font-black tracking-[0.35em] text-xs text-[#0d0101]/60 uppercase">O manifesto em movimento</span>
        <span className="h-px flex-1 bg-[#0d0101]/15" />
        <span className="font-black text-xs text-[#0d0101]/60 tabular-nums">{ORBARA_FILM.duration}</span>
      </div>

      <button
        type="button"
        onClick={open}
        aria-label="Assistir ao filme Orbara Impacto com som"
        className="mf-frame group relative block w-full max-w-[380px] md:max-w-none mx-auto rounded-[28px] md:rounded-[40px] overflow-hidden bg-[#0d0101] text-left shadow-[0_50px_120px_-40px_rgba(13,1,1,0.85)] ring-1 ring-[#0d0101]/25 will-change-transform"
      >
        <video
          ref={desk}
          src={ORBARA_FILM.desktop}
          poster={ORBARA_FILM.desktopPoster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="hidden md:block w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <video
          ref={mob}
          src={ORBARA_FILM.mobile}
          poster={ORBARA_FILM.mobilePoster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="md:hidden w-full aspect-[9/16] object-cover"
        />
        <span className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0d0101]/85 via-transparent to-transparent" />

        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="relative w-20 h-20 md:w-28 md:h-28">
            <span className="mf-pulse absolute inset-0 rounded-full bg-[#ff5d00]/60" />
            <span className="relative w-full h-full rounded-full bg-[#ff5d00] text-[#0d0101] flex items-center justify-center shadow-[0_20px_60px_rgba(255,93,0,0.5)] transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 md:w-11 md:h-11 ml-1" fill="currentColor" />
            </span>
          </span>
        </span>

        <span className="absolute left-5 right-5 bottom-5 md:left-10 md:right-10 md:bottom-9 flex flex-col md:flex-row md:items-end md:justify-between gap-3 text-[#fffafa]">
          <span>
            <span className="block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#ffaa60] mb-1.5">Filme Orbara Impacto</span>
            <span className="block font-black text-xl md:text-4xl leading-tight tracking-tight">{ORBARA_FILM.hook}</span>
          </span>
          <span className="self-start md:self-auto inline-flex items-center gap-2 rounded-full bg-[#fffafa] text-[#0d0101] text-[10px] md:text-xs font-black uppercase tracking-wider px-4 py-2.5">
            <Volume2 size={14} /> Assistir com som
          </span>
        </span>
      </button>

      {lightbox && createPortal(<Lightbox client="Orbara" video={ORBARA_FILM} format={lightbox} onFormat={setLightbox} onClose={close} />, document.body)}
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
      const split = SplitText.create(".manifesto-text", { type: "words", aria: "none" });
      gsap.fromTo(split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".manifesto-grid", start: "top 75%", end: "bottom 45%", scrub: true },
        }
      );

      gsap.to(".manifesto-ring", { rotation: 360, duration: 60, ease: "none", repeat: -1, scrollTrigger: whileVisible(ref.current), transformOrigin: "50% 50%" });
      gsap.to(".manifesto-ring-rev", { rotation: -360, duration: 40, ease: "none", repeat: -1, scrollTrigger: whileVisible(ref.current), transformOrigin: "50% 50%" });
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
          <ManifestoFilm />
        </div>
      </div>
    </section>
  );
}
