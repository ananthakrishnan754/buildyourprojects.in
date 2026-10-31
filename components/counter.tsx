"use client";

import { useEffect, useRef } from "react";

export function Counter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let observer: IntersectionObserver | null = null;

    const settle = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      observer = null;
      element.textContent = String(value);
    };

    if (media.matches) {
      settle();
      return;
    }

    element.textContent = "0";
    let started = false;

    const run = () => {
      started = true;
      const duration = 900;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          observer = null;
          run();
        },
        { threshold: 0.4 },
      );

      observer.observe(element);
    }

    const onMotionChange = () => {
      if (media.matches) settle();
      else if (!started) run();
    };
    media.addEventListener("change", onMotionChange);
    window.addEventListener("byp:motionchange", onMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      media.removeEventListener("change", onMotionChange);
      window.removeEventListener("byp:motionchange", onMotionChange);
    };
  }, [value]);

  return (
    <span className={`tabular ${className}`}>
      <span aria-hidden="true">
        <span
          ref={ref}
          className="inline-block tabular"
          style={{ minWidth: `${String(value).length}ch` }}
        >
          {value}
        </span>
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
