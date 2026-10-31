"use client";

import { useEffect, useId, useRef, useState } from "react";
import { loadMotion } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Visual = "code" | "report" | "slides" | "cards";

type DemoBeat = {
  id: string;
  step: string;
  title: string;
  detail: string;
  visual: Visual;
};

const demoBeats: Record<string, DemoBeat[]> = {
  "submission-kit": [
    {
      id: "code",
      step: "01 — Code",
      title: "Run the project",
      detail:
        "Runnable source with one-command setup and seeded demo data. This is an illustrative layout of the starter, not a finished screenshot.",
      visual: "code",
    },
    {
      id: "report",
      step: "02 — Report",
      title: "Fill the report structure",
      detail:
        "IEEE-format headings, captions and reference slots, with clearly marked fields for your own results and screenshots.",
      visual: "report",
    },
    {
      id: "viva",
      step: "03 — Viva",
      title: "Rehearse the defence",
      detail:
        "25 project-specific questions with short model answers, plus a 12-slide deck that matches the report structure.",
      visual: "cards",
    },
  ],
  reportforge: [
    {
      id: "input",
      step: "01 — Input",
      title: "Bring your own content",
      detail:
        "Title, modules, tools, results, screenshots and citations. ReportForge formats what you supply; it does not write the academic content.",
      visual: "code",
    },
    {
      id: "report",
      step: "02 — Report",
      title: "Get a structured document",
      detail:
        "Automatic contents, heading numbering, figure and table captions, and a reference list built from your citations.",
      visual: "report",
    },
    {
      id: "deck",
      step: "03 — Deck",
      title: "Take a matching deck",
      detail:
        "A defence deck generated from the same project details, so the report and the presentation do not disagree.",
      visual: "slides",
    },
  ],
  "viva-vault": [
    {
      id: "bank",
      step: "01 — Bank",
      title: "Search the question bank",
      detail:
        "Questions grouped by branch and project type, with short model answers you can rewrite in your own words.",
      visual: "cards",
    },
    {
      id: "print",
      step: "02 — Print",
      title: "Revise offline",
      detail:
        "A printable revision copy with space to mark up the answers you still need to practise.",
      visual: "report",
    },
    {
      id: "explain",
      step: "03 — Explain",
      title: "Use the 60-second frame",
      detail:
        "A fill-in structure for the opening question every panel asks: what the project does, how it works, and what you changed.",
      visual: "cards",
    },
  ],
};

const fallbackBeats = demoBeats["submission-kit"];

export function getDemoBeats(slug: string) {
  return demoBeats[slug] ?? fallbackBeats;
}

function BeatVisual({ kind }: { kind: Visual }) {
  if (kind === "code") {
    return (
      <div className="rounded-lg border border-stroke bg-page p-4 font-mono text-[11px] leading-6 text-muted">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-n-3" />
          <span className="size-2 rounded-full bg-n-3" />
          <span className="size-2 rounded-full bg-accent/70" />
        </div>
        <p>
          <span className="text-accent">$</span> pnpm install
        </p>
        <p>
          <span className="text-accent">$</span> pnpm dev
        </p>
        <p className="text-n-4/70">ready on http://localhost:3000</p>
        <div className="mt-3 space-y-1.5">
          <span className="block h-2 w-2/3 rounded-full bg-n-3" />
          <span className="block h-2 w-5/6 rounded-full bg-n-3/70" />
          <span className="block h-2 w-1/2 rounded-full bg-n-3/60" />
        </div>
      </div>
    );
  }

  if (kind === "slides") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="aspect-[16/10] rounded-md border border-stroke bg-page p-3"
          >
            <span className="block h-1.5 w-1/3 rounded-full bg-accent/70" />
            <span className="mt-3 block h-1 w-full rounded-full bg-n-3" />
            <span className="mt-1.5 block h-1 w-4/5 rounded-full bg-n-3/70" />
            <span className="mt-1.5 block h-1 w-3/5 rounded-full bg-n-3/50" />
          </div>
        ))}
      </div>
    );
  }

  if (kind === "cards") {
    return (
      <div className="space-y-3">
        {["Why this architecture?", "What did you measure?", "What would you change?"].map(
          (question) => (
            <div
              key={question}
              className="rounded-md border border-stroke bg-page p-3"
            >
              <p className="text-sm font-medium">{question}</p>
              <span className="mt-2 block h-1.5 w-full rounded-full bg-n-3/70" />
              <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-n-3/50" />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-page p-4">
      <div className="flex items-center justify-between border-b border-stroke pb-3">
        <span className="type-label text-muted">Project report</span>
        <span className="badge">Template</span>
      </div>
      <div className="mt-4 space-y-2">
        <span className="block h-2 w-1/3 rounded-full bg-n-5/60" />
        <span className="block h-2 w-full rounded-full bg-n-4/30" />
        <span className="block h-2 w-11/12 rounded-full bg-n-4/30" />
        <span className="block h-2 w-4/5 rounded-full bg-n-4/20" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-12 rounded-sm border border-stroke" />
        <div className="h-12 rounded-sm border border-stroke" />
        <div className="h-12 rounded-sm border border-stroke-strong" />
      </div>
      <div className="mt-4 space-y-2">
        <span className="block h-2 w-2/3 rounded-full bg-n-4/20" />
        <span className="block h-2 w-5/6 rounded-full bg-n-4/20" />
      </div>
    </div>
  );
}

function BeatCard({
  beat,
  active,
}: {
  beat: DemoBeat;
  active?: boolean;
}) {
  return (
    <article
      data-demo-panel
      data-active={active ? "true" : "false"}
      className="demo-panel flex flex-col rounded-xl border border-stroke bg-surface p-5 md:p-6"
      aria-hidden={active === false ? "true" : undefined}
    >
      <p className="type-label text-accent">{beat.step}</p>
      <h3 className="type-h3 mt-3">{beat.title}</h3>
      <p className="mt-2 max-w-[46ch] type-body-sm text-muted">{beat.detail}</p>
      <div className="mt-5" aria-hidden="true">
        <BeatVisual kind={beat.visual} />
      </div>
    </article>
  );
}

function DemoTabs({ beats }: { beats: DemoBeat[] }) {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const focusTab = (index: number) => {
    const next = (index + beats.length) % beats.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <div className="lg:hidden">
      <div
        role="tablist"
        aria-label="Product demo steps"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {beats.map((beat, index) => {
          const selected = active === index;
          return (
            <button
              key={beat.id}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${beat.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${beat.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  focusTab(index + 1);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  focusTab(index - 1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  focusTab(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  focusTab(beats.length - 1);
                }
              }}
              className="chip"
            >
              {beat.step}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${beats[active].id}`}
        aria-labelledby={`${baseId}-tab-${beats[active].id}`}
        tabIndex={0}
        className="mt-4"
      >
        <BeatCard beat={beats[active]} />
      </div>
    </div>
  );
}

export function ProductDemo({ slug }: { slug: string }) {
  const beats = getDemoBeats(slug);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const fineMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let teardown = () => {};

    const install = () => {
      let cancelled = false;
      let frame = 0;
      let trigger: { kill: () => void } | null = null;

      setReady(false);
      setActive(0);

      if (!wide.matches || !fineMotion.matches || reduced) {
        return () => {
          cancelled = true;
        };
      }

      void loadMotion().then(({ ScrollTrigger }) => {
        if (cancelled) return;

        setReady(true);
        frame = requestAnimationFrame(() => {
          if (cancelled) return;
          const stage = stageRef.current;
          if (!stage) return;

          trigger = ScrollTrigger.create({
            trigger: stage,
            start: "top 88px",
            end: `+=${beats.length * 90}%`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const next = Math.min(
                beats.length - 1,
                Math.floor(self.progress * beats.length),
              );
              setActive((current) => (current === next ? current : next));
            },
          });
        });
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        trigger?.kill();
        trigger = null;
        setReady(false);
        setActive(0);
      };
    };

    const sync = () => {
      teardown();
      teardown = install();
    };

    sync();
    wide.addEventListener("change", sync);
    fineMotion.addEventListener("change", sync);

    return () => {
      wide.removeEventListener("change", sync);
      fineMotion.removeEventListener("change", sync);
      teardown();
    };
  }, [beats, reduced]);

  return (
    <div>
      <p className="type-label text-accent">Illustrative demo</p>
      <p className="mt-2 max-w-[52ch] type-body-sm text-muted">
        These are layout sketches of the three beats in the pack, not finished
        screenshots. Real sample pages are added before checkout opens.
      </p>

      <div className="mt-6">
        <DemoTabs beats={beats} />
      </div>

      <div className="hidden lg:block">
        <div ref={stageRef} className="demo-stage" data-ready={ready}>
          {beats.map((beat, index) => (
            <BeatCard
              key={beat.id}
              beat={beat}
              active={ready ? index === active : undefined}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2" aria-hidden="true">
          {beats.map((beat, index) => (
            <span
              key={beat.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-[var(--dur-enter)] ${
                index === active ? "bg-accent" : "bg-stroke"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
