import { site } from "@/content/site";
import { STAGE_NAMES, STAGES, type StageId } from "@/game/stages";

type StageProps = { id: Exclude<StageId, "home">; children: React.ReactNode };

/**
 * إطار المرحلة: "Stage N" + العنوان + السطر اللي تحته. شاشة البداية إلها شكلها الخاص (title-screen.tsx).
 * tabIndex -1 وdata-stage-title عالعنوان: الـ router بيحط الـ focus عليه بعد كل انتقال.
 * h2 مش h1 متل المرجع: الـ h1 الوحيد بالصفحة هو الاسم بشاشة البداية.
 */
export function Stage({ id, children }: StageProps) {
  return (
    <section id={id} className="stage" aria-labelledby={`${id}-title`}>
      <div className="stage-inner">
        <header className="stage-head">
          <p className="stage-no">Stage {STAGES.indexOf(id)}</p>
          <h2 id={`${id}-title`} className="stage-title" tabIndex={-1} data-stage-title>
            {STAGE_NAMES[id]}
          </h2>
          <p className="stage-sub">{site.stageSubs[id]}</p>
          {/* المرحلة 11 بتضيف زر الجوهرة هون */}
        </header>
        {children}
      </div>
    </section>
  );
}
