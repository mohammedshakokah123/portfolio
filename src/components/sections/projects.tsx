import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllProjects } from "@/content/projects";
import { site } from "@/content/site";

export function Projects() {
  return (
    <Section id="projects" labelledBy="projects-title" band>
      <Reveal>
        <SectionHeading id="projects-title" className="max-w-xl" {...site.sections.projects} />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* h-full بكل طبقة (هون وجوّا ProjectCard): الكروت بنفس الصف بيضلّوا بنفس الطول */}
        {getAllProjects().map((p, i) => (
          <Reveal key={p.slug} col={i % 2} className="h-full">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
