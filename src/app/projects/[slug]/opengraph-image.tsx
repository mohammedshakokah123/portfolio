import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { site } from "@/content/site";
import { OgCard } from "@/lib/seo/og-card";

const size = { width: 1200, height: 630 };

// مع generateImageMetadata الصورة ما بتنبنى وقت الـ build: بتتولّد أول ما حدا يطلبها وبعدين بتنحفظ
// (x-nextjs-cache: HIT). ما في dynamicParams = false لأنه كان بيطلّع 404 لكل الصور،
// والـ slug الغلط أصلاً بياخد 404 من notFound() تحت.
export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

/**
 * بدل `export const alt` الثابت: كل مشروع إله alt فيه اسمه (الـ export الثابت ما بيعرف الـ slug).
 * هون الـ params object عادي، بس بالـ default export تحت هي Promise.
 */
export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return [];
  return [
    {
      id: "og",
      alt: `${project.title}, project by ${site.name}`,
      size,
      contentType: "image/png",
    },
  ];
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return new ImageResponse(
    <OgCard
      eyebrow="Project"
      title={project.title}
      subtitle={`by ${site.name}`}
      meta={project.tech.join(" · ")}
    />,
    size,
  );
}
