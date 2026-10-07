/**
 * Medição de conversões do Google Ads (tag AW-18424280462, carregada no index.html).
 *
 * Preencha os rótulos com os das ações de conversão criadas no Google Ads
 * (Metas → Conversões → ação → "Configurar tag" → send_to: "AW-18424280462/<rótulo>").
 * Enquanto um rótulo estiver vazio, o evento vai só para o dataLayer (útil para depurar
 * e para uma futura configuração no GA4/GTM) e nenhuma conversão é enviada.
 */
export const GOOGLE_ADS_ID = "AW-18424280462";

export const CONVERSION_LABELS: Record<ConversionKind, string> = {
  lead: "", // ação "Lead — formulário"
  whatsapp: "", // ação "Clique no WhatsApp"
};

export type ConversionKind = "lead" | "whatsapp";

const EVENT_NAMES: Record<ConversionKind, string> = {
  lead: "lead_form_submit",
  whatsapp: "whatsapp_click",
};

type Gtag = (...args: unknown[]) => void;
type TrackingWindow = Window & { gtag?: Gtag; dataLayer?: unknown[] };

export function trackConversion(kind: ConversionKind, source: string) {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  w.dataLayer?.push({ event: EVENT_NAMES[kind], conversion_source: source });

  const label = CONVERSION_LABELS[kind];
  if (label && typeof w.gtag === "function") {
    w.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}`, conversion_source: source });
  }
}

/** Registra como conversão qualquer clique em link do WhatsApp (wa.me), com a origem em data-wa-source. */
export function trackWhatsAppClicks() {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.('a[href*="wa.me/"]');
    if (link) trackConversion("whatsapp", link.getAttribute("data-wa-source") ?? "desconhecido");
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
