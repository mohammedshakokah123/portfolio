/**
 * عناصر فوق الصفحة بيتحكم فيها المحرك مباشرة (classes وtextContent): الـ wipe وبطاقة المرحلة،
 * الـ toast، والـ announcer لقارئ الشاشة. Server Component: ما بينعاد رسمه، فتعديلات المحرك بتضل.
 */
export function Overlays() {
  return (
    <>
      <div className="wipe" aria-hidden="true">
        <canvas />
        <div className="stage-card">
          <div className="hero-sprite card-hero" data-state="run" />
          <p className="card-no" data-card-no>
            Stage 1
          </p>
          <p className="card-name" data-card-name>
            About
          </p>
        </div>
      </div>

      <div className="toast" role="status" aria-live="polite" />
      <p className="sr-only" aria-live="polite" data-announcer />
    </>
  );
}
