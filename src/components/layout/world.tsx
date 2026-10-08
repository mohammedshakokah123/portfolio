import { worldBlocks } from "@/content/skills";

/**
 * المشهد الثابت ورا المحتوى. زينة كله (aria-hidden)، والرسم من الـ sprites بـ world.css.
 * on-<stage>: الـ prop بيبين بس بهالمراحل (حسب html[data-stage]).
 */
export function World() {
  return (
    <div className="world" aria-hidden="true">
      <div className="sky" />
      <div className="sky-night" />
      <div className="stars" />
      <div className="stars s2" />
      <div className="sun" />
      <div className="moon" />
      <div className="clouds far">
        <div className="track" />
      </div>
      <div className="clouds">
        <div className="track" />
      </div>
      <div className="mountains" />
      <div className="skyline" />
      <div className="hills" />
      <div className="props">
        <div className="prop tree t1 on-home on-about on-projects on-contact" />
        <div className="prop tree t2 on-home on-about on-skills" />
        <div className="prop tree t3 on-about" />
        <div className="prop blockrow on-skills">
          {/* tabIndex -1: لعبة بالماوس بس، ومش بترتيب الـ Tab (والأب aria-hidden). الكبس عليهم بالمرحلة 08 */}
          {worldBlocks.map((words) => (
            <button
              key={words[0]}
              type="button"
              className="q-block"
              tabIndex={-1}
              data-pop={words.join("|")}
            />
          ))}
        </div>
        <div className="prop flagpost on-experience" />
        <div className="prop mailbox on-contact" />
      </div>
    </div>
  );
}

/** الشخصية. بتبلّش برّا الشاشة (translateX(-200px) بالـ CSS)، والمحرك (المرحلة 06) بيدخّلها */
export function HeroLayer() {
  return (
    <div className="hero-layer" aria-hidden="true">
      <div className="hero-wrap" title="Click to jump">
        <div className="hero">
          <div className="hero-sprite" data-state="idle" />
        </div>
      </div>
    </div>
  );
}

/** الأرض قدّام المحتوى: الصفحة بتعمل scroll من وراها */
export function Floor() {
  return (
    <div className="floor" aria-hidden="true">
      <div className="ground" />
    </div>
  );
}
