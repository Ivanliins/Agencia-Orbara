import { useRef } from "react";
import { Monitor, Target, TrendingUp, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, revealIn, scrollToId } from "@/lib/motion";
import { useTilt } from "@/components/motion-fx";
import { BackgroundOrb } from "@/components/BackgroundOrb";
import { tokens } from "./tokens";

const SERVICES = [
  {
    num: "01",
    heading: "Sites que convertem",
    desc: "Um site lento, confuso ou desatualizado custa vendas todos os dias. Projetamos cada página como uma vitrine estratégica: arquitetura de conversão, hierarquia visual clara e copy que guia o visitante até o sim.",
    tags: ["Landing pages", "Institucionais", "E-commerce"],
    Icon: Monitor,
  },
  {
    num: "02",
    heading: "Google Ads cirúrgico",
    desc: "Aparecer quando o cliente já está pronto para comprar é a forma mais eficiente de investir em marketing. Campanhas de busca com segmentação precisa, landing pages dedicadas e otimização diária do custo por lead.",
    tags: ["Rede de pesquisa", "Remarketing", "Custo por lead"],
    Icon: Target,
  },
  {
    num: "03",
    heading: "SEO que sustenta",
    desc: "Ads trazem tráfego enquanto você paga. O SEO constrói um ativo que trabalha 24h por dia, sem custo por clique — e cresce com o tempo. É o canal com maior ROI no longo prazo, se feito do jeito certo.",
    tags: ["SEO técnico", "SEO local", "Conteúdo"],
    Icon: TrendingUp,
  },
];

function ServiceCard({ s, isDark, index }: { s: (typeof SERVICES)[number]; isDark: boolean; index: number }) {
  const tilt = useTilt<HTMLDivElement>(7);
  const t = tokens(isDark);
  const { Icon } = s;
  return (
    <div
      ref={tilt}
      className={`service-card group relative rounded-[36px] p-8 md:p-10 flex flex-col min-h-[460px] overflow-hidden ${t.card} cursor-default`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Preenchimento laranja no hover */}
      <div className="absolute inset-0 bg-[#ff5d00] [clip-path:circle(0%_at_100%_0%)] group-hover:[clip-path:circle(150%_at_100%_0%)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]" />
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.22), transparent 45%)" }} />

      <Icon
        size={180}
        strokeWidth={0.8}
        className="service-bg-icon absolute -right-8 -bottom-8 pointer-events-none text-[#ff5d00] opacity-[0.08] group-hover:text-[#0d0101] group-hover:opacity-[0.12] transition-colors duration-500"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <span className="w-14 h-14 rounded-2xl bg-[#ff5d00] text-[#0d0101] group-hover:bg-[#0d0101] group-hover:text-[#ff5d00] flex items-center justify-center transition-colors duration-500 group-hover:rotate-[-8deg]">
          <Icon size={26} strokeWidth={2.2} />
        </span>
        <span className={`font-black text-6xl leading-none tracking-tighter text-transparent transition-colors duration-500`} style={{ WebkitTextStroke: `1.5px ${isDark ? "rgba(255,250,250,0.25)" : "rgba(13,1,1,0.18)"}` }}>
          {s.num}
        </span>
      </div>

      <div className="relative mt-10 flex flex-col flex-1">
        <h3 className={`font-black text-2xl md:text-3xl mb-4 leading-tight ${t.fg} group-hover:text-[#0d0101] transition-colors duration-500`}>{s.heading}</h3>
        <p className={`font-medium text-base leading-relaxed ${t.fgMuted} group-hover:text-[#0d0101]/75 transition-colors duration-500`}>{s.desc}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {s.tags.map((tag) => (
            <span key={tag} className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors duration-500 ${isDark ? "border-white/15 text-[#fffafa]/70" : "border-black/10 text-[#0d0101]/70"} group-hover:border-[#0d0101]/25 group-hover:text-[#0d0101]`}>
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => scrollToId("contato")}
          className={`mt-auto pt-8 self-start inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider ${t.fg} group-hover:text-[#0d0101] transition-colors duration-500`}
          data-index={index}
        >
          Quero esse serviço
          <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
        </button>
      </div>
    </div>
  );
}

export function Services({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".service-card", {
        y: 120,
        opacity: 0,
        rotationX: 18,
        transformPerspective: 1000,
        transformOrigin: "50% 100%",
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
        clearProps: "rotationX,transformPerspective",
        scrollTrigger: { trigger: ".services-grid", start: "top 82%", once: true },
      });
      gsap.to(".service-bg-icon", { rotation: 12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, { scope: ref });

  return (
    <section id="servicos" ref={ref} className={`py-24 md:py-36 px-5 md:px-10 ${t.bg} relative overflow-hidden`}>
      <BackgroundOrb isDark={isDark} size={500} offsetX="-5%" offsetY="70%" className="opacity-60" />
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-14 md:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className={`fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${t.fgFaint}`}>
              <span className="w-8 h-px bg-[#ff5d00]" /> O que fazemos
            </span>
            <h2 className="split-reveal mt-3 font-black tracking-tight" style={{ fontSize: "clamp(2.4rem, 6vw, 7rem)", lineHeight: 0.95, perspective: 600 }}>
              <span className={t.fg}>Três frentes.</span>{" "}
              <span className="text-[#ff5d00] italic pr-2">Um resultado.</span>
            </h2>
          </div>
          <p className={`fade-up text-lg font-medium max-w-sm ${t.fgMuted}`}>
            Site, mídia paga e SEO trabalhando juntos — cada frente alimenta a outra.
          </p>
        </div>
        <div className="services-grid grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.num} s={s} isDark={isDark} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
