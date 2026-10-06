import { useRef } from "react";
import { ArrowUpRight, Briefcase, Building2, UserRound, MapPin, LineChart } from "lucide-react";
import { gsap, useGSAP, revealIn } from "@/lib/motion";
import { OrbitDecoration } from "@/components/OrbitDecoration";
import { tokens } from "./tokens";

const AUDIENCE = [
  { icon: Briefcase, text: "Prestadores de serviço especializado: advogados, contadores, consultores, médicos, arquitetos" },
  { icon: Building2, text: "Empresas B2B com soluções de ticket médio ou alto" },
  { icon: UserRound, text: "Profissionais liberais que querem parar de depender só de indicação" },
  { icon: MapPin, text: "Pequenas e médias empresas disputando busca local no Google" },
  { icon: LineChart, text: "Negócios com histórico de resultado, mas presença digital abaixo do potencial" },
];

export function Audience({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".aud-row", {
        y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ".aud-list", start: "top 82%", once: true },
      });
    });
  }, { scope: ref });

  return (
    <section id="para-quem" ref={ref} className={`py-24 md:py-36 px-5 md:px-10 ${t.altBg}`}>
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-14 lg:gap-24">
        <div className="lg:sticky lg:top-32 self-start">
          <span className={`fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${t.fgFaint}`}>
            <span className="w-8 h-px bg-[#ff5d00]" /> Para quem é
          </span>
          <h2 className="split-reveal mt-3 font-black leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 6rem)", perspective: 600 }}>
            <span className={t.fg}>Feito para quem presta serviço </span>
            <span className="text-[#ff5d00] italic pr-2">de verdade.</span>
          </h2>
          <p className={`fade-up mt-6 text-lg leading-relaxed max-w-sm ${t.fgMuted}`}>
            Não trabalhamos com todo mundo. Trabalhamos bem com quem já tem algo que funciona e precisa que mais pessoas encontrem.
          </p>
        </div>

        <ul className="aud-list flex flex-col gap-3">
          {AUDIENCE.map(({ icon: Icon, text }, i) => (
            <li
              key={text}
              className={`aud-row group relative overflow-hidden rounded-[28px] p-6 md:p-7 flex items-center gap-5 ${t.card} cursor-default`}
            >
              <span className="absolute inset-0 bg-[#ff5d00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]" />
              <span className={`relative text-xs font-black tabular-nums ${t.fgFaint} group-hover:text-[#0d0101]/60 transition-colors`}>0{i + 1}</span>
              <span className="relative w-12 h-12 shrink-0 rounded-2xl bg-[#ff5d00]/12 text-[#ff5d00] group-hover:bg-[#0d0101] flex items-center justify-center transition-colors duration-500">
                <Icon size={21} strokeWidth={2.2} />
              </span>
              <span className={`relative flex-1 text-base md:text-lg font-semibold leading-snug ${t.fg} group-hover:text-[#0d0101] transition-colors duration-300`}>{text}</span>
              <ArrowUpRight size={20} className={`relative shrink-0 ${t.fgFaint} group-hover:text-[#0d0101] group-hover:rotate-45 transition-all duration-500`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STATS = [
  { prefix: "+", num: 180, suffix: "%", label: "leads qualificados em 90 dias", note: "média dos últimos 12 clientes" },
  { prefix: "-", num: 40, suffix: "%", label: "custo por aquisição", note: "em 6 meses de otimização contínua" },
  { prefix: "Top ", num: 3, suffix: "", label: "no Google", note: "em palavras-chave de alta intenção de compra" },
];

export function Stats({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".stats-card", { clipPath: "inset(12% 6% 12% 6% round 56px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 56px)",
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 35%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number(el.dataset.value),
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        });
      });
      gsap.from(".stat-item", {
        y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".stats-card", start: "top 75%", once: true },
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className={`py-6 md:py-10 ${t.bg}`}>
      <div className="stats-card bg-[#ff5d00] rounded-[40px] md:rounded-[56px] mx-3 md:mx-8 py-16 md:py-24 px-7 md:px-16 relative overflow-hidden">
        <OrbitDecoration size={300} opacity={0.09} speed={30} color="#0d0101" className="absolute -right-6 -top-2 hidden lg:block" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="font-black tracking-[0.35em] text-xs text-[#0d0101]/60 uppercase">Resultados</span>
            <span className="h-px flex-1 bg-[#0d0101]/15" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-[#0d0101]/15 gap-12 md:gap-0">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item md:px-8 first:md:pl-0 last:md:pr-0">
                <div className="font-black text-[#0d0101] leading-none tracking-tight whitespace-nowrap" style={{ fontSize: "clamp(3.2rem, 6.5vw, 6.5rem)" }}>
                  {s.prefix}<span className="stat-num tabular-nums" data-value={s.num}>{s.num}</span>{s.suffix}
                </div>
                <div className="mt-4 font-black text-[#0d0101] text-lg md:text-xl">{s.label}</div>
                <div className="font-semibold text-[#0d0101]/65 text-sm md:text-base mt-1">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
