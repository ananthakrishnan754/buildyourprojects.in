"use client";

import { useEffect, useState } from "react";

export function KineticWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setRunning(!media.matches);
      if (media.matches) setIndex(0);
    };

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!running || words.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [running, words.length]);

  return (
    <span className="word-swap" aria-hidden="true">
      {words.map((word, wordIndex) => (
        <span key={word} data-active={wordIndex === index}>
          {word}
        </span>
      ))}
    </span>
  );
}
