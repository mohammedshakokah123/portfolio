/**
 * لقارئ الشاشة بس، جوّا أي رابط بـ target="_blank". نسخة وحدة بدل 3 نسخ كانت مختلفة شوي.
 * المسافة بالأول احتياط لو قارئ ما بيفصل النص عن اللي قبله (Chrome بيفصله لحاله).
 */
export function NewTabHint() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}
