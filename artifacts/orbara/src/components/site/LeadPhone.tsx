import { useRef } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { gsap, useGSAP, whileVisible } from "@/lib/motion";

/**
 * Celular da hero (desktop) recebendo leads: as notificações chegam uma a uma,
 * a mais nova no topo, o aparelho vibra a cada uma e o ciclo recomeça.
 * No HTML pré-renderizado (e com movimento reduzido) as três já aparecem.
 */
const NOTIFS = [
  { app: "WhatsApp", title: "Novo lead · Mariana", text: "Oi, quero um orçamento!", color: "#25d366", Icon: MessageCircle },
  { app: "Loja", title: "Venda aprovada", text: "Você vendeu +1", color: "#ff5d00", Icon: ShoppingBag },
  { app: "Banco", title: "Pix recebido", text: "Pix enviado!", amount: "R$ 1.490,00", color: "#32bcad", Icon: PixIcon },
];

function PixIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6.3" y="6.3" width="11.4" height="11.4" rx="2.6" transform="rotate(45 12 12)" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

export function LeadPhone() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".lp-phone", { y: 120, rotation: 8, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.6 });
      gsap.to(".lp-float", { y: -14, rotation: -1.5, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: whileVisible(ref.current) });

      // Notificações: em ordem de chegada (a mais nova entra no topo e empurra as outras)
      const items = gsap.utils.toArray<HTMLElement>(".lp-item").reverse();
      gsap.set(items, { height: 0, opacity: 0 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 1.6, scrollTrigger: whileVisible(ref.current) });
      items.forEach((el, i) => {
        const at = i * 1.5;
        tl.to(el, { height: "auto", duration: 0.45, ease: "power3.out" }, at)
          .fromTo(el, { opacity: 0, scale: 0.85, y: -24 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)" }, at + 0.05)
          .fromTo(".lp-shake", { x: 0 }, { x: 3, duration: 0.05, repeat: 7, yoyo: true, ease: "none" }, at)
          .fromTo(".lp-glow", { opacity: 0.35 }, { opacity: 0.9, duration: 0.3, yoyo: true, repeat: 1 }, at);
      });
      tl.to(items, { opacity: 0, y: 16, duration: 0.5, ease: "power2.in", stagger: 0.06 }, "+=2.6")
        .set(items, { height: 0 });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative" style={{ height: "min(74vh, 660px)", aspectRatio: "9 / 19" }}>
      <div className="lp-glow absolute -inset-10 rounded-[4rem] bg-[#ff5d00]/30 blur-3xl opacity-40" />
      <div className="lp-float relative w-full h-full">
        <div className="lp-phone lp-shake relative w-full h-full rounded-[3rem] bg-[#0b0b0d] p-[3.2%] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
          <span className="absolute -left-[3px] top-[20%] w-[3px] h-[7%] rounded-l bg-[#2a2a2a]" />
          <span className="absolute -right-[3px] top-[26%] w-[3px] h-[11%] rounded-r bg-[#2a2a2a]" />

          {/* Tela de bloqueio */}
          <div className="relative w-full h-full overflow-hidden rounded-[2.6rem] bg-[radial-gradient(120%_80%_at_70%_10%,#5a1f08_0%,#1a0905_45%,#07070a_100%)]">
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <ellipse cx="210" cy="140" rx="190" ry="70" fill="none" stroke="#ff5d00" strokeOpacity="0.5" />
              <ellipse cx="210" cy="140" rx="120" ry="44" fill="none" stroke="#ffaa60" strokeOpacity="0.4" strokeDasharray="4 8" />
              <circle cx="380" cy="140" r="5" fill="#ff5d00" />
            </svg>
            <span className="absolute top-[1.6%] left-1/2 -translate-x-1/2 w-[32%] h-[3.6%] rounded-full bg-black" />

            <div className="relative text-center text-white pt-[16%]">
              <div className="text-[11px] font-semibold text-white/70">Hoje</div>
              <div className="font-black leading-none tracking-tight mt-1" style={{ fontSize: "min(9vh, 76px)" }}>09:41</div>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.12] backdrop-blur ring-1 ring-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-[#25d366]" />
                </span>
                Leads chegando agora
              </span>
            </div>

            <div className="absolute left-[5%] right-[5%] top-[37%] flex flex-col">
              {NOTIFS.slice().reverse().map(({ app, title, text, amount, color, Icon }) => (
                <div key={title} className="lp-item overflow-hidden pb-2.5">
                  <div className="flex items-start gap-3 rounded-[1.4rem] bg-white/[0.14] backdrop-blur-xl ring-1 ring-white/15 px-3.5 py-3 text-white shadow-lg shadow-black/30">
                    <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-white" style={{ background: color }}>
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                        {app}
                        <span className="normal-case tracking-normal">agora</span>
                      </span>
                      <span className="block text-[13px] font-black leading-tight mt-0.5">{title}</span>
                      <span className="block text-[13px] leading-snug text-white/85">
                        {text}
                        {amount && <span className="block font-bold text-white">{amount}</span>}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <span className="absolute bottom-[1.8%] left-1/2 -translate-x-1/2 w-[34%] h-[5px] rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
