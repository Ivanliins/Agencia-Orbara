import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Film, Monitor, Smartphone, Play, Volume2, X, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, getLenis, whileVisible } from "@/lib/motion";

/**
 * Cases de Motion Graphics.
 * Cada vídeo tem duas versões: horizontal (16:9, desktop) e vertical (9:16, mobile).
 * Arquivos em `public/motion/` — comprimidos para web com ffmpeg (720p, H.264, faststart).
 */
const CLUBE_DO_MED = {
  client: "Clube do Med",
  segment: "Insumos para clínicas · Comerciais animados",
  title: "Comerciais que explicam a entrega rápida em segundos",
  desc: "Criamos comerciais em motion graphics para o Clube do Med, com tipografia cinética, mapas animados e interface de produto — entregues nos formatos horizontal e vertical para site, YouTube, Reels e Stories.",
  tags: ["Motion 2D", "Tipografia cinética", "16:9 + 9:16"],
  videos: [
    {
      id: "sao-paulo",
      label: "Entrega em São Paulo",
      hook: "“São Paulo não para. E a sua clínica também não.”",
      duration: "0:31",
      desktop: "/motion/clube-do-med-sp-16x9.mp4",
      desktopPoster: "/motion/clube-do-med-sp-16x9.jpg",
      mobile: "/motion/clube-do-med-sp-9x16.mp4",
      mobilePoster: "/motion/clube-do-med-sp-9x16.jpg",
    },
    {
      id: "agilidade",
      label: "Agilidade nos insumos",
      hook: "“Quer agilidade… e faltou insumo?”",
      duration: "0:34",
      desktop: "/motion/clube-do-med-2-16x9.mp4",
      desktopPoster: "/motion/clube-do-med-2-16x9.jpg",
      mobile: "/motion/clube-do-med-2-9x16.mp4",
      mobilePoster: "/motion/clube-do-med-2-9x16.jpg",
    },
  ],
};

/** Filme de marca da Orbara — também usado no Manifesto da home. */
export const ORBARA_FILM = {
  id: "impacto",
  label: "Filme Orbara Impacto",
  hook: "“Tudo começa com um ponto.”",
  duration: "0:30",
  desktop: "/motion/orbara-impacto-16x9.mp4",
  desktopPoster: "/motion/orbara-impacto-16x9.jpg",
  mobile: "/motion/orbara-impacto-9x16.mp4",
  mobilePoster: "/motion/orbara-impacto-9x16.jpg",
};

const ORBARA = {
  client: "Orbara",
  segment: "Branding · Filme de marca",
  title: "Orbara Impacto: do primeiro ponto ao 1º lugar do Google",
  desc: "Nosso filme de marca em 30 segundos: um ponto vira partículas, as partículas desenham um site, o site sobe do fundo da busca até o topo e o WhatsApp não para. Narração, trilha original e animação feitas pelo nosso núcleo de motion, nos formatos horizontal e vertical.",
  tags: ["Filme de marca", "Partículas + 3D", "16:9 + 9:16"],
  reverse: true,
  videos: [ORBARA_FILM],
};

export type MotionCase = {
  client: string;
  segment: string;
  title: string;
  desc: string;
  tags: string[];
  reverse?: boolean;
  videos: typeof CLUBE_DO_MED.videos;
};

export const MOTION_CASES: Record<string, MotionCase> = {
  orbara: ORBARA,
  "clube-do-med": CLUBE_DO_MED,
};

type Video = MotionCase["videos"][number];
export type Format = "desktop" | "mobile";

function Laptop({ video, vref }: { video: Video; vref: React.RefObject<HTMLVideoElement | null> }) {
  return (
    <div className="mc-laptop relative w-full" style={{ perspective: 1600 }}>
      <div className="mc-lid relative rounded-t-[18px] md:rounded-t-[22px] bg-[#1b1b1f] p-[2.2%] pb-[3%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10" style={{ transformOrigin: "50% 100%" }}>
        <span className="absolute top-[1%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#333]" />
        <div className="relative aspect-video overflow-hidden rounded-[6px] bg-black">
          <video
            ref={vref}
            key={video.desktop}
            src={video.desktop}
            poster={video.desktopPoster}
            muted
            loop
            playsInline
            preload="metadata"
            className="mc-screen absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.1]" />
        </div>
      </div>
      <div className="relative mx-[-5%] h-[10px] md:h-[14px] rounded-b-[14px] bg-gradient-to-b from-[#d6d6db] to-[#9a9aa2]">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[14%] h-[45%] rounded-b-md bg-[#8a8a92]" />
      </div>
    </div>
  );
}

function Phone({ video, vref }: { video: Video; vref: React.RefObject<HTMLVideoElement | null> }) {
  return (
    <div className="mc-phone relative w-full rounded-[2.2rem] md:rounded-[2.6rem] bg-[#111] p-[5%] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)] ring-1 ring-white/15">
      <span className="absolute -left-[3px] top-[22%] w-[3px] h-[8%] rounded-l bg-[#2a2a2a]" />
      <span className="absolute -right-[3px] top-[28%] w-[3px] h-[12%] rounded-r bg-[#2a2a2a]" />
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.7rem] md:rounded-[2rem] bg-black">
        <video
          ref={vref}
          key={video.mobile}
          src={video.mobile}
          poster={video.mobilePoster}
          muted
          loop
          playsInline
          preload="metadata"
          className="mc-screen absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute top-[2.5%] left-1/2 -translate-x-1/2 w-[32%] h-[3.2%] rounded-full bg-black" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.12]" />
      </div>
    </div>
  );
}

export function Lightbox({ client, video, format, onFormat, onClose }: { client: string; video: Video; format: Format; onFormat: (f: Format) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const close = () => gsap.to(ref.current, { opacity: 0, duration: 0.25, onComplete: onClose });

  useGSAP(() => {
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(".lb-panel", { scale: 0.88, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
  }, { scope: ref });

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    getLenis()?.stop();
    return () => {
      window.removeEventListener("keydown", esc);
      getLenis()?.start();
    };
  }, []);

  const src = format === "desktop" ? video.desktop : video.mobile;
  const poster = format === "desktop" ? video.desktopPoster : video.mobilePoster;

  return (
    <div ref={ref} onClick={close} className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10" data-lenis-prevent>
      <div onClick={(e) => e.stopPropagation()} className="lb-panel relative w-full flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4 w-full max-w-5xl justify-between">
          <div className="inline-flex p-1 rounded-full bg-white/10">
            {(["desktop", "mobile"] as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => onFormat(f)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${format === f ? "bg-[#ff5d00] text-[#0d0101]" : "text-white/70 hover:text-white"}`}
              >
                {f === "desktop" ? <Monitor size={14} /> : <Smartphone size={14} />}
                {f === "desktop" ? "16:9" : "9:16"}
              </button>
            ))}
          </div>
          <button onClick={close} aria-label="Fechar vídeo" className="w-10 h-10 rounded-full bg-[#ff5d00] text-[#0d0101] flex items-center justify-center hover:rotate-90 transition-transform duration-300">
            <X size={18} />
          </button>
        </div>
        <video
          key={src}
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className={`rounded-3xl bg-black shadow-2xl shadow-[#ff5d00]/20 ${format === "desktop" ? "w-full max-w-5xl aspect-video" : "h-[72vh] aspect-[9/16]"}`}
        />
        <div className="mt-4 text-center text-[#fffafa]">
          <h4 className="font-black text-lg">{client} · {video.label}</h4>
        </div>
      </div>
    </div>
  );
}

export function MotionShowcase({ caseId }: { caseId: string }) {
  const data = MOTION_CASES[caseId];
  const ref = useRef<HTMLDivElement>(null);
  const laptopVideo = useRef<HTMLVideoElement>(null);
  const phoneVideo = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<Format | null>(null);
  const inView = useRef(false);
  const video = data.videos[active];

  const playBoth = () => {
    [laptopVideo.current, phoneVideo.current].forEach((v) => v?.play().catch(() => {}));
  };
  const pauseBoth = () => {
    [laptopVideo.current, phoneVideo.current].forEach((v) => v?.pause());
  };

  // Entrada dos dispositivos e reprodução só quando visível
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      end: "bottom 10%",
      onToggle: (self) => {
        inView.current = self.isActive;
        if (self.isActive) playBoth();
        else pauseBoth();
      },
    });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
      tl.from(".mc-lid", { rotationX: -75, opacity: 0, duration: 1.4, ease: "expo.out" })
        .from(".mc-phone-wrap", { y: 160, rotation: 14, opacity: 0, duration: 1.2, ease: "expo.out" }, 0.35)
        .from(".mc-info > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, 0.2)
        .from(".mc-chip", { scale: 0, opacity: 0, stagger: 0.1, duration: 0.6, ease: "back.out(2.5)" }, 0.9);

      gsap.to(".mc-phone-float", { y: -14, rotation: 1.5, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: whileVisible(ref.current) });
      gsap.to(".mc-phone-wrap", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to(".mc-glow", { scale: 1.2, opacity: 0.9, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: whileVisible(ref.current) });
    });
  }, { scope: ref });

  // Troca de comercial: transição nas telas e reinicia os dois vídeos juntos
  const switchTo = (i: number) => {
    if (i === active) return;
    gsap.to(ref.current!.querySelectorAll(".mc-screen"), {
      opacity: 0,
      scale: 1.06,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setActive(i),
    });
  };

  useEffect(() => {
    const screens = ref.current?.querySelectorAll(".mc-screen");
    if (screens) gsap.fromTo(screens, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    if (inView.current) playBoth();
  }, [active]);

  return (
    <div ref={ref} className="case-card relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#0d0101] text-[#fffafa] border border-white/[0.08]">
      <div className={`mc-glow absolute ${data.reverse ? "left-[70%]" : "left-[30%]"} top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,93,0,0.28),transparent_65%)] opacity-60 pointer-events-none`} />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 35% 50%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 35% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className={`relative grid grid-cols-1 gap-10 lg:gap-6 p-6 md:p-12 lg:p-14 items-center ${data.reverse ? "lg:grid-cols-[1fr_1.45fr]" : "lg:grid-cols-[1.45fr_1fr]"}`}>
        {/* Dispositivos */}
        <div className={`relative pr-[18%] pb-[8%] md:pr-[20%] ${data.reverse ? "lg:order-2" : ""}`}>
          <Laptop video={video} vref={laptopVideo} />
          <div className="mc-phone-wrap absolute right-0 bottom-0 w-[30%] md:w-[26%]">
            <div className="mc-phone-float">
              <Phone video={video} vref={phoneVideo} />
            </div>
          </div>
          <span className="mc-chip absolute -top-3 left-4 md:left-6 inline-flex items-center gap-1.5 rounded-full bg-white text-[#0d0101] text-[10px] md:text-[11px] font-black uppercase tracking-wider px-3 py-1.5 shadow-xl">
            <Monitor size={12} /> Desktop 16:9
          </span>
          <span className="mc-chip absolute right-[2%] -bottom-4 md:bottom-[-1.2rem] inline-flex items-center gap-1.5 rounded-full bg-[#ff5d00] text-[#0d0101] text-[10px] md:text-[11px] font-black uppercase tracking-wider px-3 py-1.5 shadow-xl">
            <Smartphone size={12} /> Mobile 9:16
          </span>
        </div>

        {/* Informações */}
        <div className={`mc-info flex flex-col ${data.reverse ? "lg:order-1" : ""}`}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#ff5d00] text-[#0d0101]">
              <Film size={11} /> Motion Graphics
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#fffafa]/50">{data.segment}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff5d00]"><Sparkles size={18} /></span>
            <span className="font-black text-lg">{data.client}</span>
          </div>
          <h3 className="font-black text-2xl md:text-3xl lg:text-[2.1rem] leading-[1.08] tracking-tight mb-4">{data.title}</h3>
          <p className="text-sm md:text-base leading-relaxed text-[#fffafa]/65 mb-6">{data.desc}</p>

          {/* Seletor de comercial */}
          <div className="flex flex-col gap-2 mb-6">
            {data.videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => switchTo(i)}
                className={`group text-left flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all duration-300 ${
                  active === i ? "border-[#ff5d00] bg-[#ff5d00]/10" : "border-white/10 hover:border-white/25"
                }`}
              >
                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${active === i ? "bg-[#ff5d00] text-[#0d0101]" : "bg-white/10 text-white"}`}>
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-black text-sm">{data.videos.length > 1 ? `Comercial ${i + 1} · ` : ""}{v.label}</span>
                  <span className="block text-xs text-[#fffafa]/50 truncate italic">{v.hook}</span>
                </span>
                <span className="text-xs font-bold tabular-nums text-[#fffafa]/50">{v.duration}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-7">
            {data.tags.map((t) => (
              <span key={t} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#ff5d00]/30 text-[#ffaa60]">{t}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setLightbox("desktop")}
              className="inline-flex items-center gap-2 bg-[#ff5d00] text-[#0d0101] font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-full hover:bg-[#ff7020] transition-colors"
            >
              <Volume2 size={15} /> Assistir com som
            </button>
            <button
              onClick={() => setLightbox("mobile")}
              className="inline-flex items-center gap-2 border border-white/20 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-full hover:border-[#ff5d00] hover:text-[#ff5d00] transition-colors"
            >
              <Smartphone size={15} /> Ver vertical
            </button>
          </div>
        </div>
      </div>

      {lightbox && createPortal(<Lightbox client={data.client} video={video} format={lightbox} onFormat={setLightbox} onClose={() => setLightbox(null)} />, document.body)}
    </div>
  );
}
