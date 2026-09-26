import type { Metadata } from "next";

import { site } from "@/content/site";

/** عنوان الرئيسية والـ default لأي صفحة ما إلها title. الاسم أول شي */
export const defaultTitle = `${site.name} | ${site.role}`;

/**
 * الـ metadata بـ Next بتندمج shallow: أي صفحة بتعرّف `openGraph` أو `twitter` بتمسح تبع الـ layout كله.
 * مشان هيك الحقول المشتركة هون، والـ layout وصفحات المشاريع بيعملولها spread.
 */
export const sharedOpenGraph = {
  siteName: site.name,
  locale: "en_US",
} satisfies Metadata["openGraph"];

export const sharedTwitter = {
  card: "summary_large_image",
} satisfies Metadata["twitter"];
