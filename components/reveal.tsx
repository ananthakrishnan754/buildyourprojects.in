"use client";

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type RevealState = "idle" | "hidden" | "in";

export function useRevealState<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<RevealState>("idle");

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || typeof IntersectionObserver === "undefined") return;

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;

    setState("hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setState("in");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(element);

    const onMotionChange = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setState("in");
        observer.disconnect();
      }
    };
    media.addEventListener("change", onMotionChange);
    window.addEventListener("byp:motionchange", onMotionChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", onMotionChange);
      window.removeEventListener("byp:motionchange", onMotionChange);
    };
  }, []);

  return { ref, state };
}

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, state } = useRevealState<HTMLDivElement>();

  return (
    <div ref={ref} className={className} data-reveal={state}>
      {children}
    </div>
  );
}

export function RevealGroup({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const { ref, state } = useRevealState<HTMLElement>();

  return createElement(
    as,
    {
      ref,
      className,
      "data-reveal-group": state,
    },
    children,
  );
}
