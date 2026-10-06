import { useRef } from "react";
import { ArrowUpRight, TrendingUp, Search, Users } from "lucide-react";
import { gsap, SplitText, useGSAP, scrollToId } from "@/lib/motion";
import { Magnetic } from "@/components/motion-fx";

const FLOATING_STATS = [
  { icon: TrendingUp, value: "+138%", label: "em vendas online", client: "Voltari", pos: "top-[18%] right-[6%]" },
  { icon: Users, value: "+91%", label: "novos clientes/mês", client: "Advocacia", pos: "top-[46%] right-[22%]" },
  { icon: Search, value: "Top 3", label: "no Google", client: "SEO local", pos: "bottom-[16%] right-[4%]" },
];

const TRUST = ["Design Exclusivo", "Sem fidelidade", "Resultados a partir de 30 dias", "Atendimento exclusivo"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
      const split = SplitText.create(lines, { type: "lines,chars", mask: "lines" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 })
        .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.03 }, 0.1)
        .from(".hero-sub", { y: 30, opacity: 0, duration: 1 }, 0.7)
        .from(".hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 1 }, 0.85)
        .from(".hero-trust > *", { y: 16, opacity: 0, stagger: 0.07, duration: 0.8 }, 1)
        .from(".hero-stat", { scale: 0.6, opacity: 0, y: 60, stagger: 0.15, duration: 1.2, ease: "back.out(1.6)" }, 0.8)
        .from(".hero-scroll", { opacity: 0, y: -10, duration: 0.8 }, 1.4);

      // Cards flutuando
      gsap.utils.toArray<HTMLElement>(".hero-stat-inner").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 14 : -14, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

      // Parallax do conteúdo ao rolar
      gsap.to(".hero-content", {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-video", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-stats", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Mouse move: cards reagem ao cursor
      if (window.matchMedia("(hover: hover)").matches) {
        const xTo = gsap.quickTo(".hero-stats", "x", { duration: 1, ease: "power3.out" });
        const move = (e: PointerEvent) => xTo((e.clientX / window.innerWidth - 0.5) * -30);
        ref.current?.addEventListener("pointermove", move);
        return () => ref.current?.removeEventListener("pointermove", move);
      }
      return undefined;
    });

    gsap.to(".hero-scroll-dot", { y: 12, opacity: 0, duration: 1.4, ease: "power2.in", repeat: -1 });
  }, { scope: ref });

  return (
    <section
      id="inicio"
      ref={ref}
      className="min-h-[100dvh] flex flex-col justify-center pt-32 pb-24 px-5 md:px-10 relative overflow-hidden bg-[#050510]"
    >
      <div className="hero-video absolute inset-0 will-change-transform">
        <video autoPlay muted loop playsInline preload="none" poster="/hero-bg.jpg" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.85 }}>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Cards de resultado flutuando (desktop) */}
      <div className="hero-stats absolute inset-0 pointer-events-none hidden lg:block">
        {FLOATING_STATS.map(({ icon: Icon, value, label, client, pos }) => (
          <div key={value} className={`hero-stat absolute ${pos}`}>
            <div className="hero-stat-inner flex items-center gap-4 rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-xl px-5 py-4 shadow-2xl shadow-black/40">
              <span className="w-11 h-11 rounded-2xl bg-[#ff5d00] text-[#0d0101] flex items-center justify-center">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              <div>
                <div className="text-2xl font-black text-white leading-none">{value}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/60 mt-1">
                  {label} · <span className="text-[#ffaa60]">{client}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-content container mx-auto max-w-7xl relative z-10">
        <div className="hero-eyebrow inline-flex items-center gap-3 mb-8 md:mb-10 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur px-4 py-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[#ff5d00] animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-[#ff5d00]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">Agência Direta · Sem Dar Voltas</span>
        </div>

        <h1 className="font-black leading-[0.88] tracking-[-0.04em] lg:max-w-[62%]" style={{ fontSize: "clamp(3.6rem, 10.5vw, 12.5rem)" }}>
          <span className="hero-line block text-white">Sites que</span>
          <span className="hero-line block text-[#ff5d00] italic pr-4">orbitam</span>
          <span className="hero-line block text-white">resultado.</span>
        </h1>

        <p className="hero-sub mt-8 md:mt-10 text-lg md:text-xl text-white/70 max-w-lg font-normal leading-relaxed">
          Do primeiro clique a potenciais clientes de interesse nos produtos ou serviços da sua empresa. Construímos a presença digital que transforma <strong className="text-white font-semibold">leads em clientes</strong>.
        </p>

        <div className="hero-cta mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Magnetic>
            <button
              onClick={() => scrollToId("contato")}
              className="group inline-flex items-center gap-3 bg-[#ff5d00] text-[#0d0101] font-black text-sm pl-8 pr-2.5 py-2.5 rounded-full shadow-lg shadow-[#ff5d00]/40 uppercase tracking-wide hover:bg-[#ff7020] transition-colors"
            >
              Quero orbitar resultado
              <span className="w-11 h-11 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </button>
          </Magnetic>
          <button
            onClick={() => scrollToId("seo")}
            className="group relative text-white/85 font-semibold text-sm uppercase tracking-wider hover:text-white transition-colors"
          >
            Como geramos leads
            <span className="absolute left-0 -bottom-2 h-px w-full bg-[#ff5d00]/60 origin-left transition-transform duration-500 group-hover:scale-x-0" />
            <span className="absolute left-0 -bottom-2 h-px w-full bg-white origin-right scale-x-0 transition-transform duration-500 delay-100 group-hover:scale-x-100 group-hover:origin-left" />
          </button>
        </div>

        <div className="hero-trust mt-14 md:mt-16 flex flex-wrap gap-2.5">
          {TRUST.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur px-4 py-2 text-white/70 text-xs md:text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d00]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Indicador de scroll */}
      <button
        onClick={() => scrollToId("auditoria-instantanea")}
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3 text-white/50 hover:text-white transition-colors"
        aria-label="Rolar para baixo"
      >
        <span className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
          <span className="hero-scroll-dot w-1 h-2 rounded-full bg-[#ff5d00]" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Role</span>
      </button>
    </section>
  );
}
