import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, SplitText, useGSAP, scrollToId } from "@/lib/motion";
import { Magnetic } from "@/components/motion-fx";
import { LeadPhone } from "./LeadPhone";




const TRUST = ["Design Exclusivo", "Sem fidelidade", "Site no ar em 3 a 5 dias", "Atendimento exclusivo"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Poster mais leve no celular (o HTML pré-renderizado sai com a versão desktop)
    const video = ref.current?.querySelector("video");
    if (video && window.matchMedia("(max-width: 767px)").matches) video.poster = "/hero-bg-mobile.webp";

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
      const split = SplitText.create(lines, { type: "lines,chars", mask: "lines", aria: "none" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 })
        .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.03 }, 0.1)
        .from(".hero-sub", { y: 24, duration: 1 }, 0.7) // sem opacity: o subtítulo é o elemento LCP e já chega visível no HTML
        .from(".hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 1 }, 0.85)
        .from(".hero-trust > *", { y: 16, opacity: 0, stagger: 0.07, duration: 0.8 }, 1)
        .from(".hero-scroll", { opacity: 0, y: -10, duration: 0.8 }, 1.4);

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
        yPercent: -14,
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
      className="min-h-[100svh] flex flex-col justify-center pt-28 pb-16 md:pt-32 md:pb-20 px-5 md:px-10 relative overflow-hidden bg-[#050510]"
    >
      <div className="hero-video absolute inset-0 will-change-transform">
        <video autoPlay muted loop playsInline preload="none" poster="/hero-bg.webp" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.85 }}>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Celular recebendo leads (desktop) */}
      <div className="hero-stats absolute inset-y-0 right-[5%] xl:right-[8%] pt-16 pointer-events-none hidden lg:flex items-center z-[5]">
        <LeadPhone />
      </div>

      <div className="hero-content container mx-auto max-w-7xl relative z-10">
        <div className="hero-eyebrow inline-flex items-center gap-3 mb-6 md:mb-8 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur px-4 py-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[#ff5d00] animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-[#ff5d00]" />
          </span>
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] md:tracking-[0.3em] text-white/70 whitespace-nowrap">Agência Direta · Sem Dar Voltas</span>
        </div>

        {/* Cada linha fica inteira (sem quebrar no meio da palavra) e o tamanho acompanha a largura e a altura da tela */}
        <h1 aria-label="Sites que orbitam resultado." className="font-black leading-[0.9] tracking-[-0.04em] text-[clamp(2.6rem,min(14vw,9vh),5rem)] md:text-[clamp(3rem,min(7.4vw,12.5vh),9rem)]">
          <span className="hero-line block whitespace-nowrap text-white">Sites que</span>
          <span className="hero-line block whitespace-nowrap text-[#ff5d00] italic pr-4">orbitam</span>
          <span className="hero-line block whitespace-nowrap text-white">resultado.</span>
        </h1>

        <p className="hero-sub mt-6 md:mt-8 text-base md:text-lg text-white/70 max-w-xl lg:max-w-[52%] xl:max-w-xl font-normal leading-relaxed">
          Do primeiro clique a potenciais clientes de interesse nos produtos ou serviços da sua empresa. Construímos a presença digital que transforma <strong className="text-white font-semibold">leads em clientes</strong>.
        </p>

        <div className="hero-cta mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
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

        <div className="hero-trust mt-8 md:mt-10 flex flex-wrap gap-2.5 lg:max-w-[60%] xl:max-w-none">
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
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden [@media(min-width:768px)_and_(min-height:880px)]:flex flex-col items-center gap-3 text-white/50 hover:text-white transition-colors"
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
