import { ArrowLeft, ArrowRight, Code, ExternalLink, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { SectionLink } from "@/components/shared/section-link";
import { TechList } from "@/components/shared/tech-badge";
import { Button } from "@/components/ui/button";
import { projectLabels } from "@/content/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

type ProjectDetailProps = { project: Project; prev: Project | null; next: Project | null };

/** نفس محتوى المودال بالتصميم بس كصفحة: الأقسام h2 لأن الصفحة إلها h1 */
export function ProjectDetail({ project, prev, next }: ProjectDetailProps) {
  const { title, subtitle, tech, image, overview, architecture, features, stack, links, nda } =
    project;
  const Icon = project.icon;
  const hasLinks = Boolean(links.demo || links.source);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionLink
        href="/#projects"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All projects
      </SectionLink>

      <header className="mt-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-subtle mt-2">{subtitle}</p>
        <TechList items={tech} className="mt-5" />
      </header>

      <figure className="border-border relative mt-10 aspect-16/10 overflow-hidden rounded-lg border">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="(min-width: 768px) 45rem, 100vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            grid
            icon={<Icon className="size-8" aria-hidden />}
            label={projectLabels.placeholder}
            ariaLabel={project.placeholderLabel}
          />
        )}
      </figure>

      <div className="text-muted-foreground mt-12 space-y-10 text-[15px] leading-relaxed">
        <DetailSection title={projectLabels.overview}>
          <p>{overview}</p>
        </DetailSection>
        <DetailSection title={projectLabels.architecture}>
          <p>{architecture}</p>
        </DetailSection>
        <DetailSection title={projectLabels.features}>
          <ul className="marker:text-subtle list-disc space-y-1.5 pl-5">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </DetailSection>
        <DetailSection title={projectLabels.stack}>
          <p>{stack.join(", ")}.</p>
        </DetailSection>
      </div>

      {/* 3 حالات: NDA ← شارة NDA + walkthrough. في روابط ← الأزرار.
          ما في روابط (لا رابط عام ولا داشبورد خاص) ← شارة "No public demo" + walkthrough */}
      <div className="border-border mt-12 flex flex-wrap gap-3 border-t pt-8">
        {nda || !hasLinks ? (
          <>
            <span className="border-border bg-muted text-muted-foreground inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm">
              <Lock className="size-4" aria-hidden />
              {nda ? projectLabels.nda : projectLabels.noPublicDemo}
            </span>
            <Button asChild variant="outline" size="lg" className="h-10 px-4">
              <SectionLink href="/#contact">{projectLabels.requestWalkthrough}</SectionLink>
            </Button>
          </>
        ) : (
          <>
            {links.demo && (
              <Button asChild size="lg" className="h-10 px-4">
                <a href={links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden />
                  {projectLabels.liveDemo}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            )}
            {links.source && (
              <Button asChild variant="outline" size="lg" className="h-10 px-4">
                <a href={links.source} target="_blank" rel="noopener noreferrer">
                  <Code aria-hidden />
                  {projectLabels.sourceCode}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            )}
          </>
        )}
      </div>

      {(prev || next) && (
        <nav aria-label="More projects" className="mt-16 grid gap-4 sm:grid-cols-2">
          {prev && <AdjacentLink project={prev} direction="prev" />}
          {next && <AdjacentLink project={next} direction="next" />}
        </nav>
      )}
    </article>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-foreground text-sm font-semibold">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/** الـ next دايماً بالعمود اليمين، حتى لو ما في prev (أول مشروع) */
function AdjacentLink({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group border-border hover:border-input focus-visible:ring-ring rounded-lg border p-4 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
        isNext && "text-right sm:col-start-2",
      )}
    >
      <span
        className={cn(
          "text-subtle inline-flex items-center gap-1.5 text-xs",
          isNext && "flex-row-reverse",
        )}
      >
        <Arrow className="size-3.5" aria-hidden />
        {isNext ? "Next" : "Previous"}
      </span>
      <span className="text-emphasis group-hover:text-foreground mt-1 block text-sm font-medium transition-colors duration-200">
        {project.title}
      </span>
    </Link>
  );
}
