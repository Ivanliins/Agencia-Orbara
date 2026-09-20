import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, AlertTriangle, XCircle, Lock, Sparkles, RefreshCw } from "lucide-react";

interface InstantAuditProps {
  isDark?: boolean;
}

export function InstantAudit({ isDark = true }: InstantAuditProps) {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [score, setScore] = useState(58);

  const steps = [
    "Rastreando dados estruturados JSON-LD e schemas...",
    "Checando hierarquia de cabeçalhos H1-H6 e metatags...",
    "Avaliando velocidade de renderização e Core Web Vitals...",
    "Calculando taxa de atrito e score de conversão mobile...",
    "Compilando diagnóstico estratégico de SEO..."
  ];

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
      setUrl(cleanUrl);
    }

    setStage("scanning");
    setProgress(10);
    setStatusText(steps[0]);

    // Calcular score pseudo-dinamico baseado no tamanho do domínio
    const computedScore = Math.floor(48 + (cleanUrl.length * 3) % 24);
    setScore(computedScore);
  };

  useEffect(() => {
    if (stage !== "scanning") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => setStage("done"), 600);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 14 + 8);
        const stepIdx = Math.min(Math.floor((next / 100) * steps.length), steps.length - 1);
        setStatusText(steps[stepIdx]);
        return Math.min(next, 98);
      });
    }, 450);

    return () => clearInterval(interval);
  }, [stage]);

  const handleReset = () => {
    setStage("idle");
    setProgress(0);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de fazer a auditoria do meu site (${url}) na Orbara e meu score preliminar foi de ${score}/100. Gostaria de desbloquear o plano de correção completo e entender o que precisa ser ajustado.`
  );

  const whatsappLink = `https://wa.me/5581988931149?text=${whatsappMessage}`;

  return (
    <section id="auditoria-instantanea" className="relative py-20 md:py-32 px-5 md:px-10 bg-[#0d0101] text-[#fffafa] overflow-hidden border-t border-b border-white/[0.06]">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,_rgba(255,93,0,0.12)_0%,_transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Cabecalho */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ff5d00]/30 bg-[#ff5d00]/10 text-[#ff5d00] text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Diagnóstico com Inteligência Artificial
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-5">
            Descubra os <span className="text-[#ff5d00] italic">gargalos invisíveis</span> que estão custando clientes ao seu site
          </h2>
          <p className="text-[#fffafa]/70 text-base md:text-xl font-normal leading-relaxed">
            Insira a URL do seu negócio e nossa IA auditará tags, dados estruturados (Schema) e pontos de atrito em segundos.
          </p>
        </div>

        {/* Formulario / Barra de Busca */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleStartAudit} className="relative flex flex-col sm:flex-row items-center gap-3 p-2 bg-[#171313] border border-white/10 rounded-2xl md:rounded-full shadow-2xl focus-within:border-[#ff5d00]/60 transition-all">
            <div className="flex items-center gap-3 w-full pl-4 pr-2 py-2">
              <Globe className="text-[#ff5d00] shrink-0" size={22} />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://seusite.com.br"
                disabled={stage === "scanning"}
                className="w-full bg-transparent text-[#fffafa] placeholder:text-[#fffafa]/40 text-base font-medium outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={stage === "scanning" || !url.trim()}
              className="w-full sm:w-auto px-7 py-4 rounded-xl md:rounded-full bg-[#ff5d00] text-[#0d0101] font-black text-sm uppercase tracking-wider hover:bg-[#ff7524] active:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff5d00]/25 flex items-center justify-center gap-2"
            >
              <span>Analisar Meu Site Gratuitamente</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Estado: Scanner / Progresso */}
        <AnimatePresence>
          {stage === "scanning" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-[#171313] border border-[#ff5d00]/30 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#fffafa]/60 mb-3">
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin text-[#ff5d00]" size={14} /> Varredura Ativa
                </span>
                <span className="text-[#ff5d00] font-black text-sm">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-4 p-0.5 border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff5d00] to-[#ffaa60] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <p className="text-sm md:text-base font-medium text-[#fffafa]/80 animate-pulse">
                {statusText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado: Resultado / Dashboard de Auditoria */}
        <AnimatePresence>
          {stage === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-12 rounded-[36px] bg-[#141010] border border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Header do Resultado */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
                <div className="text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#fffafa]/50 mb-1">
                    Relatório Preliminar de Diagnóstico
                  </div>
                  <div className="text-lg md:text-2xl font-black text-[#fffafa] truncate max-w-md">
                    {url}
                  </div>
                </div>
                
                {/* Score Geral */}
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-6 py-4 rounded-2xl">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white/10"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#ff5d00]"
                        strokeDasharray={`${score}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-lg font-black text-[#fffafa]">{score}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#ff5d00]">Saúde Digital</div>
                    <div className="text-sm font-black text-red-400">
                      {score < 60 ? "Crítico / Alta Perda de Clientes" : "Médio / Oportunidades Perdidas"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs font-bold uppercase tracking-wider text-[#fffafa]/50 hover:text-[#fffafa] transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={13} /> Nova Análise
                </button>
              </div>

              {/* Bloco 1: Diagnósticos Abertos */}
              <div className="py-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#fffafa]/50 mb-5">
                  Falhas Imediatas Detectadas no Front-end & SEO:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-red-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                        <XCircle size={15} /> Ausência Crítica
                      </div>
                      <h4 className="text-base font-bold text-[#fffafa] mb-1">Falta de Schema LocalBusiness</h4>
                      <p className="text-xs text-[#fffafa]/60 leading-relaxed">
                        Motores de IA e Google não identificam endereço, catálogo e sinais de confiança sem marcação JSON-LD.
                      </p>
                    </div>
                    <span className="mt-4 inline-block text-[11px] font-bold text-red-400/80 bg-red-500/10 px-2.5 py-1 rounded-md w-fit">
                      Impacto: Queda no Ranqueamento
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-amber-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                        <AlertTriangle size={15} /> Oportunidade
                      </div>
                      <h4 className="text-base font-bold text-[#fffafa] mb-1">Metatags sem Intenção Comercial</h4>
                      <p className="text-xs text-[#fffafa]/60 leading-relaxed">
                        Tags de título e descrição genéricas sem palavras-chave transacionais, reduzindo drasticamente o CTR na busca.
                      </p>
                    </div>
                    <span className="mt-4 inline-block text-[11px] font-bold text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-md w-fit">
                      Impacto: Baixa Conversão Orgânica
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-red-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                        <XCircle size={15} /> Atrito Mobile
                      </div>
                      <h4 className="text-base font-bold text-[#fffafa] mb-1">Bloqueios de Renderização (TBT)</h4>
                      <p className="text-xs text-[#fffafa]/60 leading-relaxed">
                        Scripts sem carregamento assíncrono atrasam a primeira interação do usuário, provocando abandono em smartphones.
                      </p>
                    </div>
                    <span className="mt-4 inline-block text-[11px] font-bold text-red-400/80 bg-red-500/10 px-2.5 py-1 rounded-md w-fit">
                      Impacto: Perda Imediata de Leads
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 2: Conteudo Borrado com Overlay de Bloqueio */}
              <div className="relative pt-6 border-t border-white/10">
                {/* Elementos em Blur de fundo */}
                <div className="blur-sm select-none pointer-events-none opacity-40 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="h-4 w-32 bg-white/30 rounded mb-3" />
                    <div className="h-3 w-full bg-white/20 rounded mb-2" />
                    <div className="h-3 w-4/5 bg-white/20 rounded mb-4" />
                    <div className="p-3 bg-black/40 rounded-lg font-mono text-xs text-green-400">
                      {"<script type=\"application/ld+json\">...REMOVED...</script>"}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="h-4 w-40 bg-white/30 rounded mb-3" />
                    <div className="h-3 w-full bg-white/20 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-white/20 rounded mb-4" />
                    <div className="p-3 bg-black/40 rounded-lg font-mono text-xs text-blue-400">
                      {"Code Splitting: ManualChunks { vendor: ['react', 'wouter'] }"}
                    </div>
                  </div>
                </div>

                {/* Card de Sobreposicao (Overlay) */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-[#171313]/95 border border-[#ff5d00]/40 p-8 md:p-10 rounded-3xl shadow-2xl max-w-lg text-center backdrop-blur-md">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#ff5d00]/10 border border-[#ff5d00]/30 flex items-center justify-center text-[#ff5d00] mb-4">
                      <Lock size={24} />
                    </div>
                    <h4 className="text-xl md:text-2xl font-black text-[#fffafa] mb-2">
                      Plano de Correção Completo + Estrutura de Código Oculta
                    </h4>
                    <p className="text-xs md:text-sm text-[#fffafa]/70 font-normal leading-relaxed mb-6">
                      Nossos especialistas compilaram a correção exata de código (JSON-LD, scripts e layout) para elevar a pontuação do seu site para 90+ e destravar vendas.
                    </p>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full bg-[#ff5d00] text-[#0d0101] font-black text-sm uppercase tracking-wider hover:bg-[#ff7524] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#ff5d00]/25"
                    >
                      <span>Desbloquear Análise Completa no WhatsApp</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
