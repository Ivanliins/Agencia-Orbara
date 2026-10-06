import { useRef } from "react";
import { Search, TrendingUp, MousePointerClick, Users, DollarSign, Repeat2, ArrowUpRight, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, revealIn, scrollToId } from "@/lib/motion";
import { Magnetic } from "@/components/motion-fx";
import { BackgroundOrb } from "@/components/BackgroundOrb";
import { tokens } from "./tokens";

const STEPS = [
  { icon: Search, title: "Intenção de busca", desc: "Seu cliente não sabe que você existe, mas sabe que tem um problema. Ele abre o Google e digita." },
  { icon: TrendingUp, title: "Palavra-chave estratégica", desc: "Mapeamos exatamente o que seu cliente ideal digita quando está pronto para comprar — não só quando está curioso." },
  { icon: MousePointerClick, title: "Ranking no Top 3", desc: "83% dos cliques vão para os três primeiros resultados. Construímos a autoridade que coloca você lá." },
  { icon: Users, title: "Tráfego orgânico", desc: "Sem custo por visita. Ao contrário dos anúncios, esse tráfego é seu — e cresce mês a mês." },
  { icon: DollarSign, title: "Página que converte", desc: "A visita vira interesse. Copy + design estratégico transformam leitores em pessoas que querem falar com você." },
  { icon: Repeat2, title: "Lead qualificado", desc: "Um potencial cliente que chegou até você por vontade própria, com dor real e intenção de resolver. O ciclo se fecha — e se repete." },
];

export function SeoJourney({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();

    // Desktop: trilha horizontal fixada
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = ref.current!.querySelector<HTMLElement>(".seo-track")!;
      const distance = () => track.scrollWidth - window.innerWidth + 80;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".seo-pin",
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(".seo-progress", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".seo-pin", start: "top top", end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true },
      });
      gsap.utils.toArray<HTMLElement>(".seo-step").forEach((card) => {
        gsap.fromTo(card, { opacity: 0.35, scale: 0.92 }, {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true },
        });
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: "left 60%",
          toggleClass: { targets: card.querySelector(".seo-dot-d"), className: "is-on" },
        });
      });
    });

    // Mobile/tablet: lista vertical com linha desenhada
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".seo-vline", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".seo-track", start: "top 70%", end: "bottom 70%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".seo-step").forEach((card) => {
        gsap.from(card, { x: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".seo-insight", {
        y: 60, opacity: 0, scale: 0.96, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".seo-insight", start: "top 88%", once: true },
      });
    });
  }, { scope: ref });

  return (
    <section id="seo" ref={ref} className={`py-24 md:py-36 ${t.altBg} relative overflow-hidden`}>
      <BackgroundOrb isDark={isDark} size={700} offsetX="-20%" offsetY="30%" className="opacity-50" />

      <div className="container mx-auto max-w-7xl relative z-10 px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-14 lg:mb-6">
          <div>
            <span className={`fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${t.fgFaint}`}>
              <span className="w-8 h-px bg-[#ff5d00]" /> SEO & Geração de Leads
            </span>
            <h2 className="split-reveal mt-3 font-black leading-[0.92] tracking-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", perspective: 600 }}>
              <span className={t.fg}>Seu próximo cliente está </span>
              <span className="text-[#ff5d00] italic pr-2">pesquisando agora.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className={`fade-up text-lg md:text-xl leading-relaxed ${t.fgMuted} mb-6`}>
              Neste exato momento, alguém digita no Google o serviço que você oferece. A pergunta é:{" "}
              <strong className={t.fg}>sua empresa aparece — ou é o concorrente?</strong>
            </p>
            <p className={`fade-up text-lg md:text-xl leading-relaxed ${t.fgMuted} mb-8`}>
              O SEO não compra visibilidade. Ele a conquista — e essa conquista tem juros compostos. Quanto mais tempo de investimento, maior o retorno.
            </p>
            {/* Barra de busca simulada */}
            <div className={`fade-up flex items-center gap-3 rounded-full px-5 py-3.5 ${isDark ? "bg-white/[0.05] border border-white/10" : "bg-white border border-black/[0.07] shadow-sm"}`}>
              <Search size={18} className="text-[#ff5d00] shrink-0" />
              <span className={`text-sm font-medium truncate ${t.fg}`}>68% das experiências online começam com uma busca no Google</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trilha fixada */}
      <div className="seo-pin lg:h-screen lg:flex lg:flex-col lg:justify-center relative z-10">
        <div className="hidden lg:flex items-center gap-4 px-10 mb-10 max-w-7xl mx-auto w-full">
          <span className={`text-xs font-black uppercase tracking-[0.3em] ${t.fgFaint}`}>A jornada do lead</span>
          <div className={`relative h-[3px] flex-1 rounded-full overflow-hidden ${t.hairline}`}>
            <div className="seo-progress absolute inset-0 bg-[#ff5d00] origin-left" />
          </div>
          <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] ${t.fgFaint}`}>
            Role <ArrowRight size={14} />
          </span>
        </div>

        <div className="relative px-5 md:px-10 lg:px-0">
          <div className={`seo-vline lg:hidden absolute left-[2.35rem] md:left-[3.6rem] top-4 bottom-4 w-[2px] bg-[#ff5d00] origin-top`} />
          <div className="seo-track flex flex-col lg:flex-row gap-5 lg:gap-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-10 lg:w-max will-change-transform">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="seo-step relative pl-14 lg:pl-0 lg:w-[400px] shrink-0">
                  <span className={`seo-dot lg:hidden absolute left-[0.6rem] md:left-[1.1rem] top-8 w-4 h-4 rounded-full border-4 ${isDark ? "border-[#130808]" : "border-[#f7f5f5]"} bg-[#ff5d00]`} />
                  <div className={`relative h-full rounded-[32px] p-8 md:p-10 overflow-hidden ${t.card}`}>
                    <div className="flex items-center justify-between mb-10">
                      <span className="w-12 h-12 rounded-2xl bg-[#ff5d00] text-[#0d0101] flex items-center justify-center">
                        <Icon size={22} strokeWidth={2.4} />
                      </span>
                      <span className={`hidden lg:block seo-dot-d w-3 h-3 rounded-full transition-all duration-300 [&.is-on]:bg-[#ff5d00] [&.is-on]:scale-150 [&.is-on]:shadow-[0_0_12px_#ff5d00] ${isDark ? "bg-white/15" : "bg-black/10"}`} />
                    </div>
                    <span className="block font-black text-[#ff5d00] text-sm tabular-nums mb-2">0{i + 1} / 06</span>
                    <h3 className={`font-black text-2xl mb-3 ${t.fg}`}>{step.title}</h3>
                    <p className={`text-base leading-relaxed ${t.fgMuted}`}>{step.desc}</p>
                    <span
                      className="absolute -right-3 -bottom-8 font-black leading-none select-none pointer-events-none text-transparent"
                      style={{ fontSize: "9rem", WebkitTextStroke: `1.5px ${isDark ? "rgba(255,93,0,0.18)" : "rgba(255,93,0,0.2)"}` }}
                      aria-hidden
                    >
                      0{i + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 px-5 md:px-10">
        <div className="seo-insight mt-16 lg:mt-10 p-8 md:p-12 rounded-[36px] bg-[#0d0101] text-[#fffafa] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,93,0,0.35),transparent_70%)] blur-2xl" />
          <div className="relative max-w-2xl">
            <h3 className="font-black text-2xl md:text-3xl mb-3">
              O lead orgânico é o lead mais barato — <span className="text-[#ff5d00] italic">e o mais qualificado.</span>
            </h3>
            <p className="text-base md:text-lg text-[#fffafa]/65 leading-relaxed">
              São 3 a 6 meses para os primeiros resultados consistentes. E anos de liderança para quem começa primeiro. Cada mês de atraso é um mês a mais que seu concorrente leva de vantagem.
            </p>
          </div>
          <Magnetic className="relative shrink-0">
            <button
              onClick={() => scrollToId("contato")}
              className="group inline-flex items-center gap-3 bg-[#ff5d00] text-[#0d0101] font-black text-sm pl-7 pr-2.5 py-2.5 rounded-full uppercase tracking-wide"
            >
              Começar agora
              <span className="w-10 h-10 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={17} />
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
