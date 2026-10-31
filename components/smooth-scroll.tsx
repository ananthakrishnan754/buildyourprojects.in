"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let lenis: import("lenis").default | null = null;
    let frame = 0;

    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };

    const start = async () => {
      if (disposed || media.matches || lenis) return;
      const { default: Lenis } = await import("lenis");
      if (disposed || media.matches) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const onMotionChange = () => {
      if (media.matches) stop();
      else void start();
    };

    void start();
    media.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      media.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);

  return null;
}
