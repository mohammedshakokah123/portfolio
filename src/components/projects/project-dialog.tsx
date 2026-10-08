import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { NewTabHint } from "@/components/shared/new-tab-hint";
import { getAllProjects, projectLabels } from "@/content/projects";
import type { Project, Shot } from "@/types/content";

/** مودال لكل مشروع، برّا الـ .stage (بآخر الصفحة). السبب بأول ملف المرحلة 09 */
export function ProjectDialogs() {
  return (
    <>
      {getAllProjects().map((project) => (
        <ProjectDialog key={project.slug} project={project} />
      ))}
    </>
  );
}

function ProjectDialog({ project }: { project: Project }) {
  const id = `project-${project.slug}`;
  const { links, nda } = project;
  const hasLinks = Boolean(links.demo || links.source);
  // الصورة الرئيسية أول المعرض، وبعدها باقي الصور
  const shots: Shot[] = [
    ...(project.image ? [{ ...project.image, caption: projectLabels.overviewShot }] : []),
    ...(project.gallery ?? []),
  ];
  const small = btn({ size: "small" });
  const smallGhost = btn({ variant: "ghost", size: "small" });

  return (
    <dialog id={id} className="modal" aria-labelledby={`${id}-title`}>
      <div className="win modal-win">
        <div className="modal-head">
          <div>
            <h2 id={`${id}-title`}>{project.title}</h2>
            <p>{project.subtitle}</p>
          </div>
          <button
            type="button"
            className={btn({ variant: "ghost", size: "icon" })}
            data-close
            aria-label="Close dialog"
          >
            <PixelIcon name="close" />
          </button>
        </div>

        <div className="modal-body">
          <section>
            <h3>{projectLabels.overview}</h3>
            <Paragraphs text={project.overview} />
          </section>
          <section>
            <h3>{projectLabels.architecture}</h3>
            <Paragraphs text={project.architecture} />
          </section>
          <section>
            <h3>{projectLabels.features}</h3>
            <ul className="quest-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>{projectLabels.stack}</h3>
            <Tags items={project.stack} />
          </section>
          {shots.length > 0 && (
            <section>
              <h3>{projectLabels.gallery}</h3>
              <ProjectGallery shots={shots} />
            </section>
          )}

          {/* 3 حالات: NDA ← شارة NDA + walkthrough. في روابط ← الأزرار.
              ما في روابط (لا رابط عام ولا داشبورد خاص) ← شارة accessNote + walkthrough */}
          <div className="modal-actions">
            {nda || !hasLinks ? (
              <>
                <span className="locked">
                  <PixelIcon name="lock" />
                  {nda ? projectLabels.nda : (project.accessNote ?? projectLabels.noPublicDemo)}
                </span>
                {/* رابط مرحلة: الـ router بيسكّر المودال وبيروح على Contact */}
                <a className={smallGhost} href="#contact">
                  {projectLabels.requestWalkthrough}
                </a>
              </>
            ) : (
              <>
                {links.demo && (
                  <a className={small} href={links.demo} target="_blank" rel="noopener noreferrer">
                    <PixelIcon name="external" />
                    {projectLabels.liveDemo}
                    <NewTabHint />
                  </a>
                )}
                {links.source && (
                  <a
                    className={smallGhost}
                    href={links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PixelIcon name="code" />
                    {projectLabels.sourceCode}
                    <NewTabHint />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

/** السطر الفاضي (\n\n) بالمحتوى = فقرة جديدة */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}
