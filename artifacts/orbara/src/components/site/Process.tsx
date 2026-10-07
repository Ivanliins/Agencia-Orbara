import { useRef } from "react";
import { Ear, Compass, Rocket, BarChart3 } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, revealIn } from "@/lib/motion";
import { tokens } from "./tokens";

const STEPS = [
  { title: "Escuta", icon: Ear, desc: "Mergulhamos no seu negócio, no seu cliente ideal e na concorrência. Sem entender o contexto, qualquer estratégia é chute." },
  { title: "Estratégia", icon: Compass, desc: "Desenhamos a arquitetura de conversão, o plano de mídia e as palavras-chave que vão mover o ponteiro — não só gerar tráfego." },
  { title: "Execução", icon: Rocket, desc: "Seu site entra em órbita em 3 a 5 dias, e campanhas e SEO começam em seguida. Sem enrolação, sem meses esperando aprovação." },
  { title: "Otimização", icon: BarChart3, desc: "Medimos tudo, ajustamos o que não performa e escalamos o que funciona. Todo mês você recebe um relatório claro, sem jargão." },
];

export function Process({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".process-line-fill", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".process-list", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "is-active",
        });
        gsap.from(step, { x: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: step, start: "top 88%", once: true } });
      });
    });
  }, { scope: ref });

  return (
    <section id="processo" ref={ref} className={`py-24 md:py-36 px-5 md:px-10 ${t.bg} relative`}>
      <style>{`
        #processo .process-step .p-num { color: transparent; -webkit-text-stroke: 1.5px ${isDark ? "rgba(255,250,250,0.25)" : "rgba(13,1,1,0.2)"}; transition: all .5s; }
        #processo .process-step.is-active .p-num { color: #ff5d00; -webkit-text-stroke: 1.5px #ff5d00; }
        #processo .process-step .p-card { transition: all .5s; }
        #processo .process-step.is-active .p-card { border-color: rgba(255,93,0,.5); box-shadow: 0 20px 60px -20px rgba(255,93,0,.35); }
        #processo .process-step .p-dot { transition: all .4s; }
        #processo .process-step.is-active .p-dot { background: #ff5d00; transform: scale(1.4); box-shadow: 0 0 0 6px rgba(255,93,0,.18); }
        #processo .process-step .p-icon { transition: all .5s; }
        #processo .process-step.is-active .p-icon { background: #ff5d00; color: #0d0101; transform: rotate(-8deg); }
      `}</style>
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24">
        <div className="lg:sticky lg:top-32 self-start">
          <span className={`fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${t.fgFaint}`}>
            <span className="w-8 h-px bg-[#ff5d00]" /> Processo
          </span>
          <h2 className="split-reveal mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.8rem, 4.8vw, 5.8rem)", perspective: 600 }}>
            <span className={t.fg}>Como </span>
            <span className="text-[#ff5d00] italic pr-2">trabalhamos.</span>
          </h2>
          <p className={`fade-up mt-6 text-lg font-medium max-w-sm ${t.fgMuted}`}>
            Quatro etapas claras, do primeiro papo ao relatório mensal. Você sabe exatamente o que está acontecendo — e por quê.
          </p>
          <div className={`fade-up mt-10 inline-flex items-center gap-4 rounded-3xl px-6 py-5 ${t.card}`}>
            <span className="font-black text-5xl text-[#ff5d00] leading-none">30</span>
            <span className={`text-sm font-bold uppercase tracking-wider leading-tight ${t.fgMuted}`}>dias para<br />entrar em órbita</span>
          </div>
        </div>

        <div className="process-list relative pl-10 md:pl-14">
          <div className={`absolute left-[11px] md:left-[19px] top-2 bottom-2 w-[2px] ${t.hairline}`}>
            <div className="process-line-fill absolute inset-0 bg-[#ff5d00] origin-top" />
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="process-step relative">
                  <span className={`p-dot absolute -left-10 md:-left-14 top-10 ml-[5px] md:ml-[13px] w-3.5 h-3.5 rounded-full ${isDark ? "bg-[#3a2a26]" : "bg-[#e3dcda]"}`} />
                  <div className={`p-card rounded-[32px] p-8 md:p-10 ${t.card} border`}>
                    <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                      <div>
                        <h3 className={`font-black text-2xl md:text-3xl uppercase tracking-wide mb-3 ${t.fg}`}>{s.title}</h3>
                        <p className={`text-base md:text-lg leading-relaxed ${t.fgMuted}`}>{s.desc}</p>
                      </div>
                      <span className="p-num font-black leading-none shrink-0" style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}>0{i + 1}</span>
                    </div>
                    <span className={`p-icon mt-6 w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/[0.06] text-[#ff5d00]" : "bg-[#ff5d00]/10 text-[#ff5d00]"}`}>
                      <Icon size={22} strokeWidth={2.2} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
