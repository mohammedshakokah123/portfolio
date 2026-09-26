import type { MetadataRoute } from "next";

import { getAllProjects } from "@/content/projects";
import { contentUpdatedAt, site } from "@/content/site";

// تاريخ ثابت مش new Date(): غير هيك كل build بيقول لـ Google "كل شي تغيّر"، ومع الوقت بيتجاهل الـ lastModified
const lastModified = new Date(contentUpdatedAt);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...getAllProjects().map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
