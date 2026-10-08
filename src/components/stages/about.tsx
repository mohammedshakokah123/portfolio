import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Portrait } from "@/components/stages/portrait";
import { Stage } from "@/components/stages/stage";
import { labels } from "@/content/labels";
import { site } from "@/content/site";

export function AboutStage() {
  const { stats, paragraphs, abilities } = site.about;

  return (
    <Stage id="about">
      <div className="about-grid">
        <article className="win player-card" aria-labelledby="player-name">
          <Portrait src={site.profileImage} alt={site.name} />
          <h3 id="player-name" className="player-name">
            {site.name}
          </h3>
          <p className="player-class">{site.role}</p>
          <dl className="stats">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <div className="about-main">
          <div className="win bio">
            <h3 className="win-title">{labels.about.bio}</h3>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>
                {paragraph.map((part, j) =>
                  typeof part === "string" ? part : <strong key={j}>{part.emphasis}</strong>,
                )}
              </p>
            ))}
          </div>

          <div className="win">
            <h3 className="win-title">{labels.about.abilities}</h3>
            <ul className="abilities">
              {abilities.map(({ icon, title, description }) => (
                <li key={title}>
                  <span className="ability-ico" aria-hidden="true">
                    <PixelIcon name={icon} size="lg" />
                  </span>
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Stage>
  );
}
