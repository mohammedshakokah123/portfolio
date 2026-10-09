import localFont from "next/font/local";

/**
 * الخطين (src/assets/fonts) نفس ملفات المرجع بالبايت: الـ subset تبع الـ latin متل ما بيعطيه fonts.gstatic.com لـ Chrome عـ Windows،
 * وفيه جداول الـ hinting (`fpgm` و`prep` و`cvt`). `next/font/google` كان ينزّل نسخة الـ Mac اللي بدونها، فالنص
 * عـ Windows كان أنعم من المرجع بمقاسات 10px و12px. الحروف والمقاسات والـ kerning نفسهم بالنسختين.
 *
 * الـ @font-face متل اللي بيعطيه Google للمرجع: نفس اسم العائلة ونفس الأوزان، وبدون fallback مقيوس
 * (adjustFontFallback: false). عنا الـ latin بس (المرجع بيعرّف كمان latin-ext وcyrillic وgreek، وولا حرف منهم
 * بنص الموقع)، فما في unicode-range: أي حرف مش بالملف بياخد الخط اللي بعده بالـ tokens متل المرجع.
 * الملفين self-hosted (ما في request لـ Google) ورخصتهم OFL (مكتوبة جوّا الملف).
 *
 * ما حدا بيقرأ هالـ objects: tokens.css بيسمّي العائلتين بالاسم متل المرجع. الـ import بـ app/layout.tsx هو اللي
 * بيحط الـ @font-face والـ preload بكل صفحة. ما منستعمل `variable` ولا `className`: Turbopack بيعطيهم اسم المتغير
 * ("pressStart") مش اسم العائلة اللي بالـ declarations، فكانوا رح يأشّروا على عائلة مش موجودة.
 */
export const pressStart = localFont({
  src: "../assets/fonts/press-start-2p-latin.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
  // التنصيص لازم: بدونه "2P" (كلمة بتبلّش برقم) بتخرّب الـ declaration والمتصفح بيتجاهل الـ @font-face كله.
  // ومفرد مش "": Turbopack بيحط القيمة بـ JSON بدون escape، والـ " بتكسر الـ build
  declarations: [{ prop: "font-family", value: "'Press Start 2P'" }],
});

// خط variable. المرجع بيطلب 400 و500 و600، وGoogle بيعطي نفس الملف للتلاتة. المدى 400–600 بيرسم كل وزن
// منهم متل المرجع، وأي وزن أتقل (متل bold) بيوقف عند 600 متله كمان
export const pixelify = localFont({
  src: "../assets/fonts/pixelify-sans-latin.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "font-family", value: "'Pixelify Sans'" }],
});
