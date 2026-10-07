import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, ChevronDown, MessageCircle, Search } from "lucide-react";
import { useTheme } from "@/context/theme";
import { startSmoothScroll, scrollToId, useGSAP, revealIn } from "@/lib/motion";
import { OrbaraLogo, WhatsAppFab } from "@/components/site/Chrome";
import { Contact, Footer } from "@/components/site/Closing";
import { tokens, whatsappUrl } from "@/components/site/tokens";
import { PLANS } from "@/components/PlansShowcase";
import { MotionShowcase } from "@/components/MotionShowcase";
import { CASE_SEO } from "@/seo/routes";
import { SERVICE_PAGES, servicePage, type ServiceSlug } from "@/content/servicePages";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: n % 1 ? 2 : 0 });

/** Cabeçalho das páginas de serviço: logo, os outros serviços e o atalho para o orçamento. */
function ServiceHeader({ current }: { current: ServiceSlug }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 md:px-6 pt-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[#0d0101]/80 backdrop-blur-xl px-4 md:px-6 py-2.5 shadow-2xl shadow-black/40">
        <Link href="/" className="flex items-center gap-2 text-[#fffafa]" aria-label="Orbara — página inicial">
          <OrbaraLogo stroke="#fffafa" size={26} />
          <span className="font-black tracking-widest text-lg">ORBARA</span>
        </Link>
        <nav aria-label="Serviços" className="hidden lg:flex items-center gap-1">
          {SERVICE_PAGES.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                s.slug === current ? "text-[#ff5d00]" : "text-[#fffafa]/80 hover:text-[#ff5d00]"
              }`}
            >
              {s.name}
            </Link>
          ))}
          <a href="/#planos" className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#fffafa]/80 hover:text-[#ff5d00]">
            Planos
          </a>
        </nav>
        <button
          onClick={() => scrollToId("contato")}
          className="inline-flex items-center gap-2 rounded-full bg-[#ff5d00] text-[#0d0101] font-black text-xs uppercase tracking-wider pl-5 pr-2 py-2"
        >
          Pedir orçamento
          <span className="w-8 h-8 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center">
            <ArrowUpRight size={15} />
          </span>
        </button>
      </div>
    </header>
  );
}

export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  const page = servicePage(slug)!;
  const ref = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const t = tokens(isDark);

  useEffect(() => startSmoothScroll(), []);
  useEffect(() => window.scrollTo(0, 0), [slug]);
  useGSAP(() => { revealIn(ref.current); }, { scope: ref, dependencies: [slug] });

  const cases = (page.proof.cases ?? []).map((s) => CASE_SEO.find((c) => c.slug === s)).filter(Boolean) as typeof CASE_SEO;
  const others = SERVICE_PAGES.filter((s) => s.slug !== slug);

  return (
    <div ref={ref} className={`${t.bg} min-h-screen font-sans overflow-x-clip selection:bg-[#ff5d00] selection:text-[#0d0101]`}>
      <WhatsAppFab />
      <ServiceHeader current={slug} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0d0101] text-[#fffafa] pt-36 md:pt-44 pb-20 md:pb-28 px-5 md:px-10">
        <div className="absolute -top-40 right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,93,0,0.28),transparent_65%)] pointer-events-none" />
        <svg className="absolute right-[-12%] top-24 w-[720px] opacity-30 pointer-events-none hidden md:block" viewBox="0 0 600 600" aria-hidden>
          <ellipse cx="300" cy="300" rx="280" ry="110" fill="none" stroke="#ff5d00" strokeOpacity="0.5" transform="rotate(-18 300 300)" />
          <ellipse cx="300" cy="300" rx="190" ry="72" fill="none" stroke="#ffaa60" strokeOpacity="0.4" strokeDasharray="5 9" transform="rotate(-18 300 300)" />
          <circle cx="560" cy="215" r="7" fill="#ff5d00" />
        </svg>
        <div className="container mx-auto max-w-6xl relative">
          <nav aria-label="Você está em" className="fade-up text-xs font-semibold text-[#fffafa]/50 mb-6">
            <Link href="/" className="hover:text-[#ff5d00]">Início</Link>
            <span className="mx-2">/</span>
            <span>Serviços</span>
            <span className="mx-2">/</span>
            <span className="text-[#fffafa]/80">{page.name}</span>
          </nav>
          <span className="fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#ff5d00]">
            <span className="w-8 h-px bg-[#ff5d00]" /> {page.kicker}
          </span>
          <h1 className="fade-up mt-4 font-black tracking-tight leading-[0.95] max-w-4xl" style={{ fontSize: "clamp(2.6rem, 6.4vw, 5.6rem)" }}>
            {page.h1} <span className="text-[#ff5d00] italic">{page.h1Accent}</span>
          </h1>
          <p className="fade-up mt-6 text-lg md:text-xl text-[#fffafa]/70 max-w-2xl leading-relaxed">{page.sub}</p>
          <div className="fade-up mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              onClick={() => scrollToId("contato")}
              className="group inline-flex items-center justify-between gap-3 bg-[#ff5d00] text-[#0d0101] font-black text-sm uppercase tracking-wide pl-7 pr-2.5 py-2.5 rounded-full shadow-lg shadow-[#ff5d00]/30"
            >
              Pedir orçamento
              <span className="w-10 h-10 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={17} />
              </span>
            </button>
            <a
              href={whatsappUrl(page.waSource)}
              data-wa-source={`servico-${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-wide hover:border-[#25d366] hover:text-[#25d366] transition-colors"
            >
              <MessageCircle size={17} /> Falar no WhatsApp
            </a>
          </div>
          <ul className="stagger-up mt-10 flex flex-wrap gap-2.5">
            {page.chips.map((c) => (
              <li key={c} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[#fffafa]/75">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d00]" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* O que está incluso */}
      <section className={`py-20 md:py-28 px-5 md:px-10 ${t.bg}`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className={`split-reveal font-black tracking-tight leading-[1] mb-12 ${t.fg}`} style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
            O que está <span className="text-[#ff5d00] italic">incluso</span>
          </h2>
          <ul className="stagger-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.included.map((it) => (
              <li key={it.title} className={`rounded-3xl p-7 ${t.card}`}>
                <span className="w-10 h-10 rounded-2xl bg-[#ff5d00] text-[#0d0101] flex items-center justify-center mb-5">
                  <Check size={20} strokeWidth={3} />
                </span>
                <h3 className={`font-black text-xl mb-2 ${t.fg}`}>{it.title}</h3>
                <p className={`text-base leading-relaxed ${t.fgMuted}`}>{it.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section className={`py-20 md:py-28 px-5 md:px-10 ${t.altBg}`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className={`split-reveal font-black tracking-tight leading-[1] mb-12 ${t.fg}`} style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
            Como <span className="text-[#ff5d00] italic">funciona</span>
          </h2>
          <ol className="stagger-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {page.steps.map((s, i) => (
              <li key={s.title} className={`relative rounded-3xl p-7 overflow-hidden ${t.card}`}>
                <span className="block font-black text-[#ff5d00] text-sm tabular-nums mb-6">0{i + 1} / 0{page.steps.length}</span>
                <h3 className={`font-black text-xl mb-2 ${t.fg}`}>{s.title}</h3>
                <p className={`text-base leading-relaxed ${t.fgMuted}`}>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Prova: cases */}
      {(cases.length > 0 || page.proof.motion) && (
        <section className={`py-20 md:py-28 px-5 md:px-10 ${t.bg}`}>
          <div className="container mx-auto max-w-6xl">
            <h2 className={`split-reveal font-black tracking-tight leading-[1] mb-12 ${t.fg}`} style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
              {page.proof.motion ? (
                <>Cases em <span className="text-[#ff5d00] italic">vídeo</span></>
              ) : (
                <>Quem já <span className="text-[#ff5d00] italic">trabalhou com a gente</span></>
              )}
            </h2>
            {page.proof.motion ? (
              <div className="flex flex-col gap-8">
                <MotionShowcase caseId="orbara" />
                <MotionShowcase caseId="clube-do-med" />
              </div>
            ) : (
              <ul className="stagger-up grid grid-cols-1 md:grid-cols-3 gap-4">
                {cases.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/cases/${c.slug}`} className={`group block h-full rounded-3xl p-7 transition-colors hover:border-[#ff5d00] ${t.card}`}>
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#ff5d00]">Case</span>
                      <p className="mt-4 font-black leading-none tracking-tight text-[#ff5d00]" style={{ fontSize: "clamp(2.6rem, 5vw, 3.6rem)" }}>
                        +{c.result.value}%
                      </p>
                      <p className={`mt-2 text-sm font-bold ${t.fg}`}>
                        {c.result.label} <span className={t.fgMuted}>{c.result.period}</span>
                      </p>
                      <h3 className={`mt-5 font-black text-xl ${t.fg}`}>{c.client}</h3>
                      <p className={`mt-2 text-base leading-relaxed ${t.fgMuted}`}>{c.headline}</p>
                      <span className={`mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider ${t.fg} group-hover:text-[#ff5d00]`}>
                        Ver case <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Investimento */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-[#0d0101] text-[#fffafa]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="split-reveal font-black tracking-tight leading-[1] mb-4" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
            {page.pricing.title}
          </h2>
          <p className="fade-up text-lg text-[#fffafa]/65 max-w-2xl mb-10">{page.pricing.desc}</p>
          {page.pricing.plans && (
            <ul className="stagger-up grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PLANS.map((p) => (
                <li key={p.id} className={`rounded-3xl p-7 border ${p.featured ? "border-[#ff5d00] bg-[#ff5d00]/[0.08]" : "border-white/10 bg-white/[0.03]"}`}>
                  <h3 className="font-black text-2xl">{p.name}</h3>
                  <p className="mt-2 text-sm text-[#fffafa]/60 min-h-[2.5rem]">{p.tagline}</p>
                  <p className="mt-5 font-black text-3xl">{p.price ? brl(p.price) : "Sob consulta"}</p>
                  {p.price && <p className="text-sm text-[#ffaa60] font-semibold">ou em até 6x de {brl(p.price / 6)}</p>}
                </li>
              ))}
            </ul>
          )}
          <div className="fade-up flex flex-col sm:flex-row gap-3">
            <button onClick={() => scrollToId("contato")} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5d00] text-[#0d0101] px-7 py-4 text-sm font-black uppercase tracking-wide">
              Pedir orçamento <ArrowUpRight size={16} />
            </button>
            {page.pricing.plans && (
              <a href="/#planos" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-wide hover:border-[#ff5d00] hover:text-[#ff5d00]">
                Ver detalhes dos planos
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Diagnóstico grátis */}
      <section className={`px-5 md:px-10 py-14 ${t.bg}`}>
        <a
          href="/#auditoria-instantanea"
          className="fade-up group container mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[32px] bg-[#ff5d00] text-[#0d0101] p-8 md:p-10"
        >
          <span className="flex items-start gap-4">
            <span className="w-12 h-12 shrink-0 rounded-2xl bg-[#0d0101] text-[#ff5d00] flex items-center justify-center"><Search size={22} /></span>
            <span>
              <span className="block font-black text-2xl md:text-3xl leading-tight">Faça o diagnóstico grátis do seu site</span>
              <span className="block mt-1 font-semibold opacity-75">Título, descrição, H1, dados estruturados, celular e velocidade medida pelo Google, em segundos.</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-sm">
            Analisar meu site <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
          </span>
        </a>
      </section>

      {/* Perguntas frequentes */}
      <section className={`py-20 md:py-24 px-5 md:px-10 ${t.altBg}`}>
        <div className="container mx-auto max-w-4xl">
          <h2 className={`split-reveal font-black tracking-tight leading-[1] mb-10 ${t.fg}`} style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
            Perguntas <span className="text-[#ff5d00] italic">frequentes</span>
          </h2>
          <div className="stagger-up flex flex-col gap-3">
            {page.faq.map((f) => (
              <details key={f.q} className={`group rounded-3xl px-6 md:px-8 py-5 ${t.card}`}>
                <summary className={`flex items-center justify-between gap-4 cursor-pointer list-none font-black text-lg ${t.fg}`}>
                  {f.q}
                  <ChevronDown size={20} className="shrink-0 text-[#ff5d00] transition-transform group-open:rotate-180" />
                </summary>
                <p className={`mt-4 text-base leading-relaxed ${t.fgMuted}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Outros serviços */}
      <section className={`py-16 px-5 md:px-10 ${t.bg}`}>
        <div className="container mx-auto max-w-6xl">
          <span className={`block text-xs font-black uppercase tracking-[0.3em] mb-6 ${t.fgFaint}`}>Outros serviços</span>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className={`group flex items-center justify-between rounded-3xl px-6 py-5 transition-colors hover:border-[#ff5d00] ${t.card}`}>
                  <span>
                    <span className={`block font-black text-lg ${t.fg}`}>{s.name}</span>
                    <span className={`block text-sm ${t.fgMuted}`}>{s.kicker}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-[#ff5d00] transition-transform group-hover:rotate-45" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact isDark={isDark} />
      <Footer />
    </div>
  );
}
