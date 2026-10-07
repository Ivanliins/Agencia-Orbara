import { Link } from "wouter";
import { useEffect } from "react";
import { Check, Clock, Search, FileText, MessageCircle, ArrowLeft } from "lucide-react";
import { whatsappUrl } from "@/components/site/tokens";

/**
 * Página de obrigado do formulário (/obrigado, noindex).
 * Também serve para configurar a conversão de lead no Google Ads só pela URL
 * ("Carregamento de página" com URL contendo /obrigado), sem precisar de rótulo no código.
 */
const NEXT = [
  { icon: Clock, title: "Retorno em até 24h úteis", desc: "Um especialista lê suas respostas e chama você." },
  { icon: Search, title: "Diagnóstico gratuito", desc: "Olhamos seu site e sua presença no Google." },
  { icon: FileText, title: "Proposta sob medida", desc: "Plano claro, com prazos e investimento." },
];

export default function Thanks() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <main className="min-h-screen bg-[#0d0101] text-[#fffafa] flex items-center justify-center px-5 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,_#ff5d0024,_transparent)] pointer-events-none" />
      <div className="relative z-10 w-full max-w-3xl text-center">
        <div className="mx-auto mb-8 w-24 h-24 rounded-full border-2 border-[#ff5d00]/40 flex items-center justify-center relative">
          <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-[#ff5d00] shadow-[0_0_20px_#ff5d00]" />
          <Check size={40} className="text-[#ff5d00]" />
        </div>
        <h1 className="font-black tracking-tight leading-[0.95]" style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
          Recebemos seu contato. <span className="text-[#ff5d00] italic">Obrigado!</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-[#fffafa]/70">Sua mensagem entrou em órbita. Veja o que acontece agora:</p>

        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {NEXT.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="rounded-3xl bg-white/[0.04] border border-white/10 p-6">
              <span className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-[#ff5d00] text-[#0d0101] flex items-center justify-center"><Icon size={18} /></span>
                <span className="text-xs font-black text-[#ff5d00] tabular-nums">0{i + 1}</span>
              </span>
              <span className="block font-black">{title}</span>
              <span className="block text-sm text-[#fffafa]/60 mt-1">{desc}</span>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl("obrigado")}
            data-wa-source="obrigado"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25d366] text-[#0d0101] font-black text-sm uppercase tracking-wider px-7 py-4"
          >
            <MessageCircle size={18} /> Quer adiantar? Fale no WhatsApp
          </a>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#fffafa]/70 hover:text-[#fffafa]">
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
        </div>
      </div>
    </main>
  );
}
