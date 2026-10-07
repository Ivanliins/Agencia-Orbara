import { useEffect, useRef, useState } from "react";
import { Menu, X, Sun, Moon, MessageCircle, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, scrollToId, scrollToTop, getLenis } from "@/lib/motion";
import { NAV_ITEMS, whatsappUrl } from "./tokens";

/** Cursor customizado: ponto + anel que cresce sobre elementos clicáveis. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    let shown = false;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const hot = (e.target as Element)?.closest?.("a, button, [role=button], input, textarea, select, label");
      gsap.to(ring.current, { scale: hot ? 1.9 : 1, backgroundColor: hot ? "rgba(255,93,0,0.12)" : "rgba(255,93,0,0)", duration: 0.3 });
      gsap.to(dot.current, { scale: hot ? 0 : 1, duration: 0.2 });
    };
    const down = () => gsap.to(ring.current, { scale: 0.7, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  });

  return (
    <>
      <div ref={ring} className="fixed top-0 left-0 z-[9999] pointer-events-none w-9 h-9 rounded-full border-[1.5px] border-[#ff5d00] opacity-0 hidden md:block" />
      <div ref={dot} className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-[#ff5d00] opacity-0 hidden md:block" />
    </>
  );
}

/** Barra de progresso de leitura no topo. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });
  });
  return <div ref={bar} className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left scale-x-0 bg-gradient-to-r from-[#ff5d00] to-[#ffaa60]" />;
}

export function OrbaraLogo({ stroke, size = 30 }: { stroke: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-4 -4 32 32" fill="none" className="overflow-visible">
      <circle cx="12" cy="12" r="10.5" stroke={stroke} strokeWidth="1.5" />
      <g className="animate-[spin_6s_linear_infinite]" style={{ transformOrigin: "12px 12px" }}>
        <circle cx="19.5" cy="4.5" r="3" fill="#ff5d00" />
        <circle cx="19.5" cy="4.5" r="1.5" fill="#ffaa60" />
      </g>
    </svg>
  );
}

export function Navbar({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // Esconde ao rolar para baixo, mostra ao rolar para cima
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 50);
        const hide = self.direction === 1 && y > 400;
        gsap.to(navRef.current, { yPercent: hide ? -110 : 0, duration: 0.4, ease: "power3.out", overwrite: true });
      },
    });
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => (self.isActive ? setActive(id) : setActive((cur) => (cur === id ? "" : cur))),
      });
    });
  });

  // Menu mobile em tela cheia
  useGSAP(() => {
    if (!menuRef.current) return;
    if (open) {
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(menuRef.current, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(".mobile-link", { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, delay: 0.25, ease: "expo.out" });
    } else {
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at 92% 4%)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => { gsap.set(menuRef.current, { display: "none" }); },
      });
    }
  }, { dependencies: [open], scope: menuRef });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) getLenis()?.stop();
    else getLenis()?.start();
  }, [open]);

  const go = (id: string) => { setOpen(false); scrollToId(id); };
  const onHero = !scrolled && !open;
  const fg = open ? "text-[#0d0101]" : onHero ? "text-white" : isDark ? "text-[#fffafa]" : "text-[#0d0101]";
  const shell = open
    ? "bg-transparent border-transparent"
    : scrolled
    ? isDark
      ? "bg-[#0d0101]/80 border-white/10 shadow-2xl shadow-black/40"
      : "bg-white/80 border-black/[0.06] shadow-lg shadow-black/[0.06]"
    : "bg-transparent border-transparent";

  return (
    <>
    <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 px-3 md:px-6 pt-3">
      <div className={`mx-auto max-w-7xl flex items-center justify-between rounded-full border backdrop-blur-xl transition-all duration-500 ${shell} ${scrolled ? "px-4 md:px-6 py-2.5" : "px-2 md:px-4 py-4"}`}>
        <button onClick={scrollToTop} className="flex items-center gap-2" aria-label="Voltar ao topo">
          <OrbaraLogo stroke={open ? "#0d0101" : onHero ? "#ffffff" : isDark ? "#fffafa" : "#0d0101"} />
          <span className={`font-black text-xl tracking-widest ${fg}`}>ORBARA</span>
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); go(id); }}
              className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                active === id && !onHero ? "text-[#ff5d00]" : `${fg} hover:text-[#ff5d00]`
              }`}
            >
              {label}
              <span className={`absolute left-1/2 -translate-x-1/2 bottom-0.5 h-1 w-1 rounded-full bg-[#ff5d00] transition-all duration-300 ${active === id && !onHero ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:border-[#ff5d00] hover:text-[#ff5d00] hover:rotate-45 ${fg} ${onHero ? "border-white/25" : isDark ? "border-white/15" : "border-black/10"}`}
            data-testid="button-theme-toggle"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => go("contato")}
            className="hidden sm:inline-flex items-center gap-2 bg-[#ff5d00] text-[#0d0101] font-black text-xs uppercase tracking-widest pl-5 pr-2 py-2 rounded-full hover:bg-[#ff7020] transition-colors group"
          >
            Fale conosco
            <span className="w-7 h-7 rounded-full bg-[#0d0101] text-[#ff5d00] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={14} />
            </span>
          </button>
          <button className={`lg:hidden w-10 h-10 flex items-center justify-center ${fg}`} onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </nav>

      <div ref={menuRef} className="lg:hidden fixed inset-0 z-40 hidden flex-col justify-center px-8 bg-[#ff5d00] text-[#0d0101]" style={{ clipPath: "circle(0% at 92% 4%)" }}>
        <span className="text-xs font-black uppercase tracking-[0.35em] opacity-50 mb-6">Navegação</span>
        {NAV_ITEMS.map(({ id, label }, i) => (
          <div key={id} className="overflow-hidden">
            <a href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }} className="mobile-link flex items-baseline gap-4 py-1.5 text-left font-black text-5xl tracking-tight">
              <span className="text-sm opacity-50 tabular-nums">0{i + 1}</span>
              {label}
            </a>
          </div>
        ))}
        <div className="overflow-hidden mt-10">
          <a href={whatsappUrl("menu")} data-wa-source="menu" target="_blank" rel="noopener noreferrer" className="mobile-link inline-flex items-center gap-3 bg-[#0d0101] text-[#ff5d00] font-black uppercase tracking-wider text-sm px-7 py-4 rounded-full">
            <MessageCircle size={18} /> Chamar no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

export function WhatsAppFab() {
  const ref = useRef<HTMLAnchorElement>(null);
  useGSAP(() => {
    // fromTo com valores finais explícitos: com "from", o botão podia terminar com escala 0 (invisível)
    gsap.fromTo(ref.current, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.9, delay: 1.5, ease: "back.out(2)" });
  });
  return (
    <a
      ref={ref}
      href={whatsappUrl("fab")}
      data-wa-source="fab"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 bg-[#ff5d00] text-[#0d0101] rounded-full pl-4 pr-5 py-3 flex items-center gap-2 shadow-2xl shadow-[#ff5d00]/30 hover:scale-105 transition-transform"
      data-testid="button-whatsapp"
    >
      <span className="relative flex">
        <span className="absolute inset-0 rounded-full bg-[#0d0101]/30 animate-ping" />
        <MessageCircle size={19} className="relative fill-current" />
      </span>
      <span className="font-bold text-sm">WhatsApp</span>
    </a>
  );
}
