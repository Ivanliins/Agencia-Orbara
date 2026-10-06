import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowUpRight, ArrowUp, Check, MessageCircle, Instagram, Clock, Search as SearchIcon, FileText, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gsap, ScrollTrigger, SplitText, useGSAP, revealIn, scrollToId, scrollToTop, whileVisible } from "@/lib/motion";
import { Magnetic } from "@/components/motion-fx";
import { BackgroundOrb } from "@/components/BackgroundOrb";
import { OrbitDecoration } from "@/components/OrbitDecoration";
import { OrbaraLogo } from "./Chrome";
import { tokens, NAV_ITEMS, WHATSAPP_URL, INSTAGRAM_URL } from "./tokens";

// ── Visão / Missão ───────────────────────────────────────────────────────

export function Vision({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = tokens(isDark);

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(".vision-lead", { type: "words", aria: "none" });
      gsap.fromTo(split.words, { opacity: 0.12 }, {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".vision-lead", start: "top 80%", end: "bottom 55%", scrub: true },
      });
      gsap.to(".vision-orbit", { rotation: 360, duration: 40, ease: "none", repeat: -1, scrollTrigger: whileVisible(ref.current) });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className={`py-24 md:py-36 px-5 md:px-10 ${t.bg} relative overflow-hidden`}>
      <BackgroundOrb isDark={isDark} size={600} offsetX="-5%" offsetY="50%" className="opacity-70" />
      <div className="vision-orbit absolute -right-40 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-dashed border-[#ff5d00]/25 hidden lg:block pointer-events-none">
        <span className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#ff5d00] shadow-[0_0_30px_#ff5d00]" />
      </div>
      <div className="container mx-auto max-w-5xl relative z-10">
        <h2 className="split-reveal font-black leading-[0.9] tracking-tight mb-10" style={{ fontSize: "clamp(2.5rem, 6.5vw, 8.5rem)", perspective: 600 }}>
          <span className={t.fg}>Sua visão — </span>
          <span className="text-[#ff5d00] italic pr-2">nossa missão.</span>
        </h2>
        <p className={`vision-lead text-2xl md:text-4xl font-bold leading-snug max-w-4xl mb-8 ${t.fg}`}>
          Cada cliente recebe atenção exclusiva. Não somos uma agência de volume — somos parceiros de resultado. Por isso abrimos vagas limitadas e escolhemos com quem trabalhamos.
        </p>
        <p className={`fade-up text-lg ${t.fgMuted} max-w-xl mb-12 leading-relaxed`}>
          Quando você entra na Orbara, seu crescimento vira nossa obsessão. Seu sucesso é o nosso portfólio.
        </p>
        <div className="fade-up flex flex-col sm:flex-row gap-4">
          <Magnetic>
            <button
              onClick={() => scrollToId("contato")}
              className="group inline-flex items-center gap-3 bg-[#ff5d00] text-[#0d0101] font-black text-sm pl-8 pr-2.5 py-2.5 rounded-full shadow-xl shadow-[#ff5d00]/25 uppercase tracking-wide"
            >
              Começar agora
              <span className="w-11 h-11 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </button>
          </Magnetic>
          <button
            onClick={() => scrollToId("servicos")}
            className={`font-bold text-sm border ${isDark ? "border-white/20" : "border-black/20"} px-10 py-5 rounded-full hover:border-[#ff5d00] hover:text-[#ff5d00] transition-all uppercase tracking-wider ${t.fg}`}
          >
            Ver serviços
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Contato ──────────────────────────────────────────────────────────────

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
  site: z.string().optional(),
  servico: z.string().min(5, "Descreva seu serviço/produto"),
  faturamento: z.string().min(1, "Selecione uma opção"),
});

const NEXT_STEPS = [
  { icon: Clock, title: "Retorno em até 24h úteis", desc: "Um especialista analisa suas respostas." },
  { icon: SearchIcon, title: "Diagnóstico gratuito", desc: "Mapeamos o potencial digital do seu negócio." },
  { icon: FileText, title: "Proposta sob medida", desc: "Plano claro, com prazos e investimento." },
];

const inputCls = "bg-white/45 border-0 rounded-2xl h-14 px-5 text-[#0d0101] placeholder:text-[#0d0101]/45 text-base focus-visible:ring-2 focus-visible:ring-[#0d0101] focus-visible:bg-white/70 transition-colors";

export function Contact({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [done, setDone] = useState(false);
  const t = tokens(isDark);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", whatsapp: "", site: "", servico: "", faturamento: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("server error");
      setDone(true);
    } catch {
      alert("Erro ao enviar formulário. Tente novamente.");
    }
  };

  useGSAP(() => {
    revealIn(ref.current);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".contact-card", { clipPath: "inset(10% 5% 10% 5% round 56px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 56px)", ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 30%", scrub: true },
      });
      gsap.from(".next-step", { x: -30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".next-steps", start: "top 85%", once: true } });
      gsap.from(".form-field", { y: 30, opacity: 0, stagger: 0.06, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".contact-form", start: "top 85%", once: true } });
    });
  }, { scope: ref });

  useGSAP(() => {
    if (done) gsap.from(".done-anim > *", { y: 30, opacity: 0, scale: 0.9, stagger: 0.12, duration: 0.8, ease: "back.out(2)" });
  }, { dependencies: [done], scope: ref });

  return (
    <section id="contato" ref={ref} className={`py-6 md:py-10 ${t.bg}`}>
      <div className="contact-card mx-3 md:mx-8 bg-[#ff5d00] rounded-[40px] md:rounded-[56px] py-16 md:py-24 px-6 md:px-16 relative overflow-hidden">
        <OrbitDecoration size={180} opacity={0.09} speed={20} color="#0d0101" className="absolute top-8 right-8 hidden md:block" />
        <div className="container mx-auto max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16">
          <div>
            <span className="fade-up font-black tracking-[0.35em] text-xs text-[#0d0101]/55 uppercase block mb-4">Contato</span>
            <h2 className="split-reveal font-black text-[#0d0101] leading-[0.9] tracking-tight mb-5" style={{ fontSize: "clamp(2.4rem, 5vw, 5.5rem)", perspective: 600 }}>
              Pronto para entrar em <em className="pr-2">órbita?</em>
            </h2>
            <p className="fade-up text-[#0d0101]/70 font-semibold text-lg mb-10 max-w-md">
              Preencha o formulário. Em até 24h úteis retornamos com um diagnóstico gratuito do seu potencial digital.
            </p>
            <div className="next-steps flex flex-col gap-3 mb-10">
              {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="next-step flex items-center gap-4 rounded-2xl bg-[#0d0101]/[0.07] p-4">
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-[#0d0101] text-[#ff5d00] flex items-center justify-center"><Icon size={19} /></span>
                  <div>
                    <div className="font-black text-[#0d0101] leading-tight"><span className="opacity-50 mr-1.5 tabular-nums">0{i + 1}</span>{title}</div>
                    <div className="text-sm font-medium text-[#0d0101]/65">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fade-up inline-flex items-center gap-2 font-black text-sm uppercase tracking-wider text-[#0d0101] underline underline-offset-8 decoration-[#0d0101]/30 hover:decoration-[#0d0101]">
              <MessageCircle size={18} /> Prefere WhatsApp? (11) 98168-0809
            </a>
          </div>

          <div className="rounded-[32px] bg-[#0d0101]/[0.06] p-5 md:p-8">
            {done ? (
              <div className="done-anim flex flex-col items-center justify-center h-full py-16 text-center text-[#0d0101]">
                <div className="w-20 h-20 bg-[#0d0101] rounded-full flex items-center justify-center mb-8">
                  <Check size={36} className="text-[#ff5d00]" />
                </div>
                <h3 className="font-black text-3xl md:text-4xl mb-4">Sua mensagem entrou em órbita.</h3>
                <p className="text-xl font-semibold opacity-65">Retornamos em até 24h com um diagnóstico.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="contact-form space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { name: "nome" as const, label: "Nome completo", placeholder: "Seu nome", type: "text", testid: "input-nome" },
                      { name: "email" as const, label: "E-mail", placeholder: "voce@empresa.com", type: "email", testid: "input-email" },
                      { name: "whatsapp" as const, label: "WhatsApp", placeholder: "(00) 00000-0000", type: "tel", testid: "input-whatsapp" },
                      { name: "site" as const, label: "Site atual (opcional)", placeholder: "www.seusite.com.br", type: "text", testid: "input-site" },
                    ].map((f) => (
                      <FormField key={f.name} control={form.control} name={f.name} render={({ field }) => (
                        <FormItem className="form-field">
                          <FormLabel className="text-[#0d0101] font-bold text-xs uppercase tracking-wider">{f.label}</FormLabel>
                          <FormControl>
                            <Input type={f.type} placeholder={f.placeholder} {...field} className={inputCls} data-testid={f.testid} />
                          </FormControl>
                          <FormMessage className="text-[#4a0000] font-semibold text-xs" />
                        </FormItem>
                      )} />
                    ))}
                  </div>
                  <FormField control={form.control} name="faturamento" render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-[#0d0101] font-bold text-xs uppercase tracking-wider">Faturamento mensal aproximado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={`${inputCls} data-[placeholder]:text-[#0d0101]/45`} data-testid="select-faturamento">
                            <SelectValue placeholder="Selecione uma faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-black/10 rounded-2xl shadow-xl">
                          {[["ate20k", "Até R$20k"], ["20k-50k", "R$20k–50k"], ["50k-150k", "R$50k–150k"], ["150k+", "R$150k+"]].map(([v, l]) => (
                            <SelectItem key={v} value={v} className="text-[#0d0101] font-semibold cursor-pointer py-3 focus:bg-[#ff5d00]/10">{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#4a0000] font-semibold text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="servico" render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-[#0d0101] font-bold text-xs uppercase tracking-wider">Qual seu serviço/produto principal?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o que você vende e para quem. Quanto mais detalhe, melhor nosso diagnóstico."
                          className={`${inputCls} h-auto min-h-[120px] py-4 resize-none`}
                          {...field}
                          data-testid="textarea-servico"
                        />
                      </FormControl>
                      <FormMessage className="text-[#4a0000] font-semibold text-xs" />
                    </FormItem>
                  )} />
                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="form-field group w-full h-16 rounded-full bg-[#0d0101] text-[#ff5d00] hover:bg-black font-black text-sm uppercase tracking-widest inline-flex items-center justify-center gap-3 transition-transform hover:scale-[1.015] disabled:opacity-70"
                    data-testid="button-submit"
                  >
                    {form.formState.isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Enviar para a Orbara <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" /></>}
                  </button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Rodapé ───────────────────────────────────────────────────────────────

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const loop = gsap.to(".footer-marquee", { xPercent: -50, duration: 40, ease: "none", repeat: -1, scrollTrigger: whileVisible(ref.current) });
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.to(loop, { timeScale: (self.direction || 1) * (1 + Math.min(4, Math.abs(self.getVelocity()) / 400)), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: self.direction || 1, duration: 1, delay: 0.25 });
        },
      });
      gsap.from(".footer-cta-line", {
        yPercent: 100, opacity: 0, stagger: 0.1, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".footer-cta", start: "top 85%", once: true },
      });
    });
  }, { scope: ref });

  return (
    <footer ref={ref} className="bg-[#0d0101] text-[#fffafa] pt-24 pb-10 px-5 md:px-10 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,93,0,0.14),transparent_65%)] pointer-events-none" />
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="footer-cta flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20">
          <h2 className="font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.6rem, 7vw, 7.5rem)" }}>
            <span className="block overflow-hidden"><span className="footer-cta-line block">Vamos colocar sua</span></span>
            <span className="block overflow-hidden"><span className="footer-cta-line block text-[#ff5d00] italic pr-3">marca em órbita?</span></span>
          </h2>
          <Magnetic>
            <button
              onClick={() => scrollToId("contato")}
              className="group relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-[#ff5d00] text-[#0d0101] font-black uppercase tracking-wider text-sm flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <ArrowUpRight size={30} className="transition-transform duration-500 group-hover:rotate-45" />
              Fale com a gente
            </button>
          </Magnetic>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-14 border-b border-white/[0.08]">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <OrbaraLogo stroke="#fffafa" />
              <span className="font-black text-xl tracking-widest">ORBARA</span>
            </div>
            <p className="text-[#fffafa]/50 text-lg font-medium max-w-xs">Onde marcas encontram sua gravidade.</p>
          </div>
          <div>
            <span className="block text-xs font-black uppercase tracking-[0.3em] text-[#fffafa]/35 mb-5">Navegação</span>
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }} className="group inline-flex items-center text-sm font-semibold text-[#fffafa]/65 hover:text-[#ff5d00] transition-colors">
                    <span className="w-0 group-hover:w-4 group-hover:mr-2 h-px bg-[#ff5d00] transition-all duration-300" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="block text-xs font-black uppercase tracking-[0.3em] text-[#fffafa]/35 mb-5">Contato</span>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-[#fffafa]/65">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#ff5d00] transition-colors">
                  <MessageCircle size={16} /> (11) 98168-0809
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#ff5d00] transition-colors">
                  <Instagram size={16} /> @agenciaorbara
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Atendimento remoto em todo Brasil
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden py-10 select-none -mx-5 md:-mx-10" aria-hidden>
        <div className="footer-marquee flex w-max items-center whitespace-nowrap will-change-transform">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <span
                className="font-black leading-none tracking-[-0.04em] px-8 md:px-12"
                style={{
                  fontSize: "clamp(4.5rem, 16vw, 15rem)",
                  background: "linear-gradient(180deg, rgba(255,250,250,0.85) 0%, rgba(255,250,250,0.06) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ORBARA
              </span>
              <span className="mx-4 md:mx-8 opacity-50 shrink-0"><OrbaraLogo stroke="#ff5d00" size={64} /></span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#0d0101] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#0d0101] to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row justify-between items-center gap-5 pt-8 border-t border-white/[0.06] text-xs">
        <div className="text-[#fffafa]/35 font-medium">© {new Date().getFullYear()} Orbara. Todos os direitos reservados.</div>
        <button onClick={scrollToTop} className="group inline-flex items-center gap-2 text-[#fffafa]/50 hover:text-[#ff5d00] font-bold uppercase tracking-widest transition-colors">
          Voltar ao topo
          <span className="w-9 h-9 rounded-full border border-white/15 group-hover:border-[#ff5d00] flex items-center justify-center transition-all group-hover:-translate-y-1">
            <ArrowUp size={15} />
          </span>
        </button>
      </div>
    </footer>
  );
}
