import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Menu, X, Check, Sun, Moon, Plus, Minus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme";
import { OrbScene } from "@/components/OrbScene";
import { OrbitDecoration } from "@/components/OrbitDecoration";

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
    const update = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-[9999] w-5 h-5 rounded-full hidden md:block"
      style={{
        left: pos.x - 10,
        top: pos.y - 10,
        background: "#ff5d00",
        mixBlendMode: "difference",
        transition: "left 0.05s linear, top 0.05s linear",
        boxShadow: "0 0 12px #ff5d0080",
      }}
    />
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const inc = value / (1800 / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.ceil(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);
  return <span ref={ref}>{display}</span>;
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left px-7 py-5 rounded-full font-bold text-lg md:text-xl transition-all duration-300"
        style={{
          background: open ? "#ff5d00" : "#ff5d00",
          color: "#0d0101",
        }}
      >
        <span className="leading-snug">{question}</span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-[#0d0101]/15 flex items-center justify-center">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-7 pt-4 pb-2 text-[#fffafa]/65 text-base md:text-lg leading-relaxed"
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formDone, setFormDone] = useState(false);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
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
  const altBg = isDark ? "bg-[#130808]" : "bg-[#f4f4f4]";
  const navBg = isScrolled
    ? isDark ? "bg-[#0d0101]/95 backdrop-blur-md shadow-2xl shadow-black/60" : "bg-white/95 backdrop-blur-md shadow-lg shadow-black/10"
    : "bg-transparent";
  const logoColor = isDark ? "#fffafa" : "#0d0101";
  const borderSubtle = isDark ? "border-white/10" : "border-black/10";

  return (
    <div className={`${bg} min-h-screen font-sans overflow-x-hidden selection:bg-[#ff5d00] selection:text-[#0d0101] transition-colors duration-500`}>
      <CustomCursor />

      {/* WhatsApp */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#ff5d00] text-[#0d0101] rounded-full px-5 py-3 flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform shadow-[#ff5d0040]"
        data-testid="button-whatsapp"
      >
        <MessageCircle size={20} className="fill-current" />
        <span className="font-bold text-sm">WhatsApp</span>
      </a>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${navBg} ${isScrolled ? "py-4" : "py-6"}`}>
        <div className="container mx-auto px-5 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10.5" stroke={logoColor} strokeWidth="1.5" />
              <circle cx="19.5" cy="4.5" r="3" fill="#ff5d00" />
              <circle cx="19.5" cy="4.5" r="1.5" fill="#ffaa60" />
            </svg>
            <span className={`font-black text-xl tracking-widest ${fg}`}>ORBARA</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {["manifesto", "servicos", "processo", "contato"].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className={`${fg} hover:text-[#ff5d00] transition-colors uppercase tracking-wider text-xs`}>
                {s === "servicos" ? "Serviços" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:border-[#ff5d00] hover:text-[#ff5d00] ${borderSubtle} ${fg}`}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-black text-sm px-6 py-3 rounded-full hover:bg-[#ff7520] transition-colors uppercase tracking-wider"
            >
              Fale conosco
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className={`w-9 h-9 rounded-full border flex items-center justify-center ${borderSubtle} ${fg}`}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className={fg} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={`absolute top-full left-0 w-full ${isDark ? "bg-[#0d0101]" : "bg-white"} border-t border-[#ff5d00]/20 flex flex-col p-5 gap-5 pb-8 shadow-2xl`}>
            {["manifesto", "servicos", "processo", "contato"].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className={`text-left py-2 font-bold uppercase tracking-wider text-sm ${fg} hover:text-[#ff5d00]`}>
                {s === "servicos" ? "Serviços" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button onClick={() => scrollTo("contato")} className="bg-[#ff5d00] text-[#0d0101] font-black px-6 py-4 rounded-full mt-2 w-full uppercase tracking-wider text-sm">
              Fale conosco
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="inicio" className={`min-h-[100dvh] flex flex-col justify-center pt-24 pb-16 px-5 md:px-10 relative overflow-hidden ${isDark ? "bg-[#0d0101]" : "bg-white"}`}>
        <OrbScene isDark={isDark} />

        {/* Radial glow behind planet */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_70%_at_75%_50%,_#ff5d0014_0%,_transparent_70%)]" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff5d00] animate-pulse" />
            <span className={`text-xs font-bold uppercase tracking-[0.3em] ${fgMuted}`}>Agência boutique · Vagas limitadas</span>
          </motion.div>

          <div className="max-w-[58%]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`font-black leading-[0.88] tracking-[-0.04em] ${fg}`}
              style={{ fontSize: "clamp(4.5rem, 11vw, 13rem)" }}
            >
              Sites que
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-black italic leading-[0.88] tracking-[-0.04em] text-[#ff5d00]"
              style={{ fontSize: "clamp(4.5rem, 11vw, 13rem)" }}
            >
              orbitam
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`font-black leading-[0.88] tracking-[-0.04em] ${fg}`}
              style={{ fontSize: "clamp(4.5rem, 11vw, 13rem)" }}
            >
              resultado.
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={`mt-10 text-lg md:text-xl ${fgMuted} max-w-lg leading-relaxed`}
          >
            Unimos Google Ads, SEO e copywriting estratégico para transformar seu site em uma máquina silenciosa de vendas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-black text-base px-8 py-5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-[#ff5d0035] uppercase tracking-wide"
            >
              Quero orbitar resultado →
            </button>
            <button
              onClick={() => scrollTo("servicos")}
              className={`${fg} font-semibold text-sm uppercase tracking-wider underline underline-offset-8 decoration-[#ff5d00]/60 hover:decoration-[#ff5d00] transition-all`}
            >
              Ver como funciona
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ───────────────────────────────────────────────────── */}
      <section id="manifesto" className={`py-6 md:py-10 ${bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#ff5d00] rounded-[40px] md:rounded-[56px] mx-4 md:mx-8 py-20 md:py-28 px-8 md:px-16 relative overflow-hidden"
        >
          <OrbitDecoration size={200} opacity={0.15} speed={16} color="#0d0101" className="absolute top-6 right-10 md:right-20" />
          <OrbitDecoration size={90} opacity={0.1} speed={24} color="#0d0101" className="absolute bottom-6 left-10" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <span className="font-bold tracking-[0.35em] text-xs text-[#0d0101]/50 uppercase block mb-6">Manifesto</span>
            <h2 className="font-extrabold text-[#0d0101] leading-[1.05] tracking-tight" style={{ fontSize: "clamp(1.9rem, 4vw, 5rem)" }}>
              Tudo o que importa orbita. Os planetas orbitam o Sol. A Lua orbita a Terra. As ideias orbitam quem as merece.{" "}
              <em>As marcas também.</em> Na Orbara, não construímos sites. Construímos gravidade.
            </h2>
          </div>
        </motion.div>
      </section>

      {/* ── O QUE FAZEMOS ───────────────────────────────────────────────── */}
      <section id="servicos" className={`py-24 md:py-36 px-5 md:px-10 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <OrbitDecoration size={360} opacity={isDark ? 0.05 : 0.04} speed={40} color="#ff5d00" className="absolute -right-24 top-12 hidden lg:block pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-16 md:mb-20">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${fgMuted}`}>Serviços</span>
            <h2 className="mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(3rem, 8vw, 9rem)" }}>
              <span className={fg}>O que</span>{" "}
              <span className="text-[#ff5d00] italic">fazemos.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                num: "01",
                heading: "Sites que convertem",
                desc: "Desenhamos sites pensados desde o primeiro pixel para transformar visitantes em clientes. Arquitetura de conversão, copy estratégico e UX que guia a decisão.",
                accent: true,
              },
              {
                num: "02",
                heading: "Google Ads cirúrgico",
                desc: "Campanhas que não gritam — convencem. Segmentação afiada, landing pages dedicadas e otimização diária do custo por conversão.",
                accent: false,
              },
              {
                num: "03",
                heading: "SEO que sustenta",
                desc: "Enquanto anúncios trazem resultado hoje, o SEO constrói a gravidade que atrai clientes amanhã — e no ano seguinte, e no outro.",
                accent: false,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-[36px] p-10 md:p-12 flex flex-col justify-between min-h-[360px] border ${
                  card.accent
                    ? "bg-[#ff5d00] border-transparent"
                    : isDark
                    ? "bg-white/[0.03] border-white/[0.06]"
                    : "bg-black/[0.03] border-black/[0.06]"
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-[0.25em] ${card.accent ? "text-[#0d0101]/50" : "text-[#ff5d00]"}`}>{card.num}</span>
                <div>
                  <h3 className={`font-black text-2xl md:text-3xl mb-4 leading-tight ${card.accent ? "text-[#0d0101]" : fg}`}>{card.heading}</h3>
                  <p className={`font-medium text-base md:text-lg leading-relaxed ${card.accent ? "text-[#0d0101]/70" : fgMuted}`}>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO TRABALHAMOS ────────────────────────────────────────────── */}
      <section id="processo" className={`py-24 md:py-36 px-5 md:px-10 ${altBg} relative overflow-hidden`}>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-16 md:mb-20">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${isDark ? "text-[#fffafa]/40" : "text-[#0d0101]/40"}`}>Processo</span>
            <h2 className="mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(3rem, 8vw, 9rem)" }}>
              <span className={isDark ? "text-[#fffafa]" : "text-[#0d0101]"}>Como</span>{" "}
              <span className="text-[#ff5d00] italic">trabalhamos.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {[
              { num: "01", title: "Escuta", desc: "Mergulhamos no seu negócio, seu cliente ideal e sua concorrência." },
              { num: "02", title: "Estratégia", desc: "Desenhamos a arquitetura de conversão e o plano de mídia." },
              { num: "03", title: "Execução", desc: "Site, campanhas e SEO entram em órbita em até 30 dias." },
              { num: "04", title: "Otimização", desc: "Medimos, ajustamos e escalamos o que funciona, mês a mês." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-[#ff5d00] font-black leading-none mb-5" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}>
                  {step.num}
                </div>
                <h3 className={`font-black text-xl uppercase tracking-wider mb-3 ${isDark ? "text-[#fffafa]" : "text-[#0d0101]"}`}>{step.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? "text-[#fffafa]/55" : "text-[#0d0101]/60"}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUEM ───────────────────────────────────────────────────── */}
      <section id="para-quem" className={`py-24 md:py-36 px-5 md:px-10 ${isDark ? "bg-[#0d0101]" : "bg-white"}`}>
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-1">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${fgMuted}`}>Para quem é</span>
            <h2 className="mt-3 font-black leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.5rem, 5.5vw, 7rem)" }}>
              <span className={fg}>Feito para quem presta</span>
              <br />
              <span className="text-[#ff5d00] italic">serviço de verdade.</span>
            </h2>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ul className="flex flex-col gap-7">
              {[
                "Prestadores de serviço especializados (advogados, contadores, consultores, médicos)",
                "Empresas B2B com soluções de ticket médio ou alto",
                "Profissionais liberais que querem parar de depender de indicação",
                "Pequenas empresas locais que disputam busca no Google",
                "Quem prefere qualidade de lead a volume de lead",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-start gap-5 text-lg md:text-xl font-medium ${fg}`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#ff5d00] mt-1.5 shrink-0 shadow-[0_0_8px_#ff5d00]" />
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
          <OrbitDecoration size={280} opacity={0.1} speed={28} color="#0d0101" className="absolute -right-8 -top-4 hidden lg:block" />
          <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {[
              { val: "+", num: 180, suffix: "%", label: "leads qualificados em 90 dias" },
              { val: "-", num: 40, suffix: "%", label: "custo por aquisição em 6 meses" },
              { val: "", num: 0, suffix: "Top 3", label: "no Google em palavras-chave estratégicas" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-black text-[#0d0101] leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
                  {stat.num > 0 ? <>{stat.val}<AnimatedNumber value={stat.num} />{stat.suffix}</> : stat.suffix}
                </div>
                <div className="font-semibold text-[#0d0101]/75 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className={`py-24 md:py-36 px-5 md:px-10 ${altBg}`}>
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16">
            <span className={`text-xs font-bold uppercase tracking-[0.35em] ${isDark ? "text-[#fffafa]/40" : "text-[#0d0101]/40"}`}>FAQ</span>
            <h2 className="mt-3 font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}>
              <span className={isDark ? "text-[#fffafa]" : "text-[#0d0101]"}>tudo o que</span>
              <br />
              <span className="text-[#ff5d00] italic">você quer saber.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { q: "Quanto tempo leva para o site ficar no ar?", a: "Em média 30 dias corridos a partir da aprovação da estratégia. Projetos mais complexos podem levar até 45 dias." },
              { q: "Vocês fazem manutenção depois que o site entra em produção?", a: "Sim. Oferecemos planos de manutenção mensais que incluem atualizações de conteúdo, correções e monitoramento de performance." },
              { q: "Já tenho um site — vocês refazem ou otimizam o atual?", a: "Depende do diagnóstico. Em muitos casos, reconstruir do zero é mais eficiente. Em outros, otimizamos o existente. Avaliamos caso a caso sem custo." },
              { q: "Como funciona o investimento em Google Ads? É à parte?", a: "Sim. O investimento em mídia (verba de anúncios) é separado da nossa taxa de gestão. Trabalhamos com verbas a partir de R$1.500/mês." },
              { q: "Trabalham com contrato de fidelidade?", a: "Não exigimos fidelidade. Nosso contrato é mês a mês após o projeto inicial. Acreditamos que resultado é o melhor contrato." },
              { q: "Em quanto tempo vejo resultado?", a: "Google Ads pode gerar leads nos primeiros 15-30 dias. SEO começa a mostrar resultados sólidos entre 3 e 6 meses. O site novo já melhora conversão imediatamente." },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VISÃO / MISSÃO CTA ──────────────────────────────────────────── */}
      <section className={`py-24 md:py-36 px-5 md:px-10 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <OrbitDecoration size={300} opacity={isDark ? 0.07 : 0.05} speed={35} color="#ff5d00" className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-black leading-[0.9] tracking-tight mb-12" style={{ fontSize: "clamp(2.8rem, 7vw, 9rem)" }}>
              <span className={fg}>Sua visão —</span>
              <br />
              <span className="text-[#ff5d00] italic">nossa missão.</span>
            </h2>
            <p className={`text-xl md:text-2xl ${fgMuted} max-w-2xl mb-12 leading-relaxed`}>
              Cada cliente recebe atenção exclusiva. Não somos uma agência de volume — somos parceiros de resultado.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => scrollTo("contato")}
                className="inline-flex items-center justify-center bg-[#ff5d00] text-[#0d0101] font-black text-base px-10 py-6 rounded-full hover:scale-105 transition-transform shadow-xl shadow-[#ff5d0030] uppercase tracking-wide"
              >
                Começar agora →
              </button>
              <button
                onClick={() => scrollTo("servicos")}
                className={`inline-flex items-center justify-center ${fg} font-bold text-sm border ${isDark ? "border-white/20" : "border-black/20"} px-10 py-6 rounded-full hover:border-[#ff5d00] hover:text-[#ff5d00] transition-all uppercase tracking-wider`}
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
          <OrbitDecoration size={170} opacity={0.1} speed={18} color="#0d0101" className="absolute top-8 right-8 hidden md:block" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <span className="font-bold tracking-[0.35em] text-xs text-[#0d0101]/50 uppercase block mb-4">Contato</span>
            <h2 className="font-black leading-[0.9] tracking-tight text-[#0d0101] mb-12" style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)" }}>
              Pronto para entrar em{" "}
              <em>órbita?</em>
            </h2>
            {formDone ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center text-[#0d0101]"
              >
                <div className="w-20 h-20 bg-[#0d0101] rounded-full flex items-center justify-center mb-8">
                  <Check size={38} className="text-[#ff5d00]" />
                </div>
                <h3 className="font-black text-3xl md:text-4xl">Sua mensagem entrou em órbita.</h3>
                <p className="text-xl mt-4 font-semibold opacity-70">Retornamos em até 24h com um diagnóstico.</p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="nome" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-sm uppercase tracking-wider">Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-base focus-visible:ring-black" data-testid="input-nome" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-semibold text-sm" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-sm uppercase tracking-wider">E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="voce@empresa.com" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-base focus-visible:ring-black" data-testid="input-email" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-semibold text-sm" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="whatsapp" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-sm uppercase tracking-wider">WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-base focus-visible:ring-black" data-testid="input-whatsapp" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-semibold text-sm" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="site" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-sm uppercase tracking-wider">Site atual (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="www.seusite.com.br" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-base focus-visible:ring-black" data-testid="input-site" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-semibold text-sm" />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="faturamento" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0d0101] font-bold text-sm uppercase tracking-wider">Faturamento mensal aproximado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] text-base focus:ring-black" data-testid="select-faturamento">
                            <SelectValue placeholder="Selecione uma faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#fffafa] border-0 rounded-2xl">
                          <SelectItem value="ate20k" className="font-semibold cursor-pointer py-3">Até R$20k</SelectItem>
                          <SelectItem value="20k-50k" className="font-semibold cursor-pointer py-3">R$20k–50k</SelectItem>
                          <SelectItem value="50k-150k" className="font-semibold cursor-pointer py-3">R$50k–150k</SelectItem>
                          <SelectItem value="150k+" className="font-semibold cursor-pointer py-3">R$150k+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-900 font-semibold text-sm" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="servico" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0d0101] font-bold text-sm uppercase tracking-wider">Qual seu serviço/produto principal?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o que você vende e para quem..."
                          className="bg-black/10 border-0 rounded-3xl min-h-[110px] p-5 text-[#0d0101] placeholder:text-[#0d0101]/40 text-base focus-visible:ring-black resize-none"
                          {...field}
                          data-testid="textarea-servico"
                        />
                      </FormControl>
                      <FormMessage className="text-red-900 font-semibold text-sm" />
                    </FormItem>
                  )} />
                  <Button
                    type="submit"
                    className="w-full h-16 rounded-full bg-[#0d0101] text-[#ff5d00] hover:bg-black font-black text-base md:text-lg mt-4 uppercase tracking-widest transition-transform hover:scale-[1.02]"
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
      <footer className="bg-[#0d0101] pt-20 pb-10 px-5 md:px-10 border-t border-white/[0.06] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <p className="text-[#fffafa]/50 text-lg font-medium max-w-xs">Onde marcas encontram sua gravidade.</p>
            <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-[#fffafa]/50">
              {["manifesto", "servicos", "processo", "contato"].map((s) => (
                <button key={s} onClick={() => scrollTo(s)} className="hover:text-[#ff5d00] transition-colors">
                  {s === "servicos" ? "Serviços" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Giant brand name */}
          <div className="relative overflow-hidden mb-10">
            <div
              className="font-black leading-[0.82] tracking-[-0.05em] select-none"
              style={{
                fontSize: "clamp(5rem, 20vw, 22rem)",
                background: "linear-gradient(180deg, #fffafa 0%, #fffafa10 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ORBARA
            </div>
            {/* Orange glow behind text */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_30%_60%,_#ff5d0018,_transparent)]" />
          </div>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-5 pt-8 border-t border-white/[0.06] text-xs">
            <div className="text-[#fffafa]/35 font-medium">© 2026 Orbara. Todos os direitos reservados.</div>
            <div className="flex items-center gap-2 text-[#fffafa]/35 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              Atendimento remoto em todo Brasil
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
