import { useRef } from "react";
import { Clapperboard } from "lucide-react";
import { Monitor, Target, TrendingUp, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, revealIn, scrollToId } from "@/lib/motion";
import { useTilt } from "@/components/motion-fx";
import { BackgroundOrb } from "@/components/BackgroundOrb";
import { tokens } from "./tokens";

const SERVICES: {
  num: string;
  heading: string;
  desc: string;
  tags: string[];
  Icon: typeof Monitor;
  video?: string;
  poster?: string;
  videoMobile?: string;
  posterMobile?: string;
  badge?: string;
}[] = [
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
  {
    num: "04",
    heading: "Motion Graphics",
    desc: "Vídeos e animações que prendem a atenção nos primeiros segundos: comerciais, vinhetas, anúncios animados e conteúdo para redes — entregues nos formatos horizontal e vertical, prontos para site, YouTube, Reels e Stories.",
    tags: ["Comerciais animados", "Reels & Stories", "16:9 + 9:16"],
    Icon: Clapperboard,
    video: "/motion/clube-do-med-sp-16x9.mp4",
    poster: "/motion/clube-do-med-sp-16x9.jpg",
    videoMobile: "/motion/clube-do-med-sp-9x16.mp4",
    posterMobile: "/motion/clube-do-med-sp-9x16.jpg",
    badge: "Novo",
  },
];

function ServiceCard({ s, isDark, index }: { s: (typeof SERVICES)[number]; isDark: boolean; index: number }) {
  const tilt = useTilt<HTMLDivElement>(7);
  const t = tokens(isDark);
  const { Icon } = s;
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLVideoElement>(null);
  useGSAP(() => {
    const vids = [videoRef.current, phoneRef.current].filter(Boolean) as HTMLVideoElement[];
    if (!vids.length) return;
    ScrollTrigger.create({
      trigger: vids[0],
      start: "top 95%",
      end: "bottom 5%",
      onToggle: (self) => vids.forEach((v) => (self.isActive ? v.play().catch(() => {}) : v.pause())),
    });
  });
  return (
    <div
      ref={tilt}
      className={`service-card group relative rounded-[36px] p-8 md:p-10 overflow-hidden ${t.card} cursor-default ${s.video ? "lg:col-span-3 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center" : "flex flex-col min-h-[440px]"}`}
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

      {s.video && (
        <div className="relative pr-[16%] pb-[6%]">
          <div className="relative aspect-video rounded-2xl overflow-hidden ring-1 ring-black/10 bg-black shadow-2xl">
            <video ref={videoRef} src={s.video} poster={s.poster} muted loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d00] animate-pulse" /> Case Clube do Med
            </span>
          </div>
          {s.videoMobile && (
            <div className="absolute right-0 bottom-0 w-[24%] rounded-[1.4rem] bg-[#111] p-[3%] shadow-2xl ring-1 ring-white/15 rotate-[4deg] group-hover:rotate-0 group-hover:-translate-y-2 transition-transform duration-700">
              <div className="relative aspect-[9/16] rounded-[1.1rem] overflow-hidden bg-black">
                <video ref={phoneRef} src={s.videoMobile} poster={s.posterMobile} muted loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[34%] h-[3%] rounded-full bg-black" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`relative flex flex-col ${s.video ? "" : "flex-1"}`}>
        <div className="relative flex items-start justify-between">
        <span className="w-14 h-14 rounded-2xl bg-[#ff5d00] text-[#0d0101] group-hover:bg-[#0d0101] group-hover:text-[#ff5d00] flex items-center justify-center transition-colors duration-500 group-hover:rotate-[-8deg]">
          <Icon size={26} strokeWidth={2.2} />
        </span>
        <span className={`font-black text-6xl leading-none tracking-tighter text-transparent transition-colors duration-500`} style={{ WebkitTextStroke: `1.5px ${isDark ? "rgba(255,250,250,0.25)" : "rgba(13,1,1,0.18)"}` }}>
          {s.num}
        </span>
      </div>

        <div className="relative mt-10 flex flex-col flex-1">
        <h3 className={`font-black text-2xl md:text-3xl mb-4 leading-tight ${t.fg} group-hover:text-[#0d0101] transition-colors duration-500`}>
          {s.heading}
          {s.badge && (
            <span className="ml-3 align-middle inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#0d0101] text-[#ff5d00]">{s.badge}</span>
          )}
        </h3>
        <p className={`font-medium text-base leading-relaxed ${t.fgMuted} group-hover:text-[#0d0101]/75 transition-colors duration-500`}>{s.desc}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {s.tags.map((tag) => (
            <span key={tag} className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors duration-500 ${isDark ? "border-white/15 text-[#fffafa]/70" : "border-black/10 text-[#0d0101]/70"} group-hover:border-[#0d0101]/25 group-hover:text-[#0d0101]`}>
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            if (s.video) {
              window.dispatchEvent(new CustomEvent("orbara:cases-filter", { detail: "motion" }));
              scrollToId("cases");
            } else scrollToId("contato");
          }}
          className={`mt-auto pt-8 self-start inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider ${t.fg} group-hover:text-[#0d0101] transition-colors duration-500`}
          data-index={index}
        >
          {s.video ? "Ver cases de motion" : "Quero esse serviço"}
          <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
        </button>
        </div>
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
              <span className={t.fg}>Quatro frentes.</span>{" "}
              <span className="text-[#ff5d00] italic pr-2">Um resultado.</span>
            </h2>
          </div>
          <p className={`fade-up text-lg font-medium max-w-sm ${t.fgMuted}`}>
            Site, mídia paga, SEO e motion trabalhando juntos — cada frente alimenta a outra.
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
