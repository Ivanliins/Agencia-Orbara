import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Inclinação 3D + spotlight que segue o cursor. */
export function useTilt<T extends HTMLElement>(strength = 8) {
  const ref = useRef<T>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    gsap.set(el, { transformPerspective: 1000 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * strength);
      rx((0.5 - py) * strength);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  return ref;
}

/** Botão magnético que é atraído pelo cursor. */
export function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.35);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  return <div ref={ref} className={`inline-block ${className}`}>{children}</div>;
}
