import { useRef } from "react";
import { Quote } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, revealIn } from "@/lib/motion";
import { tokens } from "./tokens";

const ITEMS = [
  {
    quote: "Em três meses nossas vendas online mais que dobraram. A Orbara entendeu o nosso mercado, criou campanhas certeiras e posicionou a Voltari como referência em mobilidade elétrica.",
    name: "Equipe Voltari",
    role: "Diretoria Comercial · Voltari",
    result: "+138% em vendas",
  },
  {
    quote: "Conseguiram construir autoridade para o meu escritório dentro das regras da OAB. Mais clientes, mais casos relevantes, sem abrir mão da ética.",
    name: "Dra. Camila Nogueira",
    role: "Advogada · Nogueira Advocacia",
    result: "+91% novos clientes",
  },
  {
    quote: "Nossa ocupação subiu 68% em dois meses. A equipe da Orbara entendeu o negócio de verdade e entregou resultado concreto.",
    name: "Marcos Teixeira",
    role: "Diretor de Operações · Estacionamento Central Park",
    result: "+68% de ocupação",
  },
];

function Card({ item, isDark }: { item: (typeof ITEMS)[number]; isDark: boolean }) {
  const t = tokens(isDark);
  const initials = item.name.replace("Dra. ", "").split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <figure className={`t-card group relative w-[340px] md:w-[440px] shrink-0 rounded-[32px] p-8 md:p-10 flex flex-col gap-6 ${t.card} hover:border-[#ff5d00]/50 transition-colors duration-500`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-1" aria-label="5 estrelas">
          {Array.from({ length: 5 }).map((_, s) => (
            <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="#ff5d00" aria-hidden>
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
            </svg>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#ff5d00]/12 text-[#ff5d00]">{item.result}</span>
      </div>
      <Quote size={36} className="text-[#ff5d00] opacity-30 group-hover:opacity-100 group-hover:-rotate-12 transition-all duration-500" />
      <blockquote className={`text-lg leading-relaxed font-medium flex-1 ${t.fg}`}>{item.quote}</blockquote>
      <figcaption className={`flex items-center gap-3 pt-5 border-t ${t.border}`}>
        <span className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shrink-0 bg-[#ff5d00] text-[#0d0101]">{initials}</span>
        <span>
          <span className={`block font-bold text-sm leading-tight ${t.fg}`}>{item.name}</span>
          <span className={`block text-xs leading-tight mt-0.5 ${t.fgMuted}`}>{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const row = ref.current!.querySelector<HTMLElement>(".t-row")!;
      const loop = gsap.to(row, { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
      row.addEventListener("pointerenter", () => gsap.to(loop, { timeScale: 0.15, duration: 0.6 }));
      row.addEventListener("pointerleave", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 300);
          gsap.to(loop, { timeScale: 1 + Math.abs(v), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.25 });
        },
      });
      gsap.from(".t-row", { x: 200, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".t-row", start: "top 90%", once: true } });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className={`py-24 md:py-32 ${t.bg} overflow-hidden`}>
      <div className="container mx-auto max-w-7xl px-5 md:px-10 mb-14 md:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <span className={`fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${t.fgFaint}`}>
            <span className="w-8 h-px bg-[#ff5d00]" /> O que dizem nossos clientes
          </span>
          <h2 className="split-reveal mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.4rem, 6vw, 7rem)", perspective: 600 }}>
            <span className={t.fg}>Quem viveu, </span>
            <span className="text-[#ff5d00] italic pr-2">aprova.</span>
          </h2>
        </div>
        <p className={`fade-up text-lg font-medium max-w-sm ${t.fgMuted}`}>
          Resultados reais, contados por quem viveu cada etapa com a gente.
        </p>
      </div>

      <div className="relative">
        <div className={`absolute inset-y-0 left-0 w-16 md:w-40 z-10 pointer-events-none bg-gradient-to-r ${isDark ? "from-[#0d0101]" : "from-white"} to-transparent`} />
        <div className={`absolute inset-y-0 right-0 w-16 md:w-40 z-10 pointer-events-none bg-gradient-to-l ${isDark ? "from-[#0d0101]" : "from-white"} to-transparent`} />
        <div className="t-row flex w-max gap-6 px-3">
          {[0, 1, 2, 3].map((dup) => ITEMS.map((item) => <Card key={`${dup}-${item.name}`} item={item} isDark={isDark} />))}
        </div>
      </div>
    </section>
  );
}
