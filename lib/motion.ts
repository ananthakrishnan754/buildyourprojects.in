"use client";

import type Lenis from "lenis";

export type MotionKit = {
  gsap: (typeof import("gsap"))["gsap"];
  ScrollTrigger: (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];
};

export type FlipKit = MotionKit & {
  Flip: (typeof import("gsap/Flip"))["Flip"];
};

let motionPromise: Promise<MotionKit> | null = null;
let flipPromise: Promise<FlipKit> | null = null;
let lenisInstance: Lenis | null = null;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function loadMotion(): Promise<MotionKit> {
  if (!motionPromise) {
    motionPromise = (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }
  return motionPromise;
}

export function loadFlip(): Promise<FlipKit> {
  if (!flipPromise) {
    flipPromise = (async () => {
      const kit = await loadMotion();
      const { Flip } = await import("gsap/Flip");
      kit.gsap.registerPlugin(Flip);
      return { ...kit, Flip };
    })();
  }
  return flipPromise;
}

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToTarget(target: string | HTMLElement) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -80 });
    return;
  }

  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  element?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}
