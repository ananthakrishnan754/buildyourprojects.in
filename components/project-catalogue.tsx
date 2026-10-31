"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/projects";

export function ProjectCatalogue({
  projects,
  tags,
}: {
  projects: Project[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTag = tag === "all" || project.tags.includes(tag);
      if (!matchesTag) return false;
      if (!term) return true;

      return (
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some((item) => item.toLowerCase().includes(term))
      );
    });
  }, [projects, query, tag]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div>
          <label htmlFor="project-search" className="type-label text-muted">
            Search the catalogue
          </label>
          <input
            id="project-search"
            type="search"
            className="field mt-2"
            placeholder="Try ESP32, solar, robotics, MATLAB…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(12);
            }}
          />
        </div>
        <div>
          <label htmlFor="project-tag" className="type-label text-muted">
            Filter by technology
          </label>
          <select
            id="project-tag"
            className="field mt-2"
            value={tag}
            onChange={(event) => {
              setTag(event.target.value);
              setVisibleCount(12);
            }}
          >
            <option value="all">All technologies</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-5 type-body-sm text-muted" aria-live="polite">
        Showing {visible.length} of {filtered.length} matching projects
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-lg border border-stroke bg-surface p-8 text-center">
          <h3 className="type-h3">No projects match that search.</h3>
          <p className="mt-2 type-body-sm text-muted">
            Try a broader term, or send the requirement on WhatsApp and we will
            tell you whether it is buildable.
          </p>
          <button
            type="button"
            className="btn btn-secondary mt-5"
            onClick={() => {
              setQuery("");
              setTag("all");
              setVisibleCount(12);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}

      {visibleCount < filtered.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setVisibleCount((count) => count + 12)}
          >
            Show 12 more
          </button>
        </div>
      ) : null}
    </div>
  );
}
