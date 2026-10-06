import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { scrollToId, whileVisible } from "@/lib/motion";
import { useTilt, Magnetic } from "@/components/motion-fx";
import { MotionShowcase } from "@/components/MotionShowcase";
import { ArrowUpRight, Sparkles, Film, Globe, TrendingUp, LayoutGrid } from "lucide-react";

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

type GridItem =
  | { kind: "featured"; id: string; categories: Category[] }
  | { kind: "case"; id: string; categories: Category[]; data: (typeof CASES)[number] }
  | { kind: "motion"; id: string; categories: Category[] }
  | { kind: "cta"; id: string; categories: Category[] };

const ITEMS: GridItem[] = [
  { kind: "featured", id: "jr-queijo", categories: ["sites"] },
  ...CASES.map((c) => ({ kind: "case" as const, id: c.slug, categories: c.categories, data: c })),
  { kind: "motion", id: "orbara-studio", categories: ["motion"] },
  { kind: "motion", id: "clube-do-med", categories: ["motion"] },
  { kind: "cta", id: "cta", categories: ["sites", "motion"] },
];

const isVisible = (item: GridItem, filter: Filter) =>
  filter === "todos" || item.categories.includes(filter as Category);

const countFor = (filter: Filter) =>
  ITEMS.filter((i) => i.kind !== "cta" && isVisible(i, filter)).length;

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

function CtaCard() {
  const tiltRef = useTilt<HTMLDivElement>(3);
  return (
    <div
      ref={tiltRef}
      className="case-card group relative rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 md:p-12 bg-[#ff5d00] text-[#0d0101]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="spotlight pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="cta-orbit absolute -right-24 -top-24 w-72 h-72 rounded-full border-2 border-dashed border-[#0d0101]/20" />
      <div className="cta-orbit-rev absolute -right-10 -top-10 w-44 h-44 rounded-full border-2 border-[#0d0101]/15">
        <span className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-[#0d0101]" />
      </div>
      <div className="relative">
        <span className="block text-xs font-black uppercase tracking-[0.35em] opacity-60 mb-3">Próximo case</span>
        <h3 className="font-black text-3xl md:text-5xl leading-[1] tracking-tight">
          Sua marca pode ser a <span className="italic">próxima</span> aqui.
        </h3>
      </div>
      <Magnetic className="relative shrink-0">
        <button
          onClick={() => scrollToId("contato")}
          className="inline-flex items-center gap-3 bg-[#0d0101] text-[#ff5d00] font-black text-sm uppercase tracking-wider px-8 py-5 rounded-full hover:bg-black transition-colors"
        >
          Quero meu case
          <ArrowUpRight size={16} />
        </button>
      </Magnetic>
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
      gsap.to(".border-spin", { rotation: 360, duration: 6, ease: "none", repeat: -1, scrollTrigger: whileVisible(sectionRef.current) });
      gsap.to(".cta-orbit", { rotation: 360, duration: 30, ease: "none", repeat: -1, scrollTrigger: whileVisible(sectionRef.current) });
      gsap.to(".cta-orbit-rev", { rotation: -360, duration: 9, ease: "none", repeat: -1, scrollTrigger: whileVisible(sectionRef.current) });

      // Marquee que acelera e inverte com a velocidade do scroll
      const rows = gsap.utils.toArray<HTMLElement>(".marquee-row");
      const loops = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 28, ease: "none", repeat: -1, scrollTrigger: whileVisible(sectionRef.current) })
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

  // Permite que outras seções abram um filtro (ex.: "Ver cases de motion" em Serviços)
  useEffect(() => {
    const onFilter = (e: Event) => {
      const f = (e as CustomEvent<Filter>).detail;
      if (FILTERS.some((x) => x.id === f)) changeFilter(f);
    };
    window.addEventListener("orbara:cases-filter", onFilter);
    return () => window.removeEventListener("orbara:cases-filter", onFilter);
  });

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
              item.kind === "featured" || item.kind === "motion" || item.kind === "cta"
                ? "md:col-span-2 lg:col-span-3"
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
                  {item.kind === "motion" && <MotionShowcase caseId={item.id} />}
                  {item.kind === "cta" && <CtaCard />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
