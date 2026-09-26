/**
 * عناصر الـ Reveal بتنرسم من السيرفر بـ style="opacity:0;transform:…" (الـ initial).
 * إذا الـ JS مطفي ما في شي بيشغّل الحركة، فبدون هاد الـ style بتضل مخفية للأبد.
 * منستهدف [data-reveal] بس، مش أي style فيه opacity.
 */
export function MotionNoScript() {
  return (
    <noscript>
      <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
    </noscript>
  );
}
