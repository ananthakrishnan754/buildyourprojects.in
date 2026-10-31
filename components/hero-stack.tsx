"use client";

import { useEffect, useRef } from "react";
import { loadMotion } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function HeroStack() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        stage.style.setProperty("--mx", `${x.toFixed(1)}%`);
        stage.style.setProperty("--my", `${y.toFixed(1)}%`);
      });
    };

    stage.addEventListener("pointermove", onPointerMove);

    let cleanup: (() => void) | undefined;
    let disposed = false;

    void loadMotion().then(({ gsap }) => {
      if (disposed) return;

      const layers = stage.querySelectorAll<HTMLElement>("[data-layer]");
      if (!layers.length) return;

      const tween = gsap.to(layers, {
        yPercent: (index) => (index === 0 ? -10 : index === 1 ? -4 : 6),
        rotate: (index) => (index === 0 ? -9 : index === 1 ? 4 : -3),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top 85%",
          end: "bottom top",
          scrub: true,
        },
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(layers, { clearProps: "all" });
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.style.removeProperty("--mx");
      stage.style.removeProperty("--my");
      cleanup?.();
    };
  }, [reduced]);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="hero-stage relative mx-auto h-[340px] w-full max-w-[440px] md:h-[420px]"
    >
      <span className="surface-spotlight" />
      <div
        data-layer
        className="absolute inset-x-8 top-6 h-56 rounded-xl border border-stroke bg-elevated/80 p-5 shadow-e2"
      >
        <span className="type-label text-muted">Code</span>
        <div className="mt-5 space-y-2">
          <div className="h-2 w-2/3 rounded-full bg-n-4/50" />
          <div className="h-2 w-5/6 rounded-full bg-n-4/30" />
          <div className="h-2 w-1/2 rounded-full bg-n-4/40" />
          <div className="h-2 w-3/4 rounded-full bg-n-4/20" />
        </div>
      </div>
      <div
        data-layer
        className="absolute inset-x-12 top-28 h-56 rounded-xl border border-stroke-strong bg-n-2 p-5 shadow-e3"
      >
        <span className="type-label text-muted">Report</span>
        <div className="mt-5 space-y-2">
          <div className="h-2 w-1/3 rounded-full bg-n-5/60" />
          <div className="h-2 w-full rounded-full bg-n-4/30" />
          <div className="h-2 w-11/12 rounded-full bg-n-4/30" />
          <div className="h-2 w-4/5 rounded-full bg-n-4/20" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-14 rounded-sm border border-stroke" />
            <div className="h-14 rounded-sm border border-stroke" />
            <div className="h-14 rounded-sm border border-stroke-strong" />
          </div>
        </div>
      </div>
      <div
        data-layer
        className="absolute inset-x-4 bottom-2 h-40 rounded-xl border border-stroke bg-surface p-5 shadow-e2"
      >
        <span className="type-label text-muted">Viva</span>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-sm border border-stroke bg-elevated" />
          <div className="h-16 rounded-sm border border-stroke bg-elevated" />
          <div className="h-16 rounded-sm border border-stroke bg-elevated" />
        </div>
      </div>
    </div>
  );
}
