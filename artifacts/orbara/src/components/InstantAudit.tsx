import React, { useState, useEffect, useRef } from "react";
import { Globe, ArrowRight, AlertTriangle, XCircle, CheckCircle2, Gauge, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { whatsappUrl } from "@/components/site/tokens";

type CheckStatus = "ok" | "warn" | "fail";
type AuditResult = { url: string; score: number; checks: { id: string; label: string; status: CheckStatus; detail: string }[] };
type SpeedData = { performance: number; lcpMs: number | null; tbtMs: number | null; cls: number | null };
type SpeedState = { state: "idle" | "loading" } | { state: "ok"; data: SpeedData } | { state: "fail"; message?: string };

const STATUS_UI: Record<CheckStatus, { Icon: typeof CheckCircle2; text: string; border: string; label: string }> = {
  ok: { Icon: CheckCircle2, text: "text-emerald-400", border: "border-emerald-500/20", label: "OK" },
  warn: { Icon: AlertTriangle, text: "text-amber-400", border: "border-amber-500/25", label: "Melhorar" },
  fail: { Icon: XCircle, text: "text-red-400", border: "border-red-500/25", label: "Corrigir" },
};

const secs = (ms: number | null) => (ms == null ? "—" : `${(ms / 1000).toFixed(1).replace(".", ",")} s`);

interface InstantAuditProps {
  isDark?: boolean;
}

export function InstantAudit({ isDark = true }: InstantAuditProps) {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [isFocused, setIsFocused] = useState(false);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");

  const exampleSites = [
    "https://suaempresa.com.br",
    "https://lojavirtual.com.br",
    "https://clinicasorriso.com.br",
    "https://restaurantesabor.com.br"
  ];

  // Efeito de digitação no placeholder (pausa quando o usuário interage)
  useEffect(() => {
    if (isFocused || url) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setTypedPlaceholder(exampleSites[0]);
      return;
    }

    let siteIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const site = exampleSites[siteIdx];
      if (!deleting) {
        charIdx++;
        setTypedPlaceholder(site.slice(0, charIdx));
        if (charIdx === site.length) {
          deleting = true;
          timeout = setTimeout(tick, 1800);
          return;
        }
        timeout = setTimeout(tick, 70 + Math.random() * 60);
      } else {
        charIdx--;
        setTypedPlaceholder(site.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          siteIdx = (siteIdx + 1) % exampleSites.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 35);
      }
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [isFocused, url]);

  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState<SpeedState>({ state: "idle" });
  const runId = useRef(0);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
      setUrl(cleanUrl);
    }

    const id = ++runId.current;
    setStage("scanning");
    setResult(null);
    setError("");
    setSpeed({ state: "loading" });

    // Velocidade (Google PageSpeed) roda em paralelo e pode levar até ~1 min
    fetch(`/api/pagespeed?url=${encodeURIComponent(cleanUrl)}`)
      .then((r) => r.json())
      .then((d) => id === runId.current && setSpeed(d?.ok ? { state: "ok", data: d } : { state: "fail", message: d?.error }))
      .catch(() => id === runId.current && setSpeed({ state: "fail" }));

    try {
      const r = await fetch(`/api/audit?url=${encodeURIComponent(cleanUrl)}`);
      const d = await r.json();
      if (id !== runId.current) return;
      if (!d?.ok) {
        setError(d?.error ?? "Não conseguimos analisar esse site agora.");
        setStage("error");
        return;
      }
      setResult(d);
      setStage("done");
    } catch {
      if (id !== runId.current) return;
      setError("Não conseguimos analisar esse site agora. Tente de novo em instantes.");
      setStage("error");
    }
  };

  const handleReset = () => {
    runId.current++;
    setStage("idle");
    setResult(null);
    setSpeed({ state: "idle" });
  };

  const pending = result?.checks.filter((c) => c.status !== "ok") ?? [];
  const whatsappText = result
    ? pending.length
      ? `Olá! Fiz o diagnóstico gratuito do meu site (${result.url}) na Orbara: nota ${result.score}/100. Pontos a melhorar: ${pending.map((c) => c.label).join(", ")}. Quero ajuda para corrigir.`
      : `Olá! Fiz o diagnóstico gratuito do meu site (${result.url}) na Orbara e tirei ${result.score}/100 no básico técnico. Quero conversar sobre SEO, conversão e anúncios.`
    : `Olá! Tentei fazer o diagnóstico gratuito do meu site (${url}) na Orbara e quero ajuda.`;
  const whatsappLink = whatsappUrl("auditoria", whatsappText);
  const verdict = result ? (result.score >= 85 ? { label: "Bom no básico técnico", color: "text-emerald-400", ring: "text-emerald-400" } : result.score >= 60 ? { label: "Pode melhorar", color: "text-amber-400", ring: "text-amber-400" } : { label: "Precisa de atenção", color: "text-red-400", ring: "text-red-400" }) : null;

  return (
    <section id="auditoria-instantanea" className="relative py-20 md:py-32 px-5 md:px-10 bg-[#0d0101] text-[#fffafa] overflow-hidden border-t border-b border-white/[0.06]">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,_rgba(255,93,0,0.12)_0%,_transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Cabecalho */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ff5d00]/30 bg-[#ff5d00]/10 text-[#ff5d00] text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Diagnóstico gratuito em segundos
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-5">
            Descubra os <span className="text-[#ff5d00] italic">gargalos invisíveis</span> que estão custando clientes ao seu site
          </h2>
          <p className="text-[#fffafa]/70 text-base md:text-xl font-normal leading-relaxed">
            Digite o endereço do seu site: checamos de verdade título, descrição, H1, dados estruturados, versão para celular e a velocidade medida pelo Google.
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
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? "https://seusite.com.br" : `${typedPlaceholder}|`}
                aria-label="URL do seu site"
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

        {/* Estado: analisando */}
        {stage === "scanning" && (
          <div role="status" className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-[#171313] border border-[#ff5d00]/30 shadow-2xl text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#fffafa]/60 mb-4">
              <RefreshCw className="animate-spin text-[#ff5d00]" size={14} /> Analisando
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/10 relative">
              <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-[#ff5d00] to-[#ffaa60] animate-[audit-bar_1.4s_ease-in-out_infinite]" />
            </div>
            <p className="text-sm md:text-base font-medium text-[#fffafa]/80">Baixando a página e conferindo cada item. Leva poucos segundos.</p>
          </div>
        )}

        {/* Estado: erro ao acessar o site */}
        {stage === "error" && (
          <div role="alert" className="animate-in fade-in duration-500 max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-[#171313] border border-red-500/30 text-center">
            <XCircle className="mx-auto text-red-400 mb-3" size={28} />
            <p className="font-bold text-[#fffafa] mb-1">Não deu para analisar esse endereço</p>
            <p className="text-sm text-[#fffafa]/70 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleReset} className="px-6 py-3 rounded-full border border-white/15 text-xs font-black uppercase tracking-wider hover:border-white/40 transition-colors">
                Tentar outro endereço
              </button>
              <a href={whatsappLink} data-wa-source="auditoria-erro" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-[#ff5d00] text-[#0d0101] text-xs font-black uppercase tracking-wider">
                Pedir análise pelo WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Estado: resultado */}
        {stage === "done" && result && verdict && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 p-6 md:p-12 rounded-[36px] bg-[#141010] border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div className="text-center md:text-left min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-[#fffafa]/50 mb-1">Diagnóstico da página</div>
                <div className="text-lg md:text-2xl font-black text-[#fffafa] truncate max-w-md">{result.url}</div>
              </div>

              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-6 py-4 rounded-2xl">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                    <path className="text-white/10" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={verdict.ring} strokeDasharray={`${result.score}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-lg font-black text-[#fffafa]">{result.score}</span>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#ff5d00]">Nota técnica</div>
                  <div className={`text-sm font-black ${verdict.color}`}>{verdict.label}</div>
                  <div className="text-[11px] text-[#fffafa]/50">{result.checks.length - pending.length} de {result.checks.length} itens OK</div>
                </div>
              </div>

              <button onClick={handleReset} className="text-xs font-bold uppercase tracking-wider text-[#fffafa]/50 hover:text-[#fffafa] transition-colors flex items-center gap-1.5">
                <RefreshCw size={13} /> Nova análise
              </button>
            </div>

            {/* Velocidade (Google PageSpeed) */}
            <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 sm:w-64 shrink-0">
                <span className="w-10 h-10 rounded-xl bg-[#ff5d00]/15 text-[#ff5d00] flex items-center justify-center"><Gauge size={20} /></span>
                <div>
                  <div className="text-sm font-bold">Velocidade no celular</div>
                  <div className="text-[11px] text-[#fffafa]/50">Medida pelo Google PageSpeed</div>
                </div>
              </div>
              {speed.state === "loading" && (
                <div className="flex items-center gap-2 text-sm text-[#fffafa]/70"><Loader2 size={16} className="animate-spin text-[#ff5d00]" /> Medindo… pode levar até 1 minuto.</div>
              )}
              {speed.state === "ok" && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span>
                    <b className={`text-2xl font-black ${speed.data.performance >= 90 ? "text-emerald-400" : speed.data.performance >= 50 ? "text-amber-400" : "text-red-400"}`}>{speed.data.performance}</b>
                    <span className="text-[#fffafa]/50">/100</span>
                  </span>
                  <span className="text-[#fffafa]/70">Maior conteúdo aparece em <b className="text-[#fffafa]">{secs(speed.data.lcpMs)}</b></span>
                  <span className="text-[#fffafa]/70">Travamentos: <b className="text-[#fffafa]">{speed.data.tbtMs == null ? "—" : `${speed.data.tbtMs} ms`}</b></span>
                </div>
              )}
              {speed.state === "fail" && <div className="text-sm text-[#fffafa]/60">{speed.message ?? "O Google não conseguiu medir a velocidade agora."}</div>}
            </div>

            {/* Itens verificados */}
            <div className="py-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#fffafa]/50 mb-5">O que verificamos</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...result.checks].sort((a, b) => ["fail", "warn", "ok"].indexOf(a.status) - ["fail", "warn", "ok"].indexOf(b.status)).map((c) => {
                  const ui = STATUS_UI[c.status];
                  return (
                    <li key={c.id} className={`p-4 rounded-2xl bg-white/[0.02] border ${ui.border} flex gap-3`}>
                      <ui.Icon size={18} className={`${ui.text} shrink-0 mt-0.5`} aria-hidden />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#fffafa]">{c.label}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${ui.text}`}>{ui.label}</span>
                        </div>
                        <p className="text-xs text-[#fffafa]/60 leading-relaxed mt-1 break-words">{c.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Próximo passo */}
            <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center gap-5 justify-between">
              <div className="max-w-xl">
                <h4 className="text-xl md:text-2xl font-black text-[#fffafa] mb-1">
                  {pending.length ? `Quer ajuda com ${pending.length === 1 ? "esse ponto" : `esses ${pending.length} pontos`}?` : "O básico está em ordem. Quer ir além?"}
                </h4>
                <p className="text-sm text-[#fffafa]/65">
                  {pending.length
                    ? "Mande o resultado pelo WhatsApp: um especialista revisa e responde com o que corrigir primeiro."
                    : "SEO, conversão e anúncios vão além dessas checagens. Conte o que você quer melhorar."}
                </p>
              </div>
              <a
                href={whatsappLink}
                data-wa-source="auditoria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 py-4 px-7 rounded-full bg-[#ff5d00] text-[#0d0101] font-black text-sm uppercase tracking-wider hover:bg-[#ff7524] transition-colors shadow-xl shadow-[#ff5d00]/25 shrink-0"
              >
                Falar com um especialista <ArrowRight size={16} />
              </a>
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-[#fffafa]/40">
              Análise automática do HTML da página informada (itens técnicos básicos) e da velocidade medida pelo Google. Não substitui uma auditoria completa de SEO e conversão.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
