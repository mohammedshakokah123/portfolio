import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllProjects } from "@/content/projects";
import { site } from "@/content/site";

export function Projects() {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading id="projects-title" className="max-w-xl" {...site.sections.projects} />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {getAllProjects().map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  );
}
