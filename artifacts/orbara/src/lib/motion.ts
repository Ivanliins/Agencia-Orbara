import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

let lenis: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Inicia o scroll suave (Lenis) sincronizado com o ScrollTrigger. Retorna a função de limpeza. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

/** Rola até uma seção pelo id, descontando a altura da navbar. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Anima títulos marcados com `.split-reveal` (letra por letra) e elementos
 * `.fade-up` (sobem com fade) dentro do escopo, ao entrarem na tela.
 */
export function revealIn(scope: Element | null) {
  if (!scope) return;
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    scope.querySelectorAll<HTMLElement>(".split-reveal").forEach((el) => {
      SplitText.create(el, {
        type: "chars,words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            rotationX: -90,
            opacity: 0,
            transformOrigin: "50% 100%",
            stagger: 0.022,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    });

    gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(".fade-up")).forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: Number(el.dataset.delay ?? 0),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    scope.querySelectorAll<HTMLElement>(".stagger-up").forEach((group) => {
      gsap.from(group.children, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 88%", once: true },
      });
    });
  });
  return mm;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
