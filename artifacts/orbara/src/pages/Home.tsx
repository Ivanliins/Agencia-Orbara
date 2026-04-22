import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Menu, X, Check, Sun, Moon, Plus, Minus, TrendingUp, Search, MousePointerClick, Users, DollarSign, Repeat2, Monitor, Target } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme";
import { OrbitDecoration } from "@/components/OrbitDecoration";
import { BackgroundOrb } from "@/components/BackgroundOrb";

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
  site: z.string().optional(),
  servico: z.string().min(5, "Descreva seu serviço/produto"),
  faturamento: z.string().min(1, "Selecione uma opção"),
});

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-[9999] w-5 h-5 rounded-full hidden md:block"
      style={{
        left: pos.x - 10,
        top: pos.y - 10,
        background: "#ff5d00",
        mixBlendMode: "multiply",
        transition: "left 0.05s linear, top 0.05s linear",
        boxShadow: "0 0 10px #ff5d0060",
      }}
    />
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const inc = value / (1800 / 16);
    const t = setInterval(() => {
      s += inc;
      if (s >= value) { setN(value); clearInterval(t); }
      else setN(Math.ceil(s));
    }, 16);
    return () => clearInterval(t);
  }, [inView, value]);
  return <span ref={ref}>{n}</span>;
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left px-7 py-5 rounded-full font-bold text-lg md:text-xl transition-all bg-[#ff5d00] text-[#0d0101]"
      >
        <span>{question}</span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-[#0d0101]/15 flex items-center justify-center">
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-7 py-5 text-base md:text-lg leading-relaxed text-[#0d0101]/65"
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
}

const seoSteps = [
  {
    icon: Search,
    num: "01",
    title: "Intenção de busca",
    desc: "Seu cliente não sabe que você existe, mas sabe que tem um problema. Ele abre o Google e digita.",
  },
  {
    icon: TrendingUp,
    num: "02",
    title: "Palavra-chave estratégica",
    desc: "Mapeamos exatamente o que seu cliente ideal digita quando está pronto para comprar — não só quando está curioso.",
  },
  {
    icon: MousePointerClick,
    num: "03",
    title: "Ranking no Top 3",
    desc: "83% dos cliques vão para os três primeiros resultados. Construímos a autoridade que coloca você lá.",
  },
  {
    icon: Users,
    num: "04",
    title: "Tráfego orgânico",
    desc: "Sem custo por visita. Ao contrário dos anúncios, esse tráfego é seu — e cresce mês a mês.",
  },
  {
    icon: DollarSign,
    num: "05",
    title: "Página que converte",
    desc: "A visita vira interesse. Copy + design estratégico transformam leitores em pessoas que querem falar com você.",
  },
  {
    icon: Repeat2,
    num: "06",
    title: "Lead qualificado",
    desc: "Um potencial cliente que chegou até você por vontade própria, com dor real e intenção de resolver. O ciclo se fecha — e se repete.",
  },
];

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    const tryPlay = () => vid.play().catch(() => {});
    tryPlay();
    vid.addEventListener("canplay", tryPlay);
    return () => vid.removeEventListener("canplay", tryPlay);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", whatsapp: "", site: "", servico: "", faturamento: "" },
  });

  const onSubmit = () => setFormDone(true);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const bg = isDark ? "bg-[#0d0101]" : "bg-white";
  const fg = isDark ? "text-[#fffafa]" : "text-[#0d0101]";
  const fgMuted = isDark ? "text-[#fffafa]/55" : "text-[#0d0101]/55";
  const altBg = isDark ? "bg-[#130808]" : "bg-[#f7f5f5]";
  const navBg = isScrolled
    ? isDark
      ? "bg-[#0d0101]/95 backdrop-blur-lg shadow-2xl shadow-black/50"
      : "bg-white/95 backdrop-blur-lg shadow-lg shadow-black/10"
    : "bg-transparent";
  // Navbar text is always white over the video hero; switches to theme when scrolled
  const navFg = isScrolled ? fg : "text-white";
  const navLogoStroke = isScrolled ? (isDark ? "#fffafa" : "#0d0101") : "#ffffff";
  const borderSubtle = isScrolled
    ? (isDark ? "border-white/10" : "border-black/10")
    : "border-white/20";
  const cardBorder = isDark ? "border-white/[0.07] bg-white/[0.03]" : "border-black/[0.07] bg-black/[0.025]";

  return (
    <div
      className={`${bg} min-h-screen font-sans overflow-x-hidden selection:bg-[#ff5d00] selection:text-[#0d0101] transition-colors duration-500`}
    >
      <CustomCursor />

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#ff5d00] text-[#0d0101] rounded-full px-5 py-3 flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform shadow-[#ff5d0030]"
        data-testid="button-whatsapp"
      >
        <MessageCircle size={19} className="fill-current" />
        <span className="font-bold text-sm">WhatsApp</span>
      </a>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${navBg} ${isScrolled ? "py-4" : "py-6"}`}>
        <div className="container mx-auto px-5 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10.5" stroke={navLogoStroke} strokeWidth="1.5" />
              <circle cx="19.5" cy="4.5" r="3" fill="#ff5d00" />
              <circle cx="19.5" cy="4.5" r="1.5" fill="#ffaa60" />
            </svg>
            <span className={`font-black text-xl tracking-widest ${navFg}`}>ORBARA</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["manifesto", "servicos", "seo", "contato"].map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`text-xs font-bold uppercase tracking-wider ${navFg} hover:text-[#ff5d00] transition-colors`}
              >
                {s === "servicos" ? "Serviços" : s === "seo" ? "SEO" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:border-[#ff5d00] hover:text-[#ff5d00] ${borderSubtle} ${navFg}`}
              data-testid="button-theme-toggle"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#ff7020] transition-colors"
            >
              Fale conosco
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className={`w-9 h-9 rounded-full border flex items-center justify-center ${borderSubtle} ${navFg}`}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className={navFg} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={`absolute top-full left-0 w-full ${isDark ? "bg-[#0d0101]" : "bg-white"} border-t border-[#ff5d00]/15 flex flex-col p-5 gap-5 pb-8 shadow-2xl`}>
            {["manifesto", "servicos", "seo", "contato"].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className={`text-left py-2 font-bold uppercase tracking-wider text-sm ${fg} hover:text-[#ff5d00]`}>
                {s === "servicos" ? "Serviços" : s === "seo" ? "SEO" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button onClick={() => scrollTo("contato")} className="bg-[#ff5d00] text-[#0d0101] font-black px-6 py-4 rounded-full w-full uppercase tracking-widest text-sm">
              Fale conosco
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        id="inicio"
        className="min-h-[100dvh] flex flex-col justify-center pt-24 pb-16 px-5 md:px-10 relative overflow-hidden bg-[#050510]"
      >
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.85 }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4"
            type="video/mp4"
          />
        </video>

        {/* Left-to-right gradient overlay — ensures text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15 pointer-events-none" />
        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff5d00] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              Agência Direta · Sem Dar Voltas
            </span>
          </motion.div>

          <div className="max-w-[60%]">
            {["Sites que", "orbitam", "resultado."].map((word, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.12 }}
                className={`font-black leading-[0.88] tracking-[-0.04em] ${i === 1 ? "text-[#ff5d00] italic" : "text-white"}`}
                style={{ fontSize: "clamp(4rem, 10.5vw, 12.5rem)" }}
              >
                {word}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 md:text-xl text-white/65 max-w-lg text-left font-normal text-[20px]"
          >
            Do primeiro clique a potenciais clientes de interesse nos produtos ou serviços da sua empresa. Construímos a presença digital que transforma Leads em clientes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-black text-sm px-8 py-5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-[#ff5d0050] uppercase tracking-wide"
            >
              Quero orbitar resultado →
            </button>
            <button
              onClick={() => scrollTo("seo")}
              className="text-white/80 font-semibold text-sm uppercase tracking-wider underline underline-offset-8 decoration-[#ff5d00]/60 hover:decoration-[#ff5d00] hover:text-white transition-all"
            >
              Como geramos leads
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-16 flex flex-wrap gap-8 text-white/55 text-sm font-medium"
          >
            {["Design Exclusivo", "Sem fidelidade", "Resultados a partir de 30 dias", "Atendimento exclusivo"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d00]" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ───────────────────────────────────────────────────── */}
      <section id="manifesto" className={`py-6 md:py-10 ${bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#ff5d00] rounded-[40px] md:rounded-[56px] mx-4 md:mx-8 py-24 md:py-36 px-8 md:px-20 relative overflow-hidden"
        >
          {/* ── Orbital path decorations (background) ── */}
          {/* Large tilted ellipse spanning the card */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <ellipse cx="900" cy="350" rx="520" ry="200" fill="none" stroke="#0d0101" strokeWidth="1" strokeOpacity="0.07"
              style={{ transformOrigin: "900px 350px", animation: "orbitSpin 60s linear infinite" }} />
            <ellipse cx="900" cy="350" rx="360" ry="140" fill="none" stroke="#0d0101" strokeWidth="1" strokeOpacity="0.05"
              style={{ transformOrigin: "900px 350px", animation: "orbitSpin 40s linear infinite reverse" }} />
            <ellipse cx="200" cy="580" rx="260" ry="100" fill="none" stroke="#0d0101" strokeWidth="0.8" strokeOpacity="0.06"
              style={{ transformOrigin: "200px 580px", animation: "orbitSpin 50s linear infinite" }} />
            <ellipse cx="600" cy="100" rx="180" ry="65" fill="none" stroke="#0d0101" strokeWidth="0.8" strokeOpacity="0.05"
              style={{ transformOrigin: "600px 100px", animation: "orbitSpin 35s linear infinite reverse" }} />
            {/* Animated dots on the large ellipse */}
            <circle r="4.5" fill="#0d0101" fillOpacity="0.15">
              <animateMotion dur="18s" repeatCount="indefinite">
                <mpath xlinkHref="#orb-path-a" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#0d0101" fillOpacity="0.10">
              <animateMotion dur="28s" repeatCount="indefinite" begin="-9s">
                <mpath xlinkHref="#orb-path-a" />
              </animateMotion>
            </circle>
            <defs>
              <path id="orb-path-a" d="M380,350 a520,200 0 1,1 1,0" />
            </defs>
          </svg>
          <OrbitDecoration size={160} opacity={0.08} speed={32} color="#0d0101" className="absolute top-8 left-8" />
          <OrbitDecoration size={90} opacity={0.10} speed={20} color="#0d0101" className="absolute bottom-10 right-16 md:right-32" />

          {/* ── Content ── */}
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-bold tracking-[0.35em] text-xs text-[#0d0101]/45 uppercase block mb-12"
            >
              Manifesto
            </motion.span>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

              {/* Block 1 — Atraímos atenção */}
              <div>
                {[
                  { text: "Atraímos atenção.", type: "title", delay: 0.1 },
                  { text: "Não pela insistência,", type: "body", delay: 0.22 },
                  { text: "mas pela construção.", type: "body", delay: 0.33 },
                  { text: "", type: "gap", delay: 0 },
                  { text: "Cada escolha direciona.", type: "body", delay: 0.44 },
                  { text: "Cada detalhe posiciona.", type: "body", delay: 0.55 },
                  { text: "Cada elemento tem função.", type: "body", delay: 0.66 },
                  { text: "", type: "gap", delay: 0 },
                  { text: "Porque atenção não se pede.", type: "body", delay: 0.77 },
                  { text: "Se conquista.", type: "body-em", delay: 0.88 },
                ].map((line, i) =>
                  line.type === "gap" ? (
                    <div key={i} className="h-5" />
                  ) : (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: line.delay, ease: [0.22, 1, 0.36, 1] }}
                      className={
                        line.type === "title"
                          ? "font-black text-[#0d0101] leading-tight mb-4"
                          : line.type === "body-em"
                          ? "font-extrabold text-[#0d0101] italic"
                          : "font-medium text-[#0d0101]/75"
                      }
                      style={line.type === "title" ? { fontSize: "clamp(2rem, 4vw, 3.6rem)" } : { fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }}
                    >
                      {line.text}
                    </motion.p>
                  )
                )}
              </div>

              {/* Block 2 — Entregamos resultado */}
              <div>
                {[
                  { text: "Entregamos resultado.", type: "title", delay: 0.15 },
                  { text: "Sem atalhos.", type: "body", delay: 0.27 },
                  { text: "Sem distrações.", type: "body", delay: 0.38 },
                  { text: "Sem fazer o cliente dar voltas.", type: "body", delay: 0.49 },
                  { text: "", type: "gap", delay: 0 },
                  { text: "Transformamos interesse em ação", type: "body", delay: 0.60 },
                  { text: "com clareza, ritmo e intenção.", type: "body", delay: 0.71 },
                  { text: "", type: "gap", delay: 0 },
                  { text: "No fim,", type: "body", delay: 0.82 },
                  { text: "não é sobre estar presente.", type: "body", delay: 0.93 },
                  { text: "", type: "gap", delay: 0 },
                  { text: "É sobre ser o ponto", type: "body", delay: 1.04 },
                  { text: "para onde tudo retorna.", type: "body-em", delay: 1.15 },
                ].map((line, i) =>
                  line.type === "gap" ? (
                    <div key={i} className="h-5" />
                  ) : (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: line.delay, ease: [0.22, 1, 0.36, 1] }}
                      className={
                        line.type === "title"
                          ? "font-black text-[#0d0101] leading-tight mb-4"
                          : line.type === "body-em"
                          ? "font-extrabold text-[#0d0101] italic"
                          : "font-medium text-[#0d0101]/75"
                      }
                      style={line.type === "title" ? { fontSize: "clamp(2rem, 4vw, 3.6rem)" } : { fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }}
                    >
                      {line.text}
                    </motion.p>
                  )
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* ── SERVIÇOS ────────────────────────────────────────────────────── */}
      <section id="servicos" className={`py-24 md:py-36 px-5 md:px-10 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <BackgroundOrb isDark={isDark} size={500} offsetX="-5%" offsetY="70%" className="opacity-60" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-16 md:mb-20">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${fgMuted}`}>O que fazemos</span>
            <h2 className="mt-3 font-black tracking-tight flex flex-wrap items-baseline gap-x-5" style={{ fontSize: "clamp(2.4rem, 6vw, 7rem)", lineHeight: 1 }}>
              <span className={fg}>Três frentes.</span>
              <span className="text-[#ff5d00] italic">Um resultado.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                num: "01",
                heading: "Sites que convertem",
                desc: "Um site lento, confuso ou desatualizado custa vendas todos os dias. Projetamos cada página como uma vitrine estratégica: arquitetura de conversão, hierarquia visual clara e copy que guia o visitante até o sim.",
                accent: true,
                Icon: Monitor,
              },
              {
                num: "02",
                heading: "Google Ads cirúrgico",
                desc: "Aparecer quando o cliente já está pronto para comprar é a forma mais eficiente de investir em marketing. Campanhas de busca com segmentação precisa, landing pages dedicadas e otimização diária do custo por lead.",
                accent: false,
                Icon: Target,
              },
              {
                num: "03",
                heading: "SEO que sustenta",
                desc: "Ads trazem tráfego enquanto você paga. O SEO constrói um ativo que trabalha 24h por dia, sem custo por clique — e cresce com o tempo. É o canal com maior ROI no longo prazo, se feito do jeito certo.",
                accent: false,
                Icon: TrendingUp,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-[36px] p-10 md:p-12 flex flex-col justify-between min-h-[380px] border relative overflow-hidden ${
                  card.accent ? "bg-[#ff5d00] border-transparent" : cardBorder
                }`}
              >
                {/* Card background icon */}
                <card.Icon
                  size={130}
                  strokeWidth={1}
                  className="absolute top-6 right-6 pointer-events-none select-none"
                  style={{ opacity: card.accent ? 0.10 : (isDark ? 0.06 : 0.07), color: card.accent ? "#0d0101" : (isDark ? "#fffafa" : "#0d0101") }}
                  aria-hidden
                />
                <span className={`text-xs font-bold uppercase tracking-[0.25em] ${card.accent ? "text-[#0d0101]/45" : "text-[#ff5d00]"}`}>
                  {card.num}
                </span>
                <div>
                  <h3 className={`font-black text-2xl md:text-3xl mb-5 leading-tight ${card.accent ? "text-[#0d0101]" : fg}`}>
                    {card.heading}
                  </h3>
                  <p className={`font-medium text-base md:text-lg leading-relaxed ${card.accent ? "text-[#0d0101]/70" : fgMuted}`}>
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO JOURNEY ─────────────────────────────────────────────────── */}
      <section id="seo" className={`py-24 md:py-40 px-5 md:px-10 ${altBg} relative overflow-hidden`}>
        <BackgroundOrb isDark={isDark} size={700} offsetX="-20%" offsetY="50%" className="opacity-50" />
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20 md:mb-28">
            <div>
              <span className={`text-xs font-bold uppercase tracking-[0.35em] ${isDark ? "text-[#fffafa]/40" : "text-[#0d0101]/40"}`}>
                SEO & Geração de Leads
              </span>
              <h2 className="mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 7.5rem)" }}>
                <span className={isDark ? "text-[#fffafa]" : "text-[#0d0101]"}>Seu próximo<br />cliente está</span>
                <br />
                <span className="text-[#ff5d00] italic">pesquisando agora.</span>
              </h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className={`text-lg md:text-xl leading-relaxed ${isDark ? "text-[#fffafa]/65" : "text-[#0d0101]/65"} mb-8`}>
                Neste exato momento, alguém digita no Google o serviço que você oferece. A pergunta é:{" "}
                <strong className={isDark ? "text-[#fffafa]" : "text-[#0d0101]"}>sua empresa aparece — ou é o concorrente?</strong>
              </p>
              <p className={`text-lg md:text-xl leading-relaxed ${isDark ? "text-[#fffafa]/65" : "text-[#0d0101]/65"} mb-8`}>
                O SEO não compra visibilidade. Ele a conquista — e essa conquista tem juros compostos. Quanto mais tempo de investimento, maior o retorno. Sem pagar por cada clique novo.
              </p>
              <div className="inline-flex items-center gap-3 bg-[#ff5d00]/10 rounded-full px-6 py-3">
                <span className="w-2 h-2 rounded-full bg-[#ff5d00]" />
                <span className={`text-sm font-bold ${isDark ? "text-[#fffafa]" : "text-[#0d0101]"}`}>
                  68% das experiências online começam com uma busca no Google
                </span>
              </div>
            </div>
          </div>

          {/* Journey steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09 }}
                  className={`rounded-[28px] p-8 border relative overflow-hidden ${cardBorder}`}
                >
                  {/* Step number (background) */}
                  <div
                    className="absolute top-4 right-5 font-black text-[#ff5d00] leading-none select-none pointer-events-none"
                    style={{ fontSize: "5rem", opacity: isDark ? 0.07 : 0.06 }}
                  >
                    {step.num}
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#ff5d00]/10 flex items-center justify-center mb-5">
                    <Icon size={20} className="text-[#ff5d00]" />
                  </div>
                  <h3 className={`font-black text-xl mb-3 ${fg}`}>{step.title}</h3>
                  <p className={`text-base leading-relaxed ${fgMuted}`}>{step.desc}</p>
                  {/* Connector arrow — not on last */}
                  {i < seoSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-7 h-7 rounded-full bg-[#ff5d00] flex items-center justify-center shadow-md shadow-[#ff5d0030]">
                        <span className="text-[#0d0101] font-black text-xs">→</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mt-16 p-10 rounded-[32px] border ${cardBorder} flex flex-col md:flex-row items-start md:items-center justify-between gap-8`}
          >
            <div className="max-w-2xl">
              <h3 className={`font-black text-2xl md:text-3xl mb-3 ${fg}`}>
                O lead orgânico é o lead mais barato — e o mais qualificado.
              </h3>
              <p className={`text-base md:text-lg ${fgMuted} leading-relaxed`}>
                São 3 a 6 meses para os primeiros resultados consistentes. E anos de liderança para quem começa primeiro. Cada mês de atraso é um mês a mais que seu concorrente leva de vantagem.
              </p>
            </div>
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-black text-sm px-8 py-5 rounded-full hover:scale-105 transition-transform shrink-0 uppercase tracking-wide"
            >
              Começar agora →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── COMO TRABALHAMOS ────────────────────────────────────────────── */}
      <section id="processo" className={`py-24 md:py-36 px-5 md:px-10 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-16 md:mb-20">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${fgMuted}`}>Processo</span>
            <h2 className="mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.8rem, 7.5vw, 9rem)" }}>
              <span className={fg}>Como</span>{" "}
              <span className="text-[#ff5d00] italic">trabalhamos.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {[
              {
                num: "01",
                title: "Escuta",
                desc: "Mergulhamos no seu negócio, no seu cliente ideal e na concorrência. Sem entender o contexto, qualquer estratégia é chute.",
              },
              {
                num: "02",
                title: "Estratégia",
                desc: "Desenhamos a arquitetura de conversão, o plano de mídia e as palavras-chave que vão mover o ponteiro — não só gerar tráfego.",
              },
              {
                num: "03",
                title: "Execução",
                desc: "Site, campanhas e SEO entram em órbita em até 30 dias. Sem enrolação, sem meses esperando aprovação.",
              },
              {
                num: "04",
                title: "Otimização",
                desc: "Medimos tudo, ajustamos o que não performa e escalamos o que funciona. Todo mês você recebe um relatório claro, sem jargão.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-[#ff5d00] font-black leading-none mb-5" style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}>
                  {step.num}
                </div>
                <h3 className={`font-black text-xl uppercase tracking-wider mb-3 ${fg}`}>{step.title}</h3>
                <p className={`text-base leading-relaxed ${fgMuted}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUEM ───────────────────────────────────────────────────── */}
      <section id="para-quem" className={`py-24 md:py-36 px-5 md:px-10 ${altBg}`}>
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-1">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${isDark ? "text-[#fffafa]/40" : "text-[#0d0101]/40"}`}>Para quem é</span>
            <h2 className="mt-3 font-black leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 6.5rem)" }}>
              <span className={isDark ? "text-[#fffafa]" : "text-[#0d0101]"}>Feito para quem<br />presta serviço</span>
              <br />
              <span className="text-[#ff5d00] italic">de verdade.</span>
            </h2>
            <p className={`mt-6 text-lg leading-relaxed ${isDark ? "text-[#fffafa]/55" : "text-[#0d0101]/55"} max-w-sm`}>
              Não trabalhamos com todo mundo. Trabalhamos bem com quem já tem algo que funciona e precisa que mais pessoas encontrem.
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ul className="flex flex-col gap-7">
              {[
                "Prestadores de serviço especializado: advogados, contadores, consultores, médicos, arquitetos",
                "Empresas B2B com soluções de ticket médio ou alto",
                "Profissionais liberais que querem parar de depender só de indicação",
                "Pequenas e médias empresas disputando busca local no Google",
                "Negócios com histórico de resultado, mas presença digital abaixo do potencial",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-start gap-5 text-lg md:text-xl font-medium ${isDark ? "text-[#fffafa]" : "text-[#0d0101]"}`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#ff5d00] mt-1.5 shrink-0 shadow-[0_0_8px_#ff5d00aa]" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── RESULTADOS ──────────────────────────────────────────────────── */}
      <section className={`py-6 md:py-10 ${isDark ? "bg-[#0d0101]" : "bg-white"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#ff5d00] rounded-[40px] md:rounded-[56px] mx-4 md:mx-8 py-20 md:py-28 px-8 md:px-16 relative overflow-hidden"
        >
          <OrbitDecoration size={300} opacity={0.09} speed={30} color="#0d0101" className="absolute -right-6 -top-2 hidden lg:block" />
          <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative z-10">
            {[
              { val: "+", num: 180, suffix: "%", label: "leads qualificados em 90 dias (média dos últimos 12 clientes)" },
              { val: "-", num: 40, suffix: "%", label: "custo por aquisição em 6 meses de otimização contínua" },
              { val: "", num: 0, suffix: "Top 3", label: "no Google em palavras-chave de alta intenção de compra" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-black text-[#0d0101] leading-none mb-3" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
                  {stat.num > 0 ? <>{stat.val}<AnimatedNumber value={stat.num} />{stat.suffix}</> : stat.suffix}
                </div>
                <div className="font-semibold text-[#0d0101]/70 text-base md:text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className={`py-24 md:py-36 px-5 md:px-10 ${altBg}`}>
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${isDark ? "text-[#fffafa]/40" : "text-[#0d0101]/40"}`}>Dúvidas</span>
            <h2 className="mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.2rem, 6.5vw, 7rem)" }}>
              <span className={isDark ? "text-[#fffafa]" : "text-[#0d0101]"}>Tudo o que</span>
              <br />
              <span className="text-[#ff5d00] italic">você quer saber.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                q: "Quanto tempo leva para o site ficar no ar?",
                a: "Em média 30 dias corridos a partir da aprovação da estratégia. O processo inclui briefing, wireframe, design, desenvolvimento e testes. Projetos mais complexos (como e-commerce ou plataformas) podem levar até 45-60 dias.",
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
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VISÃO / MISSÃO ──────────────────────────────────────────────── */}
      <section className={`py-24 md:py-36 px-5 md:px-10 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <BackgroundOrb isDark={isDark} size={600} offsetX="-5%" offsetY="50%" className="opacity-70" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-black leading-[0.9] tracking-tight mb-10" style={{ fontSize: "clamp(2.5rem, 6.5vw, 8.5rem)" }}>
              <span className={fg}>Sua visão —</span>
              <br />
              <span className="text-[#ff5d00] italic">nossa missão.</span>
            </h2>
            <p className={`text-xl md:text-2xl ${fgMuted} max-w-2xl mb-5 leading-relaxed`}>
              Cada cliente recebe atenção exclusiva. Não somos uma agência de volume — somos parceiros de resultado. Por isso abrimos vagas limitadas e escolhemos com quem trabalhamos.
            </p>
            <p className={`text-lg ${fgMuted} max-w-xl mb-12 leading-relaxed`}>
              Quando você entra na Orbara, seu crescimento vira nossa obsessão. Seu sucesso é o nosso portfólio.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => scrollTo("contato")}
                className="bg-[#ff5d00] text-[#0d0101] font-black text-sm px-10 py-6 rounded-full hover:scale-105 transition-transform shadow-xl shadow-[#ff5d0025] uppercase tracking-wide"
              >
                Começar agora →
              </button>
              <button
                onClick={() => scrollTo("servicos")}
                className={`font-bold text-sm border ${isDark ? "border-white/20" : "border-black/20"} px-10 py-6 rounded-full hover:border-[#ff5d00] hover:text-[#ff5d00] transition-all uppercase tracking-wider ${fg}`}
              >
                Ver serviços
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTATO ─────────────────────────────────────────────────────── */}
      <section id="contato" className={`py-6 md:py-10 ${isDark ? "bg-[#0d0101]" : "bg-white"}`}>
        <div className="mx-4 md:mx-8 bg-[#ff5d00] rounded-[40px] md:rounded-[56px] py-16 md:py-24 px-8 md:px-16 relative overflow-hidden">
          <OrbitDecoration size={180} opacity={0.09} speed={20} color="#0d0101" className="absolute top-8 right-8 hidden md:block" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <span className="font-bold tracking-[0.35em] text-xs text-[#0d0101]/45 uppercase block mb-4">Contato</span>
            <h2 className="font-black text-[#0d0101] leading-[0.9] tracking-tight mb-4" style={{ fontSize: "clamp(2.2rem, 5.5vw, 7rem)" }}>
              Pronto para entrar em <em>órbita?</em>
            </h2>
            <p className="text-[#0d0101]/65 font-medium text-lg mb-12 max-w-lg">
              Preencha o formulário abaixo. Em até 24h úteis retornamos com um diagnóstico gratuito do seu potencial digital.
            </p>

            {formDone ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-16 text-center text-[#0d0101]"
              >
                <div className="w-20 h-20 bg-[#0d0101] rounded-full flex items-center justify-center mb-8">
                  <Check size={36} className="text-[#ff5d00]" />
                </div>
                <h3 className="font-black text-3xl md:text-4xl mb-4">Sua mensagem entrou em órbita.</h3>
                <p className="text-xl font-semibold opacity-65">Retornamos em até 24h com um diagnóstico.</p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: "nome" as const, label: "Nome completo", placeholder: "Seu nome", type: "text", testid: "input-nome" },
                      { name: "email" as const, label: "E-mail", placeholder: "voce@empresa.com", type: "email", testid: "input-email" },
                      { name: "whatsapp" as const, label: "WhatsApp", placeholder: "(00) 00000-0000", type: "text", testid: "input-whatsapp" },
                      { name: "site" as const, label: "Site atual (opcional)", placeholder: "www.seusite.com.br", type: "text", testid: "input-site" },
                    ].map((f) => (
                      <FormField key={f.name} control={form.control} name={f.name} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0d0101] font-bold text-xs uppercase tracking-wider">{f.label}</FormLabel>
                          <FormControl>
                            <Input
                              type={f.type}
                              placeholder={f.placeholder}
                              {...field}
                              className="bg-white/40 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/50 text-base focus-visible:ring-2 focus-visible:ring-[#0d0101]/30"
                              data-testid={f.testid}
                            />
                          </FormControl>
                          <FormMessage className="text-red-900 font-semibold text-xs" />
                        </FormItem>
                      )} />
                    ))}
                  </div>
                  <FormField control={form.control} name="faturamento" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0d0101] font-bold text-xs uppercase tracking-wider">Faturamento mensal aproximado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/40 border-0 rounded-full h-14 px-6 text-[#0d0101] text-base focus:ring-2 focus:ring-[#0d0101]/30" data-testid="select-faturamento">
                            <SelectValue placeholder="Selecione uma faixa" className="text-[#0d0101]/50" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-black/10 rounded-2xl shadow-xl">
                          <SelectItem value="ate20k" className="text-[#0d0101] font-semibold cursor-pointer py-3 focus:bg-[#ff5d00]/10">Até R$20k</SelectItem>
                          <SelectItem value="20k-50k" className="text-[#0d0101] font-semibold cursor-pointer py-3 focus:bg-[#ff5d00]/10">R$20k–50k</SelectItem>
                          <SelectItem value="50k-150k" className="text-[#0d0101] font-semibold cursor-pointer py-3 focus:bg-[#ff5d00]/10">R$50k–150k</SelectItem>
                          <SelectItem value="150k+" className="text-[#0d0101] font-semibold cursor-pointer py-3 focus:bg-[#ff5d00]/10">R$150k+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-900 font-semibold text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="servico" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0d0101] font-bold text-xs uppercase tracking-wider">Qual seu serviço/produto principal?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o que você vende e para quem. Quanto mais detalhe, melhor nosso diagnóstico."
                          className="bg-white/40 border-0 rounded-3xl min-h-[110px] p-5 text-[#0d0101] placeholder:text-[#0d0101]/50 text-base focus-visible:ring-2 focus-visible:ring-[#0d0101]/30 resize-none"
                          {...field}
                          data-testid="textarea-servico"
                        />
                      </FormControl>
                      <FormMessage className="text-red-900 font-semibold text-xs" />
                    </FormItem>
                  )} />
                  <Button
                    type="submit"
                    className="w-full h-16 rounded-full bg-[#0d0101] text-[#ff5d00] hover:bg-black font-black text-sm uppercase tracking-widest mt-4 transition-transform hover:scale-[1.015]"
                    data-testid="button-submit"
                  >
                    Enviar para a Orbara →
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d0101] pt-20 pb-10 px-5 md:px-10 border-t border-white/[0.05] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <p className="text-[#fffafa]/45 text-lg font-medium max-w-xs">Onde marcas encontram sua gravidade.</p>
            <div className="flex flex-wrap gap-7 text-xs font-bold uppercase tracking-widest text-[#fffafa]/40">
              {["manifesto", "servicos", "seo", "processo", "contato"].map((s) => (
                <button key={s} onClick={() => scrollTo(s)} className="hover:text-[#ff5d00] transition-colors">
                  {s === "servicos" ? "Serviços" : s === "seo" ? "SEO" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden mb-10">
            <div
              className="font-black leading-[0.82] tracking-[-0.05em] select-none"
              style={{
                fontSize: "clamp(5rem, 20vw, 22rem)",
                background: "linear-gradient(180deg, rgba(255,250,250,0.9) 0%, rgba(255,250,250,0.05) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ORBARA
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_45%_40%_at_28%_55%,_#ff5d0014,_transparent)]" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-5 pt-8 border-t border-white/[0.05] text-xs">
            <div className="text-[#fffafa]/30 font-medium">© 2026 Orbara. Todos os direitos reservados.</div>
            <div className="flex items-center gap-2 text-[#fffafa]/30 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Atendimento remoto em todo Brasil
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
