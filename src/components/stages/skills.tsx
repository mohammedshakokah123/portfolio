import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Stage } from "@/components/stages/stage";
import { skills } from "@/content/skills";

export function SkillsStage() {
  return (
    <Stage id="skills">
      <div className="skills-grid">
        {skills.map(({ title, icon, items, pop }) => (
          <article key={title} className="win">
            <h3 className="inv-title">
              {/* لعبة بالماوس بس (aria-hidden): نفس الكلمات مكتوبة بالـ slots تحت، فما بيخسر حدا معلومة */}
              <span
                className="inv-ico"
                data-pop={pop.join("|")}
                title="Click me"
                aria-hidden="true"
              >
                <PixelIcon name={icon} />
              </span>
              {title}
            </h3>
            <ul className="slots">
              {items.map((item) => (
                <li key={item} className="slot">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Stage>
  );
}
