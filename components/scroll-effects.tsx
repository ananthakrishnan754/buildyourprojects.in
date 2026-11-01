"use client";

import { useEffect } from "react";

/**
 * Attribute-driven scroll system.
 *
 * Mirrors the technique observed on the reference site (postgeneric.com):
 *  - `data-reveal` elements fade/rise in once, when 12% visible
 *    (IntersectionObserver, rootMargin "0px 0px -6% 0px"), with a per-item
 *    stagger supplied through the `--i` custom property.
 *  - `data-parallax="<px>"` elements are translated on scroll by a clamped
 *    fraction of their distance from the viewport centre, in a rAF loop.
 *  - Parallax is skipped below 900px and under prefers-reduced-motion, so
 *    mobile and motion-sensitive users get a static, fully legible page.
 *
 * Everything degrades to plain content if JS never runs: the CSS only hides
 * reveal targets once `html.motion-ready` is present, and that class is added
 * here after hydration.
 */
export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 900px)");

    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const showAll = () => {
      for (const el of reveals) el.dataset.visible = "true";
    };

    root.classList.add("motion-ready");

    if (reduce.matches || typeof IntersectionObserver === "undefined") {
      showAll();
      return () => root.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    for (const el of reveals) observer.observe(el);

    let frame = 0;
    const offsets = new Map<HTMLElement, number>();
    let layers: HTMLElement[] = [];

    const collect = () => {
      layers = Array.from(
        document.querySelectorAll<HTMLElement>("[data-parallax]"),
      );
      for (const el of layers) el.style.willChange = "transform";
      offsets.clear();
    };

    const clear = () => {
      for (const el of layers) {
        el.style.removeProperty("transform");
        el.style.removeProperty("will-change");
      }
      offsets.clear();
    };

    const tick = () => {
      frame = 0;

      if (narrow.matches) {
        clear();
        return;
      }

      const vh = window.innerHeight;
      let moved = false;

      for (const el of layers) {
        const strength = Number(el.dataset.parallax);
        if (!strength) continue;

        const rect = el.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        const ratio = (centre - (offsets.get(el) ?? 0) - vh / 2) / vh;
        const y = -Math.max(-0.6, Math.min(0.6, ratio)) * strength;

        offsets.set(el, y);
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        moved = true;
      }

      if (moved) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - vh;
        const progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
        root.style.setProperty("--scroll-progress", progress.toFixed(4));
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    };

    collect();
    tick();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const onMotion = () => {
      if (reduce.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        clear();
        showAll();
      } else {
        collect();
        schedule();
      }
    };

    reduce.addEventListener("change", onMotion);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", onMotion);
      if (frame) cancelAnimationFrame(frame);
      clear();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
