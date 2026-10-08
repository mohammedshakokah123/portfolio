import type { MetadataRoute } from "next";

import { contentUpdatedAt, site } from "@/content/site";

// تاريخ ثابت مش new Date(): غير هيك كل build بيقول لـ Google "كل شي تغيّر"، ومع الوقت بيتجاهل الـ lastModified
const lastModified = new Date(contentUpdatedAt);

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified, changeFrequency: "monthly", priority: 1 }];
}
