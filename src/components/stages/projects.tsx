import { Cartridge } from "@/components/projects/cartridge";
import { Stage } from "@/components/stages/stage";
import { getAllProjects } from "@/content/projects";

export function ProjectsStage() {
  return (
    <Stage id="projects">
      <div className="carts">
        {getAllProjects().map((project) => (
          <Cartridge key={project.slug} project={project} />
        ))}
      </div>
    </Stage>
  );
}
