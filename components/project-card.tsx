import Image from "next/image";
import type { Project } from "@/data/projects";
import { whatsappLink } from "@/data/site";

export function ProjectCard({ project }: { project: Project }) {
  const image = project.images[0] ?? "/images/placeholder-project.svg";

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-stroke bg-elevated">
        <Image
          src={image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
          className="object-cover"
        />
        {project.featured ? (
          <span className="badge absolute left-3 top-3 bg-page/90">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="type-h3">{project.title}</h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <li key={tag} className="badge">
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-3 type-body-sm text-muted">{project.description}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <p className="type-body-sm font-semibold tabular">{project.price}</p>
          <a
            href={whatsappLink(
              `Hi! I'm interested in the ${project.title}. Can you share more details?`,
            )}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            I&apos;m interested
          </a>
        </div>
      </div>
    </article>
  );
}
