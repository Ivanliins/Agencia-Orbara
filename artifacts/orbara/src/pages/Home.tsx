import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Menu, X, Check, Sun, Moon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme";
import { OrbScene } from "@/components/OrbScene";
import { OrbitDecoration, OrbitSystem } from "@/components/OrbitDecoration";

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
  site: z.string().optional(),
  servico: z.string().min(5, "Descreva seu serviço/produto"),
  faturamento: z.string().min(1, "Selecione uma opção"),
});

function CustomCursor({ isDark }: { isDark: boolean }) {
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
        opacity: isDark ? 0.9 : 0.7,
        mixBlendMode: isDark ? "difference" : "multiply",
        transition: "left 0.05s linear, top 0.05s linear",
        boxShadow: "0 0 10px #ff5d0066",
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
    const inc = value / (2000 / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.ceil(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);
  return <span ref={ref}>{display}</span>;
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

  // ── Theme-aware class helpers ─────────────────────────────────────────────
  const bg = isDark ? "bg-[#0d0101]" : "bg-white";
  const fg = isDark ? "text-[#fffafa]" : "text-[#0d0101]";
  const fgMuted = isDark ? "text-[#fffafa]/65" : "text-[#0d0101]/60";
  const altBg = isDark ? "bg-[#fffafa]" : "bg-[#f2f2f2]";
  const navBg = isScrolled
    ? (isDark ? "bg-[#0d0101]/90 backdrop-blur-md shadow-lg shadow-black/30" : "bg-white/90 backdrop-blur-md shadow-lg shadow-black/10")
    : "bg-transparent";
  const logoColor = isDark ? "#fffafa" : "#0d0101";
  const mobileBg = isDark ? "bg-[#0d0101]" : "bg-white";
  const accordionCard = isDark ? "bg-white/5" : "bg-black/5";
  const borderSubtle = isDark ? "border-white/10" : "border-black/10";

  return (
    <div className={`${bg} min-h-screen font-sans overflow-x-hidden selection:bg-[#ff5d00] selection:text-[#0d0101] transition-colors duration-500`}>
      <CustomCursor isDark={isDark} />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#ff5d00] text-[#0d0101] rounded-full px-5 py-3 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        data-testid="button-whatsapp"
      >
        <MessageCircle size={20} className="fill-current" />
        <span className="font-semibold text-sm">WhatsApp</span>
      </a>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${navBg} ${isScrolled ? "py-4" : "py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10.5" stroke={logoColor} strokeWidth="1.5" />
              <circle cx="19.5" cy="4.5" r="3" fill="#ff5d00" />
              <circle cx="19.5" cy="4.5" r="1.5" fill="#ffaa60" />
            </svg>
            <span className={`font-black text-xl tracking-wider ${fg}`}>ORBARA</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            {["manifesto", "servicos", "processo", "contato"].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className={`${fg} hover:text-[#ff5d00] transition-colors capitalize`}>
                {s === "servicos" ? "Serviços" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:border-[#ff5d00] hover:text-[#ff5d00] ${borderSubtle} ${fg}`}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-bold px-6 py-3 rounded-full hover:bg-[#ff7520] transition-colors"
            >
              Fale com a Orbara
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full border flex items-center justify-center ${borderSubtle} ${fg}`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className={fg} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={`absolute top-full left-0 w-full ${mobileBg} border-t border-[#ff5d00]/20 flex flex-col p-4 gap-4 pb-8 shadow-2xl`}>
            {["manifesto", "servicos", "processo", "contato"].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className={`text-left py-2 font-medium ${fg} hover:text-[#ff5d00] capitalize`}>
                {s === "servicos" ? "Serviços" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button onClick={() => scrollTo("contato")} className="bg-[#ff5d00] text-[#0d0101] font-bold px-6 py-4 rounded-full mt-4 w-full">
              Fale com a Orbara
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="inicio" className={`min-h-[100dvh] flex flex-col justify-center pt-24 pb-12 px-4 md:px-8 relative overflow-hidden ${isDark ? "bg-[#0d0101]" : "bg-white"}`}>
        {/* 3D Orbit Background */}
        <OrbScene isDark={isDark} />

        {/* Radial ambient glow */}
        <div className={`absolute inset-0 pointer-events-none ${isDark ? "bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,_#ff5d0012_0%,_transparent_70%)]" : "bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,_#ff5d0009_0%,_transparent_70%)]"}`} />

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-block bg-[#ff5d00] text-[#0d0101] font-semibold rounded-full px-5 py-2 mb-8 md:mb-12 text-sm"
          >
            Agência boutique · Vagas limitadas
          </motion.div>

          <motion.h1
            className="font-black leading-[0.9] tracking-[-0.03em] mb-8 max-w-[55%]"
            style={{ fontSize: "clamp(4rem, 12vw, 13rem)" }}
          >
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className={fg}>
              Sites que
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-[#ff5d00]">
              orbitam
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className={fg}>
              resultado.
            </motion.div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-xl md:text-2xl ${fgMuted} max-w-xl mb-12 font-normal leading-relaxed`}
          >
            Unimos Google Ads, SEO e copywriting estratégico para transformar seu site em uma máquina silenciosa de vendas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <button
              onClick={() => scrollTo("contato")}
              className="bg-[#ff5d00] text-[#0d0101] font-bold text-lg px-8 py-5 rounded-full hover:scale-105 transition-transform w-full sm:w-auto shadow-lg shadow-[#ff5d00]/30"
            >
              Quero orbitar resultado →
            </button>
            <button
              onClick={() => scrollTo("servicos")}
              className={`${fg} font-medium underline underline-offset-8 decoration-[#ff5d00] hover:text-[#ff5d00] transition-colors`}
            >
              Ver como funciona
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ───────────────────────────────────────────────────────── */}
      <section id="manifesto" className={`py-12 md:py-24 ${bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-[#ff5d00] rounded-[40px] md:rounded-[60px] mx-4 md:mx-8 py-20 md:py-32 px-8 md:px-16 relative overflow-hidden"
        >
          <OrbitDecoration
            size={180}
            opacity={0.18}
            speed={14}
            color="#0d0101"
            className="absolute top-8 right-8 md:right-16"
          />
          <OrbitDecoration
            size={100}
            opacity={0.12}
            speed={22}
            color="#0d0101"
            className="absolute bottom-8 left-12"
          />
          <div className="container mx-auto max-w-5xl relative z-10">
            <span className="font-semibold tracking-[0.3em] text-sm text-[#0d0101]/60 uppercase block mb-8">
              Manifesto
            </span>
            <h2 className="font-extrabold text-3xl md:text-5xl lg:text-7xl text-[#0d0101] leading-[1.1] tracking-tight">
              Tudo o que importa orbita. Os planetas orbitam o Sol. A Lua orbita a Terra. As ideias orbitam quem as merece. As marcas também. Na Orbara, não construímos sites. Construímos gravidade.
            </h2>
          </div>
        </motion.div>
      </section>

      {/* ── O QUE FAZEMOS ───────────────────────────────────────────────────── */}
      <section id="servicos" className={`py-24 px-4 md:px-8 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <OrbitDecoration
          size={320}
          opacity={isDark ? 0.08 : 0.06}
          speed={30}
          color="#ff5d00"
          className="absolute -right-20 top-20 hidden lg:block"
        />
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className={`font-black ${fg} leading-none mb-16 md:mb-24`} style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
            O que fazemos.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                bg: "bg-[#ff5d00]",
                title: "text-[#0d0101]",
                text: "text-[#0d0101]/80",
                heading: "Sites que convertem",
                desc: "Desenhamos sites pensados desde o primeiro pixel para transformar visitantes em clientes. Arquitetura de conversão, copy estratégico e UX que guia a decisão.",
              },
              {
                bg: isDark ? "bg-[#fffafa]" : "bg-[#f2f2f2]",
                title: "text-[#0d0101]",
                text: "text-[#0d0101]/80",
                heading: "Google Ads cirúrgico",
                desc: "Campanhas que não gritam — convencem. Segmentação afiada, landing pages dedicadas e otimização diária do custo por conversão.",
              },
              {
                bg: "bg-transparent border-2 border-[#ff5d00]",
                title: isDark ? "text-[#fffafa]" : "text-[#0d0101]",
                text: isDark ? "text-[#fffafa]/80" : "text-[#0d0101]/70",
                heading: "SEO que sustenta",
                desc: "Enquanto anúncios trazem resultado hoje, o SEO constrói a gravidade que atrai clientes amanhã — e no ano seguinte, e no outro.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`${card.bg} rounded-[40px] p-10 md:p-12 flex flex-col justify-between min-h-[380px]`}
              >
                <h3 className={`${card.title} font-bold text-3xl md:text-4xl mb-6 leading-tight`}>{card.heading}</h3>
                <p className={`${card.text} font-medium text-lg leading-relaxed`}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO TRABALHAMOS ────────────────────────────────────────────────── */}
      <section id="processo" className={`py-24 md:py-40 px-4 md:px-8 ${altBg} text-[#0d0101] relative overflow-hidden`}>
        <OrbitSystem
          size={260}
          color="#ff5d00"
          className="absolute -left-16 bottom-16 opacity-30 hidden lg:block"
        />
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="font-black text-[#0d0101] leading-[0.9] mb-16 md:mb-24" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
            Como<br />trabalhamos.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
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
                className="flex flex-col"
              >
                <div className="font-black text-[#ff5d00] leading-none mb-4" style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}>
                  {step.num}
                </div>
                <h3 className="font-bold text-2xl uppercase tracking-wide mb-4 text-[#0d0101]">{step.title}</h3>
                <p className="text-[#0d0101]/70 text-lg leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ─────────────────────────────────────────────────────── */}
      <section id="para-quem" className={`py-24 md:py-40 px-4 md:px-8 ${isDark ? "bg-[#0d0101]" : "bg-white"} relative overflow-hidden`}>
        <OrbitDecoration
          size={240}
          opacity={isDark ? 0.1 : 0.07}
          speed={25}
          color="#ff5d00"
          className="absolute right-8 top-16 hidden lg:block"
        />
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          <div className="flex-1">
            <h2 className={`font-black ${fg} leading-[1.1]`} style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)" }}>
              Feito para quem presta serviço de verdade.
            </h2>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ul className="flex flex-col gap-8">
              {[
                "Prestadores de serviço especializados (advogados, contadores, consultores, médicos)",
                "Empresas B2B com soluções de ticket médio ou alto",
                "Profissionais liberais que querem parar de depender de indicação",
                "Pequenas empresas locais que disputam busca no Google",
                "Quem prefere qualidade de lead a volume de lead",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-6 text-xl md:text-2xl font-medium ${fg}`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#ff5d00] mt-2 shrink-0 shadow-[0_0_8px_#ff5d00]" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── RESULTADOS ──────────────────────────────────────────────────────── */}
      <section className={`py-12 md:py-24 ${bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#ff5d00] rounded-[40px] md:rounded-[60px] mx-4 md:mx-8 py-20 md:py-32 px-8 md:px-16 relative overflow-hidden"
        >
          <OrbitSystem
            size={300}
            color="#0d0101"
            className="absolute -right-12 -top-8 opacity-15 hidden lg:block"
          />
          <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left relative z-10">
            <div>
              <div className="font-black text-[#0d0101] leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
                +<AnimatedNumber value={180} />%
              </div>
              <div className="font-semibold text-[#0d0101]/80 text-xl">leads qualificados em 90 dias</div>
            </div>
            <div>
              <div className="font-black text-[#0d0101] leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
                -<AnimatedNumber value={40} />%
              </div>
              <div className="font-semibold text-[#0d0101]/80 text-xl">custo por aquisição em 6 meses</div>
            </div>
            <div>
              <div className="font-black text-[#0d0101] leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
                Top 3
              </div>
              <div className="font-semibold text-[#0d0101]/80 text-xl">no Google em palavras-chave estratégicas</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" className={`py-24 md:py-40 px-4 md:px-8 ${altBg} text-[#0d0101]`}>
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-black text-[#0d0101] leading-none mb-16" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            Perguntas frequentes.
          </h2>
          <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
            {[
              { q: "Quanto tempo leva para o site ficar no ar?", a: "Em média 30 dias corridos a partir da aprovação da estratégia. Projetos mais complexos podem levar até 45 dias." },
              { q: "Vocês fazem manutenção depois que o site entra em produção?", a: "Sim. Oferecemos planos de manutenção mensais que incluem atualizações de conteúdo, correções e monitoramento de performance." },
              { q: "Já tenho um site — vocês refazem ou otimizam o atual?", a: "Depende do diagnóstico. Em muitos casos, reconstruir do zero é mais eficiente. Em outros, otimizamos o existente. Avaliamos caso a caso sem custo." },
              { q: "Como funciona o investimento em Google Ads? É à parte?", a: "Sim. O investimento em mídia (verba de anúncios) é separado da nossa taxa de gestão. Trabalhamos com verbas a partir de R$1.500/mês." },
              { q: "Trabalham com contrato de fidelidade?", a: "Não exigimos fidelidade. Nosso contrato é mês a mês após o projeto inicial. Acreditamos que resultado é o melhor contrato." },
              { q: "Em quanto tempo vejo resultado?", a: "Google Ads pode gerar leads nos primeiros 15-30 dias. SEO começa a mostrar resultados sólidos entre 3 e 6 meses. O site novo já melhora conversão imediatamente." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className={`${accordionCard} rounded-[32px] px-6 py-2 border-0`}>
                <AccordionTrigger className="font-bold text-xl md:text-2xl text-left hover:no-underline hover:text-[#ff5d00] transition-colors py-6 text-[#0d0101]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#0d0101]/70 text-lg leading-relaxed pb-6 pr-8">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CONTATO ─────────────────────────────────────────────────────────── */}
      <section id="contato" className={`py-24 md:py-40 px-4 md:px-8 ${isDark ? "bg-[#0d0101]" : "bg-white"}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className={`font-black ${fg} leading-none mb-6`} style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
              Pronto para entrar em órbita?
            </h2>
            <p className={`text-xl md:text-2xl ${fgMuted} max-w-2xl`}>
              Conte sobre seu negócio. Respondemos em até 24h úteis.
            </p>
          </div>
          <div className="bg-[#ff5d00] rounded-[40px] md:rounded-[60px] p-8 md:p-16 relative overflow-hidden">
            <OrbitDecoration size={160} opacity={0.12} speed={18} color="#0d0101" className="absolute top-6 right-8 hidden md:block" />
            {formDone ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center text-[#0d0101]"
              >
                <div className="w-20 h-20 bg-[#0d0101] rounded-full flex items-center justify-center mb-8">
                  <Check size={40} className="text-[#ff5d00]" />
                </div>
                <h3 className="font-bold text-3xl md:text-4xl">Sua mensagem entrou em órbita.</h3>
                <p className="text-xl mt-4 font-medium opacity-80">Retornamos em breve com um diagnóstico.</p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="nome" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-lg">Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-lg focus-visible:ring-black" data-testid="input-nome" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-medium" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-lg">E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="voce@empresa.com" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-lg focus-visible:ring-black" data-testid="input-email" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-medium" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="whatsapp" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-lg">WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-lg focus-visible:ring-black" data-testid="input-whatsapp" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-medium" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="site" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0d0101] font-bold text-lg">Site atual (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="www.seusite.com.br" {...field} className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-lg focus-visible:ring-black" data-testid="input-site" />
                        </FormControl>
                        <FormMessage className="text-red-900 font-medium" />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="faturamento" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0d0101] font-bold text-lg">Faturamento mensal aproximado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/10 border-0 rounded-full h-14 px-6 text-[#0d0101] text-lg focus:ring-black" data-testid="select-faturamento">
                            <SelectValue placeholder="Selecione uma faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#fffafa] border-0 rounded-2xl">
                          <SelectItem value="ate20k" className="font-medium text-lg cursor-pointer py-3">Até R$20k</SelectItem>
                          <SelectItem value="20k-50k" className="font-medium text-lg cursor-pointer py-3">R$20k–50k</SelectItem>
                          <SelectItem value="50k-150k" className="font-medium text-lg cursor-pointer py-3">R$50k–150k</SelectItem>
                          <SelectItem value="150k+" className="font-medium text-lg cursor-pointer py-3">R$150k+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-900 font-medium" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="servico" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0d0101] font-bold text-lg">Qual seu serviço/produto principal?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o que você vende e para quem..."
                          className="bg-black/10 border-0 rounded-3xl min-h-[120px] p-6 text-[#0d0101] placeholder:text-[#0d0101]/40 text-lg focus-visible:ring-black resize-none"
                          {...field}
                          data-testid="textarea-servico"
                        />
                      </FormControl>
                      <FormMessage className="text-red-900 font-medium" />
                    </FormItem>
                  )} />
                  <Button
                    type="submit"
                    className="w-full h-20 rounded-full bg-[#0d0101] text-[#ff5d00] hover:bg-[#0d0101]/90 font-bold text-xl md:text-2xl mt-8 transition-transform hover:scale-[1.02]"
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

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d0101] pt-24 pb-12 px-4 md:px-8 border-t border-white/5 relative overflow-hidden">
        <OrbitSystem
          size={350}
          color="#ff5d00"
          className="absolute -bottom-16 -right-16 opacity-10 hidden lg:block"
        />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 mb-24">
            <div>
              <div className="font-black text-5xl md:text-7xl text-[#ff5d00] tracking-wider mb-6">ORBARA</div>
              <p className="text-2xl text-[#fffafa]/60 max-w-md font-medium">Onde marcas encontram sua gravidade.</p>
            </div>
            <div className="flex flex-col md:items-end justify-start">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-lg font-medium text-[#fffafa] mb-12">
                {["manifesto", "servicos", "processo", "contato"].map((s) => (
                  <button key={s} onClick={() => scrollTo(s)} className="hover:text-[#ff5d00] transition-colors text-left md:text-right capitalize">
                    {s === "servicos" ? "Serviços" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-6">
                <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#fffafa] hover:bg-[#ff5d00] hover:border-[#ff5d00] hover:text-[#0d0101] transition-all text-sm font-bold">Ig</a>
                <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#fffafa] hover:bg-[#ff5d00] hover:border-[#ff5d00] hover:text-[#0d0101] transition-all text-sm font-bold">In</a>
              </div>
            </div>
          </div>
          <div className={`flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-sm`}>
            <div className="text-[#fffafa]/60">© 2026 Orbara. Todos os direitos reservados.</div>
            <div className="text-[#fffafa]/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              Atendimento remoto em todo Brasil
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
