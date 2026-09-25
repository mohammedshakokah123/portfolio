# 07: المشاريع (كروت + صفحة لكل مشروع)

**المرجع:** `design/reference.html` الأسطر 425 لـ 542 (الكروت) و643 لـ 798 (المودال والقوالب).

## الهدف
- قسم Projects بالرئيسية فيه 4 كروت.
- كل كرت بيوصل لصفحة **`/projects/[slug]`** مولّدة static وفيها التفاصيل (بدل المودال اللي بالتصميم).
- كل صفحة إلها SEO خاص فيها.

## 1. ProjectCard: `src/components/projects/project-card.tsx` (Server Component)
```tsx
export function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/30 transition-colors duration-200 hover:border-input">
      <div className="relative aspect-[16/10] border-b border-border">
        {project.image ? (
          <Image src={project.image.src} alt={project.image.alt} fill
                 sizes="(min-width: 768px) 36rem, 100vw" className="object-cover" />
        ) : (
          <ImagePlaceholder grid icon={<Icon className="size-8" />}
                            label={projectLabels.placeholder} ariaLabel={project.placeholderLabel} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        <TechList items={project.tech} className="mt-4" />
        <div className="mt-auto pt-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.slug}`}
                  className="after:absolute after:inset-0 after:content-['']">
              View details <span className="sr-only">for {project.title}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
```
- **Stretched link:** الـ `after:absolute after:inset-0` بيخلي الكرت كله clickable، بس بيضل فيه **رابط واحد** بالـ DOM، وهاد أحسن لقارئ الشاشة.
- الـ focus ring بيبيّن على الزر، وإذا بدك إياه على الكرت كله استعمل `has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring` على الـ `article`.
- الـ hover lift بالحركة بيجي بمرحلة 09 (`HoverLift` wrapper).

## 2. Projects section: `src/components/sections/projects.tsx`
```tsx
<Section id="projects" labelledBy="projects-title">
  <SectionHeading id="projects-title" {...site.sections.projects} />
  <div className="mt-10 grid gap-6 md:grid-cols-2">
    {getAllProjects().map((p) => <ProjectCard key={p.slug} project={p} />)}
  </div>
</Section>
```
> عدّل `SectionHeading` لياخد `className` (الوصف هون `max-w-xl`).

## 3. صفحة المشروع: `src/app/projects/[slug]/page.tsx`
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug, getAdjacentProjects } from "@/content/projects";

export const dynamicParams = false; // أي slug مش معروف ← 404

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.image ? [project.image.src] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacentProjects(slug);
  return <ProjectDetail project={project} prev={prev} next={next} />;
}
```
> **مهم:** بـ Next 15 وما فوق، `params` صار **Promise**، فلازم `await params`.

## 4. ProjectDetail: `src/components/projects/project-detail.tsx`
البنية (نفس محتوى المودال، بس كصفحة):
```
<article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
  ← All projects   (Link href="/#projects"، text-sm text-muted-foreground hover:text-foreground)

  <header className="mt-8">
    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
    <p className="mt-2 text-subtle">{subtitle}</p>
    <TechList items={tech} className="mt-5" />
  </header>

  <figure className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg border border-border">
    Image (priority) أو ImagePlaceholder grid
  </figure>

  <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-muted-foreground">
    <DetailSection title={projectLabels.overview}>     <p>{overview}</p> </DetailSection>
    <DetailSection title={projectLabels.architecture}> <p>{architecture}</p> </DetailSection>
    <DetailSection title={projectLabels.features}>
      <ul className="list-disc space-y-1.5 pl-5 marker:text-subtle">…features</ul>
    </DetailSection>
    <DetailSection title={projectLabels.stack}> <p>{stack.join(", ")}.</p> </DetailSection>
  </div>

  {/* 3 حالات: NDA ← شارة NDA + walkthrough. في روابط ← الأزرار.
      ما في روابط (ما في رابط عام أو داشبورد خاص) ← شارة "No public demo" + walkthrough. */}
  <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
    {nda || !hasLinks ? (
      <>
        <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-muted px-4 text-sm text-muted-foreground">
          <Lock className="size-4" /> {nda ? projectLabels.nda : projectLabels.noPublicDemo}
        </span>
        <Button asChild variant="outline"><Link href="/#contact">{projectLabels.requestWalkthrough}</Link></Button>
      </>
    ) : (
      <>
        {links.demo && <Button asChild><a href={links.demo} target="_blank" rel="noopener noreferrer"><ExternalLink/> {projectLabels.liveDemo}</a></Button>}
        {links.source && <Button asChild variant="outline"><a href={links.source} target="_blank" rel="noopener noreferrer"><Code/> {projectLabels.sourceCode}</a></Button>}
      </>
    )}
  </div>

  <nav aria-label="More projects" className="mt-16 grid gap-4 sm:grid-cols-2">
    prev ← (كرت صغير: "Previous" + العنوان) | next → (محاذى يمين)
  </nav>
</article>
```
- `const hasLinks = Boolean(links.demo || links.source);`
- `DetailSection`: `<section><h2 className="text-sm font-semibold text-foreground">{title}</h2><div className="mt-2">{children}</div></section>`.
  > بالمودال كانت `h3`، بس هون الصفحة إلها `h1`، فالأقسام بتصير `h2`.
- الروابط الخارجية فيها `<span className="sr-only">(opens in a new tab)</span>`.
- إذا `links.demo` و`links.source` فاضيين (متل هلق، `#` بالتصميم)، ما منعرض الأزرار.

## 5. `src/app/not-found.tsx`
صفحة 404 بسيطة بنفس الـ style: عنوان "Page not found"، وجملة، وزر `Back home` ← `/`.

## ضيفها لـ `page.tsx`
```tsx
<Hero /> <About /> <Skills /> <Experience /> <Projects />
```

## Definition of Done
- [ ] `npm run build` بيطلّع 4 صفحات `/projects/*` كـ **SSG** (بتبيّن ● أو ○ بالـ output).
- [ ] `/projects/xyz` بيعطي 404.
- [ ] الكرت كله clickable، وفيه رابط واحد بس بالـ Tab order.
- [ ] الرجوع من صفحة المشروع لـ `/#projects` بينزل على القسم الصح.
- [ ] كل صفحة إلها `<title>` و description مختلفين (افحص الـ `<head>`).
- [ ] مشاريع الـ NDA بتعرض شارة الـ NDA و"Request a walkthrough". المشاريع اللي إلها روابط بتعرض الأزرار. واللي ما إلها روابط بتعرض "No public demo available" و"Request a walkthrough" (ما في سطر فاضي).
