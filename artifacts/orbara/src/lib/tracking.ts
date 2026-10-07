/**
 * Medição de conversões do Google Ads (tag AW-18424280462, carregada no index.html).
 *
 * Rótulos das ações de conversão da conta "Agência Orbara" (464-582-6023), criadas em 07/10/2026
 * (send_to: "AW-18424280462/<rótulo>"). Todo evento também vai para o dataLayer.
 * Se um rótulo ficar vazio, nenhuma conversão é enviada para aquela ação.
 */
export const GOOGLE_ADS_ID = "AW-18424280462";

export const CONVERSION_LABELS: Record<ConversionKind, string> = {
  lead: "QVovCNeL_JMdEI7rsNFE", // ação "Lead — Formulário do site" (id 7826507223)
  whatsapp: "f7kyCNqL_JMdEI7rsNFE", // ação "Contato — WhatsApp" (id 7826507226)
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
