import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Check, CreditCard, Crown, Rocket, Sparkles, Orbit, MessageCircle } from "lucide-react";
import { useTilt, Magnetic } from "@/components/motion-fx";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const MAX_INSTALLMENTS = 6;

const brl = (v: number, cents = false) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

type Plan = {
  id: string;
  name: string;
  icon: typeof Rocket;
  tagline: string;
  price?: number;
  oldPrice?: number;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    icon: Rocket,
    tagline: "Presença digital de alta performance para negócios locais.",
    price: 1490,
    features: [
      "Landing Page Otimizada",
      "Copywriting de Conversão",
      "SEO Técnico Básico",
      "Setup de Google Analytics",
      "Entrega em até 3 dias",
    ],
    cta: "Selecionar",
  },
  {
    id: "aceleracao",
    name: "Aceleração",
    icon: Crown,
    tagline: "Ecossistema digital completo projetado para conversão em escala e captação de clientes.",
    price: 2995,
    oldPrice: 5990,
    features: [
      "Ecossistema Web de Alta Conversão",
      "Copywriting Persuasivo focado em Fechamento",
      "SEO Técnico & On-Page para Primeiras Posições",
      "Setup Estratégico de Google Ads & Tag Manager",
      "Integração Direta com WhatsApp, CRM e Formulários",
      "Otimização Extrema de Performance (Core Web Vitals)",
      "Entrega Completa em até 5 dias",
    ],
    cta: "Começar Agora",
    featured: true,
  },
  {
    id: "orbita",
    name: "Órbita",
    icon: Orbit,
    tagline: "Projeto sob medida para e-commerce e plataformas.",
    features: [
      "Arquitetura Headless / Full Custom",
      "Plataforma Web, E-commerce ou SaaS",
      "SEO Técnico Avançado e GEO (AI Search)",
      "Integração de APIs, CRMs e Meios de Pagamento",
      "Design System e Identidade Visual Exclusiva",
      "Infraestrutura Cloud de Alta Disponibilidade",
      "Acompanhamento Estratégico de Growth Contínuo",
    ],
    cta: "Falar com Especialista",
  },
];

const scrollToContact = () => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });

function InstallmentTag({ price, featured, isDark }: { price?: number; featured?: boolean; isDark: boolean }) {
  const tone = featured
    ? "bg-[#0d0101] text-[#fffafa]"
    : isDark
      ? "bg-[#ff5d00]/12 text-[#ffaa60] border border-[#ff5d00]/30"
      : "bg-[#ff5d00]/10 text-[#c94800] border border-[#ff5d00]/25";
  return (
    <div className={`plan-installment mt-3 inline-flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 text-xs md:text-[13px] font-bold ${tone}`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${featured ? "bg-[#ff5d00] text-[#0d0101]" : "bg-[#ff5d00] text-[#0d0101]"}`}>
        <CreditCard size={13} strokeWidth={2.5} />
      </span>
      {price ? (
        <span>
          em até <strong className="font-black">{MAX_INSTALLMENTS}x</strong> de{" "}
          <strong className="font-black">{brl(price / MAX_INSTALLMENTS, true)}</strong>
        </span>
      ) : (
        <span>
          parcelamento em até <strong className="font-black">{MAX_INSTALLMENTS}x</strong>
        </span>
      )}
    </div>
  );
}

function PlanCard({ plan, isDark }: { plan: Plan; isDark: boolean }) {
  const tiltRef = useTilt<HTMLDivElement>(plan.featured ? 5 : 8);
  const Icon = plan.icon;
  const f = plan.featured;

  const fg = f ? "text-[#0d0101]" : isDark ? "text-[#fffafa]" : "text-[#0d0101]";
  const muted = f ? "text-[#0d0101]/80" : isDark ? "text-[#fffafa]/60" : "text-[#0d0101]/60";
  const surface = f
    ? "bg-[#ff5d00]"
    : isDark
      ? "bg-[#1a0f0c] border border-white/10"
      : "bg-white border border-black/[0.08]";

  return (
    <div className={`plan-wrap relative h-full ${f ? "md:-translate-y-6 z-10" : ""}`}>
      {f && (
        <div className="absolute -inset-[2px] rounded-[34px] overflow-hidden pointer-events-none">
          <div className="plan-border-spin absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,#0d0101_70deg,transparent_140deg,transparent_220deg,#ffd1b0_300deg,transparent_360deg)]" />
        </div>
      )}
      <div
        ref={tiltRef}
        className={`plan-card group relative h-full rounded-[32px] overflow-hidden flex flex-col p-8 md:p-10 ${surface} ${f ? "shadow-2xl shadow-[#ff5d00]/30" : "shadow-[0_4px_32px_rgba(0,0,0,0.06)]"}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={`plan-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${f ? "plan-spotlight--light" : ""}`} />

        {f && (
          <>
            <div className="plan-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            <div className="plan-orbit pointer-events-none absolute -right-20 -bottom-20 w-64 h-64 rounded-full border-2 border-dashed border-[#0d0101]/15">
              <span className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-[#0d0101]" />
            </div>
          </>
        )}

        {f && (
          <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 bg-[#0d0101] text-[#ff5d00] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#ff5d00] animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-[#ff5d00]" />
            </span>
            Recomendado
          </div>
        )}

        {/* Cabeçalho */}
        <div className="relative">
          <div
            className={`plan-icon w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
              f ? "bg-[#0d0101] text-[#ff5d00]" : "bg-[#ff5d00] text-[#0d0101]"
            }`}
          >
            <Icon size={22} strokeWidth={2.4} />
          </div>
          <h3 className={`text-2xl md:text-3xl font-black mb-2 ${fg}`}>{plan.name}</h3>
          <p className={`text-sm leading-relaxed min-h-[2.5rem] ${f ? "font-semibold" : "font-medium"} ${muted}`}>{plan.tagline}</p>
        </div>

        {/* Preço */}
        <div className={`relative mt-6 mb-8 pb-7 border-b ${f ? "border-[#0d0101]/15" : isDark ? "border-white/10" : "border-black/[0.08]"}`}>
          {plan.oldPrice && (
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="relative text-sm font-bold text-[#0d0101]/60">
                De {brl(plan.oldPrice)}
                <span className="plan-strike absolute left-0 right-0 top-1/2 h-[2px] bg-[#0d0101]/70 origin-left" />
              </span>
              <span className="plan-off inline-block bg-[#0d0101] text-[#ff5d00] text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {Math.round((1 - plan.price! / plan.oldPrice) * 100)}% OFF
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5">
            {plan.oldPrice && <span className="text-xs font-black uppercase tracking-widest text-[#0d0101]/70">Por</span>}
            {plan.price ? (
              <span className={`font-black tracking-tight tabular-nums ${fg} ${f ? "text-4xl lg:text-5xl" : "text-4xl"}`}>
                R$ <span className="plan-price" data-value={plan.price}>{plan.price.toLocaleString("pt-BR")}</span>
              </span>
            ) : (
              <span className={`text-4xl font-black tracking-tight ${fg}`}>Customizado</span>
            )}
          </div>
          <InstallmentTag price={plan.price} featured={f} isDark={isDark} />
        </div>

        {/* Benefícios */}
        <ul className="relative flex flex-col gap-3.5 mb-10 flex-1">
          {plan.features.map((item) => (
            <li key={item} className={`plan-feature flex items-start gap-3 text-sm ${f ? "font-semibold" : "font-medium"} ${muted}`}>
              <span
                className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                  f ? "bg-[#0d0101] text-[#ff5d00]" : "bg-[#ff5d00]/15 text-[#ff5d00]"
                }`}
              >
                <Check size={12} strokeWidth={3.5} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Magnetic className="relative w-full">
          <button
            onClick={scrollToContact}
            className={`group/btn w-full py-4 rounded-full font-black text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors duration-300 ${
              f
                ? "bg-[#0d0101] text-[#ff5d00] hover:bg-black shadow-xl"
                : isDark
                  ? "border border-white/20 text-[#fffafa] hover:bg-[#ff5d00] hover:border-[#ff5d00] hover:text-[#0d0101]"
                  : "border border-black/20 text-[#0d0101] hover:bg-[#ff5d00] hover:border-[#ff5d00]"
            }`}
          >
            {plan.cta}
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/btn:rotate-45" />
          </button>
        </Magnetic>
      </div>
    </div>
  );
}

export function PlansShowcase({ isDark }: { isDark: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const fg = isDark ? "text-[#fffafa]" : "text-[#0d0101]";
  const fgMuted = isDark ? "text-[#fffafa]/55" : "text-[#0d0101]/55";
  const altBg = isDark ? "bg-[#130808]" : "bg-[#f7f5f5]";

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      SplitText.create(".plans-title", {
        type: "chars,words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            rotationX: -90,
            opacity: 0,
            transformOrigin: "50% 100%",
            stagger: 0.025,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".plans-title", start: "top 85%", once: true },
          }),
      });

      gsap.from(".plans-eyebrow, .plans-sub", {
        y: 20, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".plans-title", start: "top 85%", once: true },
      });

      // Entrada dos cards em leque
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".plans-grid", start: "top 80%", once: true } });
      tl.from(".plan-wrap", {
        y: 120,
        opacity: 0,
        rotationX: 25,
        rotationZ: (i) => (i - 1) * 4,
        transformPerspective: 1200,
        transformOrigin: "50% 100%",
        stagger: 0.12,
        duration: 1.1,
        ease: "expo.out",
        clearProps: "rotationX,rotationZ,transformPerspective",
      })
        .from(".plan-icon", { scale: 0, rotation: -120, stagger: 0.12, duration: 0.8, ease: "back.out(2.5)" }, 0.35)
        .from(".plan-feature", { x: -16, opacity: 0, stagger: 0.035, duration: 0.5, ease: "power3.out" }, 0.5)
        .from(".plan-installment", { y: 12, opacity: 0, scale: 0.85, stagger: 0.12, duration: 0.6, ease: "back.out(2)" }, 0.7)
        .from(".plan-strike", { scaleX: 0, duration: 0.6, ease: "power3.inOut" }, 0.8)
        .from(".plan-off", { scale: 0, rotation: -25, duration: 0.7, ease: "elastic.out(1, 0.45)" }, 1.1);

      // Preços contando
      gsap.utils.toArray<HTMLElement>(".plan-price").forEach((el) => {
        const obj = { v: 0 };
        const target = Number(el.dataset.value);
        tl.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString("pt-BR"); },
        }, 0.4);
      });

      // Loops decorativos
      gsap.to(".plan-border-spin", { rotation: 360, duration: 5, ease: "none", repeat: -1 });
      gsap.to(".plan-orbit", { rotation: 360, duration: 18, ease: "none", repeat: -1 });
      gsap.fromTo(".plan-shine", { xPercent: 0 }, { xPercent: 600, duration: 1.4, ease: "power2.inOut", repeat: -1, repeatDelay: 3.5, delay: 2 });
      gsap.to(".plans-glow", { scale: 1.15, opacity: 0.8, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
  }, { scope: sectionRef });

  return (
    <section id="planos" ref={sectionRef} className={`relative py-24 md:py-36 px-5 md:px-10 ${altBg} overflow-hidden`}>
      <style>{`
        #planos .plan-spotlight { background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,93,0,0.14), transparent 45%); }
        #planos .plan-spotlight--light { background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.28), transparent 45%); }
      `}</style>

      {/* Fundo: brilho e grade */}
      <div className="plans-glow absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,93,0,0.16)_0%,transparent_65%)] blur-2xl opacity-60 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.035)" : "rgba(13,1,1,0.04)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.035)" : "rgba(13,1,1,0.04)"} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative container mx-auto max-w-6xl">
        <div className="text-center mb-16 md:mb-24">
          <span className={`plans-eyebrow inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] ${fgMuted}`}>
            <Sparkles size={13} className="text-[#ff5d00]" /> Investimento
          </span>
          <h2 className="plans-title mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.2rem, 5.5vw, 6rem)", perspective: 600 }}>
            <span className={fg}>Planos que geram</span>
            <br />
            <span className="text-[#ff5d00] italic pr-2">resultados reais.</span>
          </h2>
          <p className={`plans-sub mt-6 text-base md:text-lg font-medium max-w-xl mx-auto ${fgMuted}`}>
            Escolha o ponto de partida ideal para o seu momento e parcele em até {MAX_INSTALLMENTS}x.
          </p>
        </div>

        <div className="plans-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} isDark={isDark} />
          ))}
        </div>

        <div className="mt-14 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <span className={`text-sm font-medium ${fgMuted}`}>Em dúvida sobre qual plano escolher?</span>
          <a
            href="https://wa.me/5511981680809"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#ff5d00] hover:underline underline-offset-4"
          >
            <MessageCircle size={16} /> Fale com a gente no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
