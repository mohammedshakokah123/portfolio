import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { TechList } from "@/components/shared/tech-badge";
import { Button } from "@/components/ui/button";
import { projectLabels } from "@/content/projects";
import type { Project } from "@/types/content";

/**
 * Stretched link: الـ after:absolute after:inset-0 عالرابط بيغطي الكرت كله (الـ article هو الـ relative)،
 * فالكرت كله بينضغط بس بيضل فيه رابط واحد بالـ DOM وبالـ Tab order.
 * الـ Button بيعمل translate-y-px وقت الـ active، والـ transform بيخلي الزر هو الـ containing block
 * تبع الـ ::after، فبيصغر عحجم الزر نص الضغطة والـ click ما بيوصل للرابط. مشان هيك منلغيه هون بـ translate-none
 * (translate-y-0 ما بيكفي: أي قيمة غير none للـ translate بتعمل containing block).
 */
export function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;

  return (
    // الـ hover عالـ div اللي ما بيتحرك والرفعة عالـ article: لو نفس العنصر بيحس بالـ hover وبيتحرك،
    // الماوس بآخر 4px بيطلع ويفوت عالكرت وبيرجف. motion-safe: بدون رفعة مع prefers-reduced-motion.
    // الـ glow نفسه للـ hover وللكيبورد (has-focus-visible: الـ Tab عالرابط اللي جوّا الكرت).
    <div className="group/lift h-full">
      <article className="group border-border bg-card/30 group-hover/lift:border-brand/40 group-hover/lift:shadow-glow has-focus-visible:border-brand/40 has-focus-visible:shadow-glow relative flex h-full flex-col overflow-hidden rounded-lg border transition-[border-color,translate,box-shadow] duration-200 ease-out motion-safe:group-hover/lift:-translate-y-1">
        {/* خط ضو عطرف الكرت الفوقاني وقت الـ hover أو الـ focus */}
        <span
          aria-hidden
          className="via-brand pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/lift:opacity-100 group-has-focus-visible:opacity-100"
        />
        {/* الصورة بتكبر 3% جوّا إطارها (overflow-hidden)، فالكرت نفسه ما بيتغيّر حجمه */}
        <div className="border-border relative aspect-16/10 overflow-hidden border-b">
          <div className="absolute inset-0 transition-[scale] duration-500 ease-out motion-safe:group-hover/lift:scale-103 motion-safe:group-has-focus-visible:scale-103">
            {project.image ? (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                sizes="(min-width: 1152px) 34rem, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder
                grid
                icon={<Icon className="size-8" aria-hidden />}
                label={projectLabels.placeholder}
                ariaLabel={project.placeholderLabel}
              />
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-foreground text-lg font-semibold">{project.title}</h3>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {project.summary}
          </p>
          <TechList items={project.tech} className="mt-4" />
          <div className="mt-auto pt-6">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-4 after:absolute after:inset-0 active:not-aria-[haspopup]:translate-none"
            >
              <Link href={`/projects/${project.slug}`}>
                {projectLabels.viewDetails} <span className="sr-only">for {project.title}</span>
                <ArrowRight
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
