import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useTilt, Magnetic } from "@/components/motion-fx";
import { ArrowUpRight, Play, X, Sparkles, Film, Globe, TrendingUp, LayoutGrid } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, SplitText);

// ── Dados ────────────────────────────────────────────────────────────────

type Category = "sites" | "trafego" | "motion";
type Filter = "todos" | Category;

const FILTERS: { id: Filter; label: string; icon: typeof Globe; badge?: string }[] = [
  { id: "todos", label: "Todos", icon: LayoutGrid },
  { id: "sites", label: "Sites & E-commerce", icon: Globe },
  { id: "trafego", label: "Tráfego & SEO", icon: TrendingUp },
  { id: "motion", label: "Motion Graphics", icon: Film, badge: "Novo" },
];

const CATEGORY_LABEL: Record<Category, string> = {
  sites: "Sites & E-commerce",
  trafego: "Tráfego & SEO",
  motion: "Motion Graphics",
};

const CASES = [
  {
    slug: "casa-voltari",
    client: "Voltari",
    segment: "Mobilidade Elétrica",
    categories: ["sites", "trafego"] as Category[],
    result: 138,
    resultLabel: "em vendas online",
    period: "em 3 meses",
    title: "Do nicho ao mainstream da mobilidade elétrica",
    desc: "Site com foco em conversão, campanhas segmentadas para compradores de motos elétricas, patinetes e ciclomotores, e SEO + tráfego pago que posicionaram a marca como referência.",
    photo: "/case-voltari.jpg",
    dark: false,
  },
  {
    slug: "camila-nogueira",
    client: "Dra. Camila Nogueira — Advocacia",
    segment: "Direito · Família & Sucessões",
    categories: ["sites", "trafego"] as Category[],
    result: 91,
    resultLabel: "em novos clientes/mês",
    period: "em 3 meses",
    title: "Autoridade digital dentro das normas da OAB",
    desc: "Site profissional com blog jurídico educativo, tráfego pago em conformidade com a OAB e SEO local que levou o escritório à primeira página do Google.",
    photo: "/case-camila.jpg",
    dark: true,
  },
  {
    slug: "central-park",
    client: "Estacionamento Central Park",
    segment: "Mobilidade Urbana",
    categories: ["trafego"] as Category[],
    result: 68,
    resultLabel: "em ocupação mensal",
    period: "em 2 meses",
    title: "Do desconhecido ao ponto de referência da região",
    desc: "Google Maps otimizado, campanhas geolocalizadas num raio de 3 km e conteúdo que posicionou o espaço como referência em segurança e conveniência.",
    photo: "/case-central-park.jpg",
    dark: false,
  },
];

type MotionVisual = "orbit" | "shapes" | "kinetic" | "bars";

/**
 * Projetos de Motion Graphics.
 * Para publicar um vídeo, coloque o arquivo em `public/motion/` e preencha `src`
 * (ex.: "/motion/showreel.mp4") e, opcionalmente, `poster` (imagem de capa).
 * Enquanto `src` estiver vazio, o card mostra uma animação de prévia com "Em breve".
 */
const MOTION_PROJECTS: {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  duration: string;
  src: string;
  poster?: string;
  visual: MotionVisual;
  featured?: boolean;
}[] = [
  {
    id: "showreel",
    title: "Showreel Orbara",
    desc: "Um giro pelos nossos melhores trabalhos de animação 2D, 3D e tipografia em movimento.",
    tags: ["Reel", "2D", "3D"],
    duration: "0:45",
    src: "",
    visual: "orbit",
    featured: true,
  },
  {
    id: "logo-animation",
    title: "Logo Animation",
    desc: "Marcas que ganham vida em vinhetas e aberturas.",
    tags: ["Branding", "Vinheta"],
    duration: "0:08",
    src: "",
    visual: "shapes",
  },
  {
    id: "kinetic-type",
    title: "Tipografia Cinética",
    desc: "Mensagens que prendem o olhar nos primeiros 3 segundos.",
    tags: ["Reels", "Stories"],
    duration: "0:15",
    src: "",
    visual: "kinetic",
  },
  {
    id: "ads-animados",
    title: "Anúncios Animados",
    desc: "Criativos em movimento feitos para performance em tráfego pago.",
    tags: ["Ads", "Performance"],
    duration: "0:20",
    src: "",
    visual: "bars",
  },
];

type GridItem =
  | { kind: "featured"; id: string; categories: Category[] }
  | { kind: "case"; id: string; categories: Category[]; data: (typeof CASES)[number] }
  | { kind: "motion"; id: string; categories: Category[]; data: (typeof MOTION_PROJECTS)[number] }
  | { kind: "cta"; id: string; categories: Category[] };

const ITEMS: GridItem[] = [
  { kind: "featured", id: "jr-queijo", categories: ["sites"] },
  ...CASES.map((c) => ({ kind: "case" as const, id: c.slug, categories: c.categories, data: c })),
  ...MOTION_PROJECTS.map((m) => ({ kind: "motion" as const, id: m.id, categories: ["motion"] as Category[], data: m })),
  { kind: "cta", id: "cta", categories: ["sites", "motion"] },
];

const isVisible = (item: GridItem, filter: Filter) =>
  filter === "todos" || item.categories.includes(filter as Category);

const countFor = (filter: Filter) =>
  ITEMS.filter((i) => i.kind !== "cta" && isVisible(i, filter)).length;

// ── Hooks utilitários ────────────────────────────────────────────────────

/** Roda uma timeline infinita só enquanto o elemento está visível. */
function useLoopWhileVisible(build: (scope: HTMLDivElement) => gsap.core.Timeline) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current) return;
    const tl = build(ref.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.progress(0.35).pause();
      return;
    }
    tl.pause();
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
  }, { scope: ref });
  return ref;
}

// ── Prévias animadas (enquanto o vídeo não chega) ────────────────────────

function OrbitVisual() {
  const ref = useLoopWhileVisible((scope) => {
    const q = gsap.utils.selector(scope);
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(q(".ring"), { rotation: "+=360", duration: 14, ease: "none", stagger: { each: 0, from: "end" } }, 0)
      .to(q(".ring-rev"), { rotation: "-=360", duration: 10, ease: "none" }, 0)
      .to(q(".planet"), { scale: 1.08, duration: 2, yoyo: true, repeat: 6, ease: "sine.inOut" }, 0)
      .fromTo(q(".word"), { xPercent: 0 }, { xPercent: -50, duration: 14, ease: "none" }, 0);
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_55%,#2a1206_0%,#0d0101_70%)]">
      <div className="absolute bottom-6 left-0 whitespace-nowrap font-black text-[#ff5d00]/10 leading-none select-none" style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}>
        <span className="word inline-block">MOTION • DESIGN • MOTION • DESIGN • MOTION • DESIGN •&nbsp;</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 800 }}>
        <div className="relative w-56 h-56 md:w-72 md:h-72" style={{ transform: "rotateX(68deg)", transformStyle: "preserve-3d" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${i === 1 ? "ring-rev" : "ring"} absolute rounded-full border border-[#ff5d00]/50`}
              style={{ inset: `${i * 14}%` }}
            >
              <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-[#ff5d00] shadow-[0_0_16px_#ff5d00]" />
            </div>
          ))}
        </div>
        <div className="planet absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffaa60,#ff5d00_45%,#5a1d00)] shadow-[0_0_60px_rgba(255,93,0,0.55)]" />
      </div>
    </div>
  );
}

function ShapesVisual() {
  const ref = useLoopWhileVisible((scope) => {
    const q = gsap.utils.selector(scope);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3, defaults: { duration: 0.9, ease: "expo.inOut" } });
    tl.to(q(".shape"), { borderRadius: "0%", rotation: 90, stagger: 0.12 })
      .to(q(".shape"), { scale: 0.6, x: (i) => (i - 1) * 46, stagger: 0.08 })
      .to(q(".shape"), { borderRadius: "50% 0 50% 0", rotation: 180, scale: 1, x: 0, stagger: 0.1 })
      .to(q(".shape"), { borderRadius: "50%", rotation: 360, stagger: 0.12 });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center bg-[#140905]">
      {["#ff5d00", "#ffaa60", "#fffafa"].map((c, i) => (
        <div
          key={c}
          className="shape absolute w-20 h-20 rounded-full mix-blend-screen"
          style={{ background: c, opacity: 0.85 - i * 0.15, transform: `translateX(${(i - 1) * 18}px)` }}
        />
      ))}
    </div>
  );
}

function KineticVisual() {
  const words = ["IDEIA", "RITMO", "IMPACTO", "IDEIA"];
  const ref = useLoopWhileVisible((scope) => {
    const q = gsap.utils.selector(scope);
    const tl = gsap.timeline({ repeat: -1 });
    words.slice(1).forEach((_, i) => {
      tl.to(q(".track"), { yPercent: -((i + 1) * 100) / words.length, duration: 0.7, ease: "back.inOut(1.6)" }, `+=0.8`);
    });
    tl.set(q(".track"), { yPercent: 0 });
    tl.fromTo(q(".underline"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out", repeat: 0 }, 0);
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center bg-[#ff5d00] text-[#0d0101]">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Movimento é</span>
      <div className="h-[3.2rem] md:h-[3.6rem] overflow-hidden">
        <div className="track flex flex-col">
          {words.map((w, i) => (
            <span key={i} className="block h-[3.2rem] md:h-[3.6rem] leading-[3.2rem] md:leading-[3.6rem] font-black italic text-5xl md:text-6xl tracking-tight text-center">
              {w}
            </span>
          ))}
        </div>
      </div>
      <span className="underline block h-1 w-24 bg-[#0d0101] mt-2 origin-left" />
    </div>
  );
}

function BarsVisual() {
  const ref = useLoopWhileVisible((scope) => {
    const q = gsap.utils.selector(scope);
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(q(".bar"), {
      scaleY: () => gsap.utils.random(0.15, 1),
      duration: 0.45,
      ease: "power2.inOut",
      stagger: { each: 0.04, from: "center" },
      repeat: 7,
      repeatRefresh: true,
      yoyo: true,
    });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 flex items-end justify-center gap-1.5 px-8 pb-10 pt-16 bg-[linear-gradient(180deg,#0d0101,#1d0c04)]">
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="bar block flex-1 h-full rounded-full origin-bottom"
          style={{ background: `linear-gradient(180deg, #ffaa60, #ff5d00)`, transform: `scaleY(${0.3 + ((i * 37) % 60) / 100})` }}
        />
      ))}
    </div>
  );
}

const VISUALS: Record<MotionVisual, () => React.JSX.Element> = {
  orbit: OrbitVisual,
  shapes: ShapesVisual,
  kinetic: KineticVisual,
  bars: BarsVisual,
};

// ── Cards ────────────────────────────────────────────────────────────────

function FeaturedCase() {
  const tiltRef = useTilt<HTMLDivElement>(4);
  return (
    <div ref={tiltRef} className="case-card group relative rounded-[3rem] md:rounded-[3.5rem] p-[2px] overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
      {/* Borda animada em gradiente cônico */}
      <div className="border-spin absolute -inset-[50%] bg-[conic-gradient(from_0deg,transparent_0deg,#ff5d00_60deg,transparent_120deg,transparent_240deg,#ffaa60_300deg,transparent_360deg)] opacity-80" />
      <div
        className="relative rounded-[calc(3rem-2px)] md:rounded-[calc(3.5rem-2px)] overflow-hidden flex flex-col lg:flex-row"
        style={{ background: "linear-gradient(135deg, #180e06 0%, #0d0101 100%)", boxShadow: "0 20px 80px -10px rgba(255,93,0,0.30)" }}
      >
        <div className="spotlight pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Lado Esquerdo — Preview */}
        <div className="relative lg:w-1/2 shrink-0 overflow-hidden flex flex-col justify-between p-6 md:p-10 min-h-[360px] lg:min-h-[500px] bg-[#120a04]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              loading="lazy"
              src="/jr-queijo-preview.jpg"
              alt="Preview do site Empório Júnior do Queijo"
              className="parallax-img w-full h-[125%] object-cover object-top opacity-60 group-hover:opacity-75 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120a04] via-[#120a04]/40 to-black/60" />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#ff5d00] to-[#ffaa60] opacity-80 blur-sm" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1a0e05] border-2 border-[#ff5d00] p-2 flex items-center justify-center overflow-hidden">
                  <img loading="lazy" src="/jr-queijo-logo.png" alt="Empório Júnior do Queijo" className="w-full h-full object-contain rounded-lg" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#ff5d00]">
                  <Sparkles size={12} /> Case Principal
                </div>
                <h4 className="text-lg md:text-xl font-black text-[#fffafa] leading-tight">Empório Júnior do Queijo</h4>
                <p className="text-xs text-[#fffafa]/60">Tradição de Minas Gerais</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 bg-[#ff5d00] text-[#0d0101] text-[10px] md:text-xs font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full shadow-xl shadow-[#ff5d00]/30 shrink-0">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-green-400" />
              </span>
              No Ar
            </span>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-6">
            {["🧀 Queijos Canastra", "🍬 Doces Artesanais", "🥃 Cachaças Nobres", "📦 Entrega Brasil"].map((tag) => (
              <span key={tag} className="feat-tag text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 border border-[#ff5d00]/40 text-[#ffaa60] backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Lado Direito — Informações */}
        <div className="relative flex flex-col justify-between p-8 md:p-12 lg:p-14 flex-1 text-[#0d0101] bg-[#ff5d00] overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border-[24px] border-[#0d0101]/[0.06] pointer-events-none" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[#0d0101]/60 mb-3">
              <span>E-commerce D2C</span>
              <span>·</span>
              <span>Gastronomia Regional</span>
            </div>
            <h3 className="font-black text-2xl md:text-4xl lg:text-[2.6rem] leading-[1.05] mb-5 tracking-tight">
              Do balcão físico ao e-commerce de alta performance com a alma de Minas.
            </h3>
            <p className="text-base md:text-lg leading-relaxed font-semibold text-[#0d0101]/85 mb-8 max-w-xl">
              Uma loja virtual imersiva e ultrarrápida: catálogo intuitivo, busca por comando de voz, arquitetura responsiva e um portal exclusivo para revendedores atacadistas.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { v: "100%", l: "Loja Integrada" },
                { v: "Voz", l: "Busca Inteligente" },
                { v: "B2B", l: "Área Revenda" },
              ].map((m) => (
                <div key={m.l} className="feat-metric p-4 rounded-2xl bg-[#0d0101]/10 border border-[#0d0101]/15 hover:bg-[#0d0101] hover:text-[#ff5d00] transition-colors duration-300">
                  <div className="text-xl md:text-2xl font-black leading-none">{m.v}</div>
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70 mt-1">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href="https://jr-do-queijo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 text-sm font-black px-8 py-4 rounded-full bg-[#0d0101] text-[#ff5d00] hover:bg-black transition-colors shadow-xl shadow-black/25 uppercase tracking-wider"
              >
                Ver Projeto Ao Vivo
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/btn:rotate-45" />
              </a>
            </Magnetic>
            <span className="text-sm font-bold text-[#0d0101]/75 italic">"O melhor de Minas bem pertinho de você!"</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseCard({ c }: { c: (typeof CASES)[number] }) {
  const tiltRef = useTilt<HTMLDivElement>(10);
  const bodyBg = c.dark ? "#0d0101" : "#ff5d00";
  const text = c.dark ? "#fffafa" : "#0d0101";
  const muted = c.dark ? "rgba(255,250,250,0.62)" : "rgba(13,1,1,0.68)";
  return (
    <div
      ref={tiltRef}
      className="case-card group relative h-full rounded-[2.5rem] overflow-hidden flex flex-col border border-white/[0.06]"
      style={{ background: bodyBg, boxShadow: "0 4px 32px rgba(0,0,0,0.12)", transformStyle: "preserve-3d" }}
    >
      <div className="spotlight pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative overflow-hidden h-60 shrink-0">
        <img
          loading="lazy"
          src={c.photo}
          alt={c.client}
          className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.2s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-1.5 z-10">
          {c.categories.map((cat) => (
            <span key={cat} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/55 text-white/80 backdrop-blur">
              {CATEGORY_LABEL[cat]}
            </span>
          ))}
        </div>
        <div className="absolute bottom-5 left-6 z-10">
          <div className="font-black leading-none tracking-[-0.04em] text-[#ff5d00]" style={{ fontSize: "clamp(2.8rem, 6vw, 4rem)" }}>
            +<span className="counter" data-value={c.result}>{c.result}</span>%
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/70 mt-1">
            {c.resultLabel} · {c.period}
          </div>
        </div>
      </div>
      <div className="relative px-8 py-8 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: muted }}>{c.segment}</span>
          <span className="text-[11px] font-semibold" style={{ color: muted }}>{c.client}</span>
        </div>
        <h3 className="font-black text-xl md:text-2xl leading-tight" style={{ color: text }}>{c.title}</h3>
        <p className="text-sm md:text-base leading-relaxed font-medium" style={{ color: muted }}>{c.desc}</p>
        <div className="mt-auto pt-2">
        <Link href={`/cases/${c.slug}`}>
          <span
            className="inline-flex items-center gap-3 self-start text-sm font-black uppercase tracking-wider cursor-pointer"
            style={{ color: text }}
          >
            Ver case completo
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110"
              style={{ background: text, color: bodyBg }}
            >
              <ArrowUpRight size={18} />
            </span>
          </span>
        </Link>
        </div>
      </div>
    </div>
  );
}

function MotionCard({ m, onOpen }: { m: (typeof MOTION_PROJECTS)[number]; onOpen: () => void }) {
  const tiltRef = useTilt<HTMLDivElement>(m.featured ? 4 : 9);
  const videoRef = useRef<HTMLVideoElement>(null);
  const Visual = VISUALS[m.visual];
  const hasVideo = Boolean(m.src);

  // Vídeo de prévia toca mudo enquanto o card está na tela
  useGSAP(() => {
    if (!hasVideo || !videoRef.current) return;
    const v = videoRef.current;
    ScrollTrigger.create({
      trigger: v,
      start: "top 90%",
      end: "bottom 10%",
      onToggle: (self) => (self.isActive ? v.play().catch(() => {}) : v.pause()),
    });
  }, { dependencies: [hasVideo] });

  return (
    <div
      ref={tiltRef}
      onClick={hasVideo ? onOpen : undefined}
      className={`case-card group relative h-full rounded-[2.5rem] overflow-hidden flex flex-col bg-[#0d0101] border border-white/[0.08] ${hasVideo ? "cursor-pointer" : ""}`}
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)", transformStyle: "preserve-3d" }}
    >
      <div className="spotlight pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className={`relative overflow-hidden ${m.featured ? "aspect-video lg:aspect-auto lg:flex-1 lg:min-h-[340px]" : "aspect-video"}`}>
        {hasVideo ? (
          <video
            ref={videoRef}
            src={m.src}
            poster={m.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
        ) : (
          <Visual />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0101]/90 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-4 left-4 flex gap-1.5 z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#ff5d00] text-[#0d0101]">
            <Film size={11} /> Motion
          </span>
          {!hasVideo && (
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/60 text-white/80 backdrop-blur border border-white/10">
              Em breve
            </span>
          )}
        </div>
        <span className="absolute top-4 right-4 z-10 text-[10px] font-black tracking-widest px-3 py-1 rounded-full bg-black/60 text-white/80 backdrop-blur">
          {m.duration}
        </span>

        {/* Botão play com texto circular girando */}
        <div className="absolute bottom-4 right-4 z-10 w-20 h-20 md:w-24 md:h-24">
          <svg viewBox="0 0 100 100" className="play-ring absolute inset-0 w-full h-full">
            <defs>
              <path id={`circle-${m.id}`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-[#fffafa] text-[10.5px] font-black uppercase" style={{ letterSpacing: "0.32em" }}>
              <textPath href={`#circle-${m.id}`}>{hasVideo ? "Play • Assistir • Play • Assistir •" : "Em breve • Em breve • Em breve •"}</textPath>
            </text>
          </svg>
          <span className="absolute inset-[30%] rounded-full bg-[#ff5d00] text-[#0d0101] flex items-center justify-center transition-transform duration-500 group-hover:scale-125">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </span>
        </div>
      </div>
      <div className="relative px-7 py-6 flex flex-col gap-2">
        <h3 className={`font-black text-[#fffafa] leading-tight ${m.featured ? "text-2xl md:text-3xl" : "text-xl"}`}>{m.title}</h3>
        <p className="text-sm leading-relaxed text-[#fffafa]/60">{m.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {m.tags.map((t) => (
            <span key={t} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#ff5d00]/30 text-[#ffaa60]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaCard() {
  const tiltRef = useTilt<HTMLDivElement>(10);
  return (
    <div
      ref={tiltRef}
      className="case-card group relative h-full min-h-[320px] rounded-[2.5rem] overflow-hidden flex flex-col justify-between p-8 md:p-10 bg-[#ff5d00] text-[#0d0101]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="spotlight pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="cta-orbit absolute -right-24 -top-24 w-72 h-72 rounded-full border-2 border-dashed border-[#0d0101]/20" />
      <div className="cta-orbit-rev absolute -right-10 -top-10 w-44 h-44 rounded-full border-2 border-[#0d0101]/15">
        <span className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-[#0d0101]" />
      </div>
      <span className="relative text-xs font-black uppercase tracking-[0.35em] opacity-60">Próximo case</span>
      <div className="relative">
        <h3 className="font-black text-3xl md:text-4xl leading-[1] tracking-tight mb-6">
          Sua marca pode ser a <span className="italic">próxima</span> aqui.
        </h3>
        <Magnetic>
          <button
            onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-3 bg-[#0d0101] text-[#ff5d00] font-black text-sm uppercase tracking-wider px-7 py-4 rounded-full hover:bg-black transition-colors"
          >
            Quero meu case
            <ArrowUpRight size={16} />
          </button>
        </Magnetic>
      </div>
    </div>
  );
}

function VideoLightbox({ project, onClose }: { project: (typeof MOTION_PROJECTS)[number] | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!project) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(".lightbox-panel", { scale: 0.85, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, { dependencies: [project], scope: overlayRef });

  const close = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  if (!project) return null;
  return (
    <div ref={overlayRef} onClick={close} className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
      <div onClick={(e) => e.stopPropagation()} className="lightbox-panel relative w-full max-w-5xl">
        <button onClick={close} aria-label="Fechar vídeo" className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-[#ff5d00] text-[#0d0101] flex items-center justify-center hover:rotate-90 transition-transform duration-300">
          <X size={18} />
        </button>
        <video src={project.src} poster={project.poster} controls autoPlay playsInline className="w-full rounded-3xl bg-black shadow-2xl shadow-[#ff5d00]/20" />
        <div className="mt-4 flex items-center justify-between text-[#fffafa]">
          <h4 className="font-black text-xl">{project.title}</h4>
          <span className="text-xs font-bold uppercase tracking-widest text-[#fffafa]/50">{project.tags.join(" · ")}</span>
        </div>
      </div>
    </div>
  );
}

// ── Seção ────────────────────────────────────────────────────────────────

export function CasesShowcase({ isDark }: { isDark: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");
  const [openVideo, setOpenVideo] = useState<(typeof MOTION_PROJECTS)[number] | null>(null);

  const fg = isDark ? "text-[#fffafa]" : "text-[#0d0101]";
  const fgMuted = isDark ? "text-[#fffafa]/55" : "text-[#0d0101]/55";
  const altBg = isDark ? "bg-[#130808]" : "bg-[#f7f5f5]";

  // Animações de entrada, marquee e loops decorativos
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Título letra por letra
      SplitText.create(".cases-title", {
        type: "chars,words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            rotationX: -90,
            opacity: 0,
            transformOrigin: "50% 100%",
            stagger: 0.03,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".cases-title", start: "top 85%", once: true },
          }),
      });

      gsap.from(".cases-eyebrow, .cases-sub, .cases-tabs", {
        y: 24,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cases-title", start: "top 85%", once: true },
      });

      // Revelação dos cards com clip-path
      gsap.utils.toArray<HTMLElement>(".case-reveal").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(18% 8% 18% 8% round 3rem)",
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Contadores
      gsap.utils.toArray<HTMLElement>(".counter").forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number(el.dataset.value),
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        });
      });

      // Destaque: parallax da imagem, tags e métricas
      gsap.fromTo(".parallax-img", { yPercent: -12 }, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: ".parallax-img", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from(".feat-tag, .feat-metric", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        stagger: 0.07,
        duration: 0.7,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".feat-metric", start: "top 90%", once: true },
      });

      // Loops decorativos
      gsap.to(".border-spin", { rotation: 360, duration: 6, ease: "none", repeat: -1 });
      gsap.to(".play-ring", { rotation: 360, duration: 12, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(".cta-orbit", { rotation: 360, duration: 30, ease: "none", repeat: -1 });
      gsap.to(".cta-orbit-rev", { rotation: -360, duration: 9, ease: "none", repeat: -1 });

      // Marquee que acelera e inverte com a velocidade do scroll
      const rows = gsap.utils.toArray<HTMLElement>(".marquee-row");
      const loops = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 28, ease: "none", repeat: -1 })
      );
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
          loops.forEach((l) => {
            gsap.to(l, { timeScale: (self.direction || 1) * (1 + Math.abs(boost)), duration: 0.2, overwrite: true });
            gsap.to(l, { timeScale: self.direction || 1, duration: 1.2, delay: 0.25, ease: "power2.out" });
          });
        },
      });
    });
  }, { scope: sectionRef });

  // Indicador deslizante das abas
  useLayoutEffect(() => {
    const btn = tabsRef.current?.querySelector<HTMLElement>(`[data-filter="${filter}"]`);
    if (!btn || !indicatorRef.current) return;
    gsap.to(indicatorRef.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: indicatorRef.current.dataset.ready ? 0.6 : 0,
      ease: "expo.out",
    });
    indicatorRef.current.dataset.ready = "1";
  }, [filter]);

  // Transição FLIP entre filtros
  useLayoutEffect(() => {
    if (!flipState.current || !gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".grid-item");
    Flip.from(flipState.current, {
      targets: items,
      duration: 0.7,
      ease: "expo.inOut",
      absolute: true,
      nested: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.15, ease: "expo.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35, ease: "power2.in" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    flipState.current = null;
  }, [filter]);

  const changeFilter = (f: Filter) => {
    if (f === filter || !gridRef.current) return;
    flipState.current = Flip.getState(gridRef.current.querySelectorAll(".grid-item"));
    setFilter(f);
  };

  const marqueeWords = ["Sites", "E-commerce", "Tráfego Pago", "SEO", "Motion Graphics", "Branding", "Performance"];

  return (
    <section id="cases" ref={sectionRef} className={`relative py-24 md:py-36 ${altBg} overflow-hidden`}>
      <style>{`
        #cases .spotlight { background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(255,170,96,0.18), transparent 45%); }
      `}</style>

      <div className="container mx-auto max-w-7xl px-5 md:px-10">
        {/* Header */}
        <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <span className={`cases-eyebrow inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${fgMuted}`}>
              <span className="w-8 h-px bg-[#ff5d00]" /> Resultados reais
            </span>
            <h2 className="cases-title mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.8rem, 8vw, 9rem)", perspective: 600 }}>
              <span className={fg}>Cases de</span>
              <br />
              <span className="text-[#ff5d00] italic pr-3">Sucesso.</span>
            </h2>
          </div>
          <p className={`cases-sub text-lg font-medium max-w-sm ${fgMuted}`}>
            Estratégias sob medida e peças em movimento que transformaram presença digital em crescimento real.
          </p>
        </div>

        {/* Filtros */}
        <div className="cases-tabs mb-10 md:mb-14 -mx-5 px-5 overflow-x-auto scrollbar-none">
          <div
            ref={tabsRef}
            className={`relative inline-flex gap-1 p-1.5 rounded-full border ${isDark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white"}`}
          >
            <span ref={indicatorRef} className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-[#ff5d00] shadow-lg shadow-[#ff5d00]/30" style={{ width: 0 }} />
            {FILTERS.map(({ id, label, icon: Icon, badge }) => {
              const active = filter === id;
              return (
                <button
                  key={id}
                  data-filter={id}
                  onClick={() => changeFilter(id)}
                  className={`relative z-10 inline-flex items-center gap-2 whitespace-nowrap px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-colors duration-300 ${
                    active ? "text-[#0d0101]" : `${fg} opacity-70 hover:opacity-100`
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  <span className={`text-[10px] tabular-nums px-1.5 rounded-full ${active ? "bg-[#0d0101]/15" : isDark ? "bg-white/10" : "bg-black/5"}`}>
                    {countFor(id)}
                  </span>
                  {badge && (
                    <span className="relative inline-flex items-center text-[9px] px-2 py-0.5 rounded-full bg-[#0d0101] text-[#ff5d00]">
                      <span className="absolute inset-0 rounded-full bg-[#ff5d00]/40 animate-ping" />
                      <span className="relative">{badge}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mb-12 md:mb-16 -rotate-1 select-none pointer-events-none" aria-hidden>
        {[0, 1].map((r) => (
          <div key={r} className={`overflow-hidden py-3 ${r === 0 ? "bg-[#ff5d00] text-[#0d0101]" : `${isDark ? "text-[#fffafa]/15" : "text-[#0d0101]/15"}`}`}>
            <div className="marquee-row flex w-max">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0">
                  {marqueeWords.map((w) => (
                    <span key={w + dup} className="flex items-center gap-6 pr-6 font-black uppercase italic text-2xl md:text-4xl tracking-tight">
                      {w}
                      <Sparkles size={22} className={r === 0 ? "text-[#0d0101]" : "text-[#ff5d00]/50"} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="container mx-auto max-w-7xl px-5 md:px-10">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((item) => {
            const span =
              item.kind === "featured"
                ? "md:col-span-2 lg:col-span-3"
                : item.kind === "motion" && item.data.featured
                  ? "md:col-span-2"
                  : "";
            return (
              <div
                key={item.id}
                data-flip-id={item.id}
                className={`grid-item ${span}`}
                style={{ display: isVisible(item, filter) ? undefined : "none" }}
              >
                <div className="case-reveal h-full">
                  {item.kind === "featured" && <FeaturedCase />}
                  {item.kind === "case" && <CaseCard c={item.data} />}
                  {item.kind === "motion" && <MotionCard m={item.data} onOpen={() => setOpenVideo(item.data)} />}
                  {item.kind === "cta" && <CtaCard />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <VideoLightbox project={openVideo} onClose={() => setOpenVideo(null)} />
    </section>
  );
}
