import { useRef, useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, revealIn } from "@/lib/motion";
import { tokens, whatsappUrl } from "./tokens";

const FAQS = [
  {
    q: "Quanto tempo leva para o site ficar no ar?",
    a: "De 3 a 5 dias a partir da aprovação do briefing: o plano Essencial fica pronto em até 3 dias e o Aceleração, em até 5. O processo inclui briefing, estrutura, design, desenvolvimento e testes. E-commerce e plataformas sob medida têm o prazo definido na proposta.",
  },
  {
    q: "Quando começo a ver resultado no Google Ads?",
    a: "As primeiras semanas servem para calibrar o algoritmo e coletar dados reais do mercado. A partir do segundo mês, a campanha já está otimizada. Resultados consistentes e previsíveis acontecem entre o 60º e o 90º dia.",
  },
  {
    q: "SEO demora mesmo? Vale o investimento?",
    a: "Os primeiros resultados aparecem em 3 a 4 meses. Resultados sólidos e competitivos chegam entre 6 e 12 meses. E a partir daí? O tráfego é seu — sem custo por clique. O ROI do SEO é exponencial com o tempo, diferente dos anúncios que param quando o orçamento acaba.",
  },
  {
    q: "Já tenho um site. Vocês refazem ou otimizam?",
    a: "Depende do diagnóstico técnico e de conversão que fazemos gratuitamente. Em muitos casos, reconstruir do zero é mais rápido e eficiente. Em outros, uma otimização cirúrgica resolve. Apresentamos as duas opções com custo e projeção.",
  },
  {
    q: "Como funciona o Google Ads? A verba é separada?",
    a: "Sim. Você investe diretamente no Google (a verba de mídia) e nos paga pela gestão estratégica das campanhas. Trabalhamos com verbas a partir de R$1.500/mês em mídia. O mínimo garante volume de dados suficiente para otimização real.",
  },
  {
    q: "Vocês trabalham com contrato de fidelidade?",
    a: "Não. Após o projeto inicial (site, setup de campanhas ou plano de SEO), o acompanhamento é mês a mês. Acreditamos que resultado é o único contrato que importa. Se não estivermos entregando, você tem toda a liberdade de encerrar.",
  },
];

function FaqItem({ q, a, open, onToggle, isDark, index }: { q: string; a: string; open: boolean; onToggle: () => void; isDark: boolean; index: number }) {
  const body = useRef<HTMLDivElement>(null);
  const icon = useRef<HTMLSpanElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    gsap.to(body.current, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.6,
      ease: "expo.inOut",
      onComplete: () => ScrollTrigger.refresh(),
    });
    gsap.to(icon.current, { rotation: open ? 135 : 0, duration: 0.5, ease: "back.out(2)" });
  }, { dependencies: [open] });

  return (
    <div className={`faq-item rounded-[28px] overflow-hidden transition-colors duration-500 ${open ? "bg-[#ff5d00]" : t.card}`}>
      <button onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-5 text-left px-6 md:px-8 py-6">
        <span className={`text-xs font-black tabular-nums transition-colors ${open ? "text-[#0d0101]/60" : "text-[#ff5d00]"}`}>0{index + 1}</span>
        <span className={`flex-1 font-bold text-lg md:text-xl transition-colors ${open ? "text-[#0d0101]" : t.fg}`}>{q}</span>
        <span
          ref={icon}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${open ? "bg-[#0d0101] text-[#ff5d00]" : "bg-[#ff5d00] text-[#0d0101]"}`}
        >
          <Plus size={18} strokeWidth={2.6} />
        </span>
      </button>
      <div ref={body} className="h-0 opacity-0 overflow-hidden">
        <p className="px-6 md:px-8 pb-7 md:pl-[4.6rem] text-base md:text-lg leading-relaxed font-medium text-[#0d0101]/80">{a}</p>
      </div>
    </div>
  );
}

export function Faq({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".faq-item", {
        y: 40, opacity: 0, stagger: 0.07, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ".faq-list", start: "top 85%", once: true },
      });
    });
  }, { scope: ref });

  return (
    <section id="faq" ref={ref} className={`py-24 md:py-36 px-5 md:px-10 ${t.altBg}`}>
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <span className={`fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${t.fgFaint}`}>
            <span className="w-8 h-px bg-[#ff5d00]" /> Dúvidas
          </span>
          <h2 className="split-reveal mt-3 font-black leading-[0.92] tracking-tight" style={{ fontSize: "clamp(2.4rem, 5.5vw, 6rem)", perspective: 600 }}>
            <span className={t.fg}>Tudo o que </span>
            <span className="text-[#ff5d00] italic pr-2">você quer saber.</span>
          </h2>
          <div className={`fade-up mt-10 rounded-[28px] p-7 ${isDark ? "bg-[#ff5d00]/10 border border-[#ff5d00]/25" : "bg-[#0d0101] text-[#fffafa]"}`}>
            <p className={`font-black text-xl mb-2 ${isDark ? "text-[#fffafa]" : ""}`}>Ainda ficou alguma dúvida?</p>
            <p className={`text-sm mb-5 ${isDark ? "text-[#fffafa]/60" : "text-[#fffafa]/65"}`}>Fale direto com a gente — respondemos rapidinho.</p>
            <a href={whatsappUrl("faq")} data-wa-source="faq" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ff5d00] text-[#0d0101] font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-[#ff7020] transition-colors">
              <MessageCircle size={17} /> Chamar no WhatsApp
            </a>
          </div>
        </div>
        <div className="faq-list flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} isDark={isDark} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
