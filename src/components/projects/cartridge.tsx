import Image from "next/image";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { projectLabels } from "@/content/projects";
import type { Project } from "@/types/content";

/** ألوان الـ placeholder لما ما في cover (من أول كارتريدج بالمرجع) */
const PLACEHOLDER = { "--c1": "#3A45B5", "--c2": "#1E2150" } as React.CSSProperties;

export function Cartridge({ project }: { project: Project }) {
  const titleId = `p-${project.slug}`;
  const lock = project.nda && (
    <span className="lock-badge" aria-hidden="true">
      <PixelIcon name="lock" />
      NDA
    </span>
  );

  return (
    <article className="cart" aria-labelledby={titleId}>
      <div className="cart-ridges" aria-hidden="true" />
      <div className="cart-label">
        {project.cover ? (
          <div className="cart-shot">
            {/* lazy (الافتراضي): المرحلة مخفية لحد ما توصلها، فالصور ما بتتحمّل مع شاشة البداية */}
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(max-width: 859px) calc(100vw - 80px), 480px"
            />
            {lock}
          </div>
        ) : (
          <div
            className="cart-shot"
            style={PLACEHOLDER}
            role="img"
            aria-label={project.placeholderLabel}
          >
            <div className="shot-art" aria-hidden="true">
              <PixelIcon name={project.icon} size="xl" />
              <span className="shot-note">{projectLabels.placeholder}</span>
            </div>
            {lock}
          </div>
        )}
        <h3 id={titleId} className="cart-title">
          {project.title}
        </h3>
        <p className="cart-sum">{project.summary}</p>
      </div>
      <div className="cart-foot">
        <Tags items={project.tech} label="Technologies" />
        {/* data-dialog: المحرك بيفتح <dialog id="project-<slug>"> (dialogs.ts) */}
        <button
          type="button"
          className={btn({ size: "small" })}
          data-dialog={`project-${project.slug}`}
          aria-haspopup="dialog"
        >
          {projectLabels.viewDetails}
          <span className="sr-only"> for {project.title}</span>
        </button>
      </div>
    </article>
  );
}
