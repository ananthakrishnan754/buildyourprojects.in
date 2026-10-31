"use client";

import { useEffect } from "react";
import {
  loadMotion,
  prefersReducedMotion,
  scrollToTarget,
  setLenis,
} from "@/lib/motion";

export function MotionProvider() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let lenis: import("lenis").default | null = null;
    let ticker: ((time: number) => void) | null = null;

    const mark = (mode: "on" | "reduced") => {
      document.documentElement.dataset.motion = mode;
      window.dispatchEvent(new CustomEvent("byp:motionchange", { detail: mode }));
    };

    const start = async () => {
      if (disposed || media.matches || lenis) return;

      const [{ default: Lenis }, kit] = await Promise.all([
        import("lenis"),
        loadMotion(),
      ]);

      if (disposed || media.matches) return;

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", kit.ScrollTrigger.update);

      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      kit.gsap.ticker.add(ticker);
      kit.gsap.ticker.lagSmoothing(0);
      kit.ScrollTrigger.refresh();

      mark("on");
    };

    const stop = () => {
      const currentTicker = ticker;
      if (currentTicker) {
        void loadMotion().then(({ gsap }) => gsap.ticker.remove(currentTicker));
        ticker = null;
      }
      lenis?.destroy();
      lenis = null;
      setLenis(null);
      mark("reduced");
    };

    const onMotionChange = () => {
      if (media.matches) stop();
      else void start();
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor) return;
      if (anchor.classList.contains("skip-link")) return;

      const url = new URL(anchor.getAttribute("href") ?? "", window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.getElementById(url.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      scrollToTarget(target);
      window.history.pushState(null, "", url.hash);
    };

    const reduceInitially = prefersReducedMotion();
    mark(reduceInitially ? "reduced" : "on");
    if (!reduceInitially) void start();

    media.addEventListener("change", onMotionChange);
    document.addEventListener("click", onAnchorClick);

    return () => {
      disposed = true;
      media.removeEventListener("change", onMotionChange);
      document.removeEventListener("click", onAnchorClick);
      stop();
    };
  }, []);

  return null;
}
