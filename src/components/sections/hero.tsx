import { User } from "lucide-react";
import Image from "next/image";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Section } from "@/components/shared/section";
import { SectionLink } from "@/components/shared/section-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * حركة الـ Hero بالـ CSS (tw-animate-css) مش بـ Motion: الـ Hero فوق الـ fold، فلازم يبين حتى
 * لو الـ JS تأخر أو فشل. fill-mode-backwards بيخلي العناصر اللي عليها delay مخفية من أول paint
 * (بدون flash). مع prefers-reduced-motion بيضل الـ fade بس، متل reducedMotion="user" تبع Motion.
 */
const rise =
  "animate-in slide-in-from-bottom-3 animation-duration-400 ease-out fill-mode-backwards motion-reduce:slide-in-from-bottom-0";
const enter = cn(rise, "fade-in");

export function Hero() {
  const { primary, secondary } = site.hero.ctas;

  return (
    <Section
      id="top"
      labelledBy="hero-title"
      className="grid gap-12 md:py-28 lg:grid-cols-[1fr_20rem] lg:items-center"
    >
      {/* الحركة عند التحميل: badge ← h1 ← lead ← quick facts ← CTA (70ms بين كل وحدة) */}
      <div>
        <Badge
          asChild
          variant="outline"
          className={cn(
            "border-success/30 bg-success/10 text-success mb-5 h-auto gap-2 rounded-full px-3 py-1 text-xs font-medium whitespace-normal",
            enter,
          )}
        >
          <p>
            <span className="bg-success size-1.5 shrink-0 rounded-full" aria-hidden />
            {site.availability}
          </p>
        </Badge>

        {/* الاسم جوّا الـ h1 مشان الـ SEO: "Mohammad Shaquqa Frontend Engineer specializing in…".
            الـ {" "} ضروري: الـ span بسطر لحاله بالـ CSS بس، والنص الخام بدونه بيلزق الكلمتين.
            الـ h1 غالباً هو الـ LCP، فبيتحرّك بـ y بس (بدون fade) وبيبين من أول paint */}
        <h1
          id="hero-title"
          className={cn(
            "text-foreground max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem]",
            rise,
            "delay-70",
          )}
        >
          <span className="text-brand mb-3 block text-base font-medium tracking-normal sm:text-lg">
            {site.name}
          </span>{" "}
          {site.hero.title}
        </h1>

        <p
          className={cn(
            "text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed",
            enter,
            "delay-140",
          )}
        >
          {site.hero.lead}
        </p>

        <ul
          className={cn("mt-8 flex flex-wrap gap-2 text-sm", enter, "delay-210")}
          aria-label="Quick facts"
        >
          {site.hero.quickFacts.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="border-border bg-muted/60 text-body inline-flex items-center gap-2 rounded-md border px-3 py-1.5"
            >
              <Icon className="text-brand size-4 shrink-0" aria-hidden />
              {text}
            </li>
          ))}
        </ul>

        <div className={cn("mt-10 flex flex-wrap gap-3", enter, "delay-280")}>
          <Button asChild variant="inverted" size="lg" className="h-11 px-5">
            <SectionLink href={primary.href}>{primary.label}</SectionLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-5">
            <SectionLink href={secondary.href}>{secondary.label}</SectionLink>
          </Button>
        </div>
      </div>

      <GlanceCard />
    </Section>
  );
}

/**
 * ملخص سريع للـ recruiters. الـ figure مساحته محجوزة (aspect-square)، فما في layout shift بالحالتين.
 * الصورة `loading="eager"` (متل ما بينصح توثيق Next 16) بدل `preload`: الصورة مش الـ LCP
 * (عالموبايل الكرت تحت النص، وعالديسكتوب الـ h1 أكبر منها). بس انتبه: React 19 بالـ SSR
 * بيحط `<link rel="preload">` لحاله لأي صورة مش lazy، فعملياً الاتنين بيطلّعوا نفس الـ HTML.
 */
function GlanceCard() {
  return (
    <aside
      aria-label="At a glance"
      className={cn(
        "border-border bg-card/40 w-full max-w-sm overflow-hidden rounded-lg border lg:max-w-none",
        "animate-in fade-in zoom-in-98 animation-duration-400 fill-mode-backwards motion-reduce:zoom-in-100 delay-200 ease-out",
      )}
    >
      <figure className="border-border bg-muted relative aspect-square border-b">
        {site.profileImage ? (
          <Image
            src={site.profileImage}
            alt={site.name}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 20rem, 24rem"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            icon={<User className="size-14" aria-hidden />}
            label="Profile photo"
            ariaLabel="Profile photo placeholder"
          />
        )}
      </figure>
      <dl className="divide-border divide-y text-sm">
        {site.hero.glance.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-subtle">{label}</dt>
            <dd className="text-emphasis text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
