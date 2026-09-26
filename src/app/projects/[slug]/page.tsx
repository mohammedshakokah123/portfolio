import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { JsonLd } from "@/components/shared/json-ld";
import { getAdjacentProjects, getAllProjects, getProjectBySlug } from "@/content/projects";
import { site } from "@/content/site";
import { projectJsonLd } from "@/lib/seo/json-ld";
import { sharedOpenGraph, sharedTwitter } from "@/lib/seo/metadata";

// أي slug مش بـ generateStaticParams ← 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const url = `/projects/${project.slug}`;
  // الـ template تبع الـ title ما بيوصل للـ OG والـ twitter، فمنكتبه كامل
  const fullTitle = `${project.title} | ${site.name}`;

  // الصورة من opengraph-image.tsx جنب هالملف (الـ file-based بيغلب الـ config)
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      ...sharedOpenGraph,
      type: "article",
      url,
      title: fullTitle,
      description: project.summary,
    },
    twitter: { ...sharedTwitter, title: fullTitle, description: project.summary },
  };
}

// بـ Next 15 وما فوق الـ params صارت Promise
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);
  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <ProjectDetail project={project} prev={prev} next={next} />
    </>
  );
}
