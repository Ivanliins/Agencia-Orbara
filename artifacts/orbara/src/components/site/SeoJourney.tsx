import { useRef } from "react";
import { Search, Target, ArrowUpToLine, LayoutTemplate, MessageCircle, LineChart, ArrowUpRight, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, revealIn, scrollToId } from "@/lib/motion";
import { Magnetic } from "@/components/motion-fx";
import { BackgroundOrb } from "@/components/BackgroundOrb";
import { tokens, whatsappUrl } from "./tokens";

type Channel = "Google Ads" | "SEO" | "Site" | "WhatsApp" | "Medição";

const STEPS: { icon: typeof Search; title: string; desc: string; channels: Channel[] }[] = [
  { icon: Search, title: "Busca com intenção", desc: "Seu cliente tem um problema e digita no Google. É o momento mais quente da compra — e dura poucos segundos.", channels: ["Google Ads", "SEO"] },
  { icon: Target, title: "Palavras que vendem", desc: "Mapeamos o que seu cliente digita quando está pronto para contratar e deixamos de fora as buscas de curioso.", channels: ["Google Ads", "SEO"] },
  { icon: ArrowUpToLine, title: "Topo da página", desc: "O anúncio coloca você no topo desde os primeiros dias de campanha. O SEO constrói a posição orgânica que fica.", channels: ["Google Ads", "SEO"] },
  { icon: LayoutTemplate, title: "Página que converte", desc: "Rápida no celular, clara e com prova: em poucos segundos a visita entende o que você faz e por que confiar.", channels: ["Site"] },
  { icon: MessageCircle, title: "Contato no WhatsApp", desc: "Um toque e o cliente já está falando com você, com a mensagem pronta dizendo o que procura.", channels: ["WhatsApp"] },
  { icon: LineChart, title: "Medir e otimizar", desc: "Cada formulário e cada clique no WhatsApp é medido. Investimos mais no que traz cliente e cortamos o que não traz.", channels: ["Medição", "Google Ads"] },
];

const CHANNEL_STYLE: Record<Channel, string> = {
  "Google Ads": "bg-[#ff5d00] text-[#0d0101]",
  SEO: "bg-[#0d0101] text-[#ffaa60] ring-1 ring-[#ff5d00]/40",
  Site: "bg-[#ffaa60]/20 text-[#ff5d00]",
  WhatsApp: "bg-[#25d366]/15 text-[#1a9e4b]",
  Medição: "bg-[#ff5d00]/10 text-[#ff5d00]",
};

/** Resultado de busca simulado: o anúncio (Google Ads) e o 1º orgânico (SEO) da mesma empresa. */
const SERP = [
  { kind: "ad", tag: "Patrocinado", url: "suaempresa.com.br", title: "Dentista em Campinas — agende hoje sua avaliação", note: "Google Ads · desde os primeiros dias" },
  { kind: "seo", tag: "1º orgânico", url: "suaempresa.com.br › implante", title: "Implante dentário em Campinas: como funciona e quanto custa", note: "SEO · cresce mês a mês" },
  { kind: "rival", tag: "", url: "concorrente.com.br", title: "Clínica odontológica — saiba mais", note: "" },
] as const;

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
      gsap.fromTo(".serp-row", { x: 40, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: ".serp", start: "top 85%", once: true },
      });
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
            <p className={`fade-up text-lg md:text-xl leading-relaxed ${t.fgMuted} mb-4`}>
              Neste exato momento, alguém digita no Google o serviço que você oferece. A pergunta é:{" "}
              <strong className={t.fg}>sua empresa aparece — ou é o concorrente?</strong>
            </p>
            <p className={`fade-up text-lg md:text-xl leading-relaxed ${t.fgMuted} mb-8`}>
              Trabalhamos as <strong className={t.fg}>duas portas de entrada da busca</strong>: o anúncio no topo, que traz contatos desde os primeiros dias, e o resultado orgânico, que leva meses para amadurecer e depois traz cliente sem custo por clique.
            </p>

            {/* Busca simulada: anúncio + orgânico da mesma empresa */}
            <div className={`serp fade-up rounded-[28px] p-4 md:p-5 ${isDark ? "bg-white/[0.04] border border-white/10" : "bg-white border border-black/[0.07] shadow-[0_20px_60px_-30px_rgba(13,1,1,0.35)]"}`} aria-label="Exemplo de resultado de busca com anúncio e resultado orgânico da mesma empresa">
              <div className={`flex items-center gap-3 rounded-full px-4 py-2.5 mb-3 ${isDark ? "bg-white/[0.06]" : "bg-[#f4f2f2]"}`}>
                <Search size={16} className="text-[#ff5d00] shrink-0" />
                <span className={`text-sm font-medium ${t.fg}`}>dentista em campinas</span>
              </div>
              <ul className="flex flex-col gap-2">
                {SERP.map((r) => (
                  <li
                    key={r.url + r.kind}
                    className={`serp-row rounded-2xl px-4 py-3 ${
                      r.kind === "rival"
                        ? "opacity-40"
                        : r.kind === "ad"
                          ? "ring-2 ring-[#ff5d00] bg-[#ff5d00]/[0.06]"
                          : `ring-1 ring-[#ff5d00]/40 ${isDark ? "bg-white/[0.03]" : "bg-[#fffaf6]"}`
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[11px] font-semibold">
                      {r.tag && <span className={`px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider text-[9px] ${r.kind === "ad" ? "bg-[#0d0101] text-[#fffafa]" : "bg-[#ff5d00]/15 text-[#ff5d00]"}`}>{r.tag}</span>}
                      <span className={t.fgFaint}>{r.url}</span>
                    </div>
                    <div className={`mt-1 text-sm md:text-[15px] font-bold leading-snug ${r.kind === "rival" ? t.fgMuted : isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"}`}>{r.title}</div>
                    {r.note && <div className="mt-1.5 text-[11px] font-black uppercase tracking-wider text-[#ff5d00]">{r.note}</div>}
                  </li>
                ))}
              </ul>
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
                    <div className="relative z-10 mt-6 flex flex-wrap gap-1.5">
                      {step.channels.map((c) => (
                        <span key={c} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${CHANNEL_STYLE[c]}`}>{c}</span>
                      ))}
                    </div>
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
              Anúncio para vender agora. <span className="text-[#ff5d00] italic">SEO para vender sempre.</span>
            </h3>
            <p className="text-base md:text-lg text-[#fffafa]/65 leading-relaxed">
              Começamos pelo que traz contato mais rápido e usamos os dados das campanhas para escolher as palavras do SEO. Na nossa experiência, o orgânico leva de 3 a 6 meses para dar resultado consistente — e depois continua trazendo cliente sem pagar por clique.
            </p>
          </div>
          <div className="relative shrink-0 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3">
            <Magnetic>
              <button
                onClick={() => scrollToId("auditoria-instantanea")}
                className="group w-full inline-flex items-center justify-between gap-3 bg-[#ff5d00] text-[#0d0101] font-black text-sm pl-7 pr-2.5 py-2.5 rounded-full uppercase tracking-wide"
              >
                Diagnóstico grátis do meu site
                <span className="w-10 h-10 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={17} />
                </span>
              </button>
            </Magnetic>
            <a
              href={whatsappUrl("seo")}
              data-wa-source="seo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-wide hover:border-[#25d366] hover:text-[#25d366] transition-colors"
            >
              <MessageCircle size={17} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
