export const ORANGE = "#ff5d00";
export const WHATSAPP_URL = "https://wa.me/5511981680809";
export const INSTAGRAM_URL = "https://www.instagram.com/agenciaorbara";

export const NAV_ITEMS = [
  { id: "manifesto", label: "Manifesto" },
  { id: "servicos", label: "Serviços" },
  { id: "seo", label: "SEO" },
  { id: "cases", label: "Cases" },
  { id: "planos", label: "Planos" },
  { id: "contato", label: "Contato" },
];

/** Classes de cor que mudam com o tema claro/escuro. */
export function tokens(isDark: boolean) {
  return {
    bg: isDark ? "bg-[#0d0101]" : "bg-white",
    altBg: isDark ? "bg-[#130808]" : "bg-[#f7f5f5]",
    fg: isDark ? "text-[#fffafa]" : "text-[#0d0101]",
    fgMuted: isDark ? "text-[#fffafa]/60" : "text-[#0d0101]/60",
    fgFaint: isDark ? "text-[#fffafa]/40" : "text-[#0d0101]/40",
    border: isDark ? "border-white/10" : "border-black/[0.08]",
    card: isDark ? "bg-white/[0.03] border border-white/[0.08]" : "bg-white border border-black/[0.07]",
    hairline: isDark ? "bg-white/10" : "bg-black/10",
  };
}
