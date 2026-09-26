import { university } from "@/content/experience";
import { contentUpdatedAt, site } from "@/content/site";
import type { Project } from "@/types/content";

const personId = `${site.url}/#person`;

/** new URL بدل دمج النصوص: بيزبط مع "/x.jpg" و"x.jpg" ورابط CDN كامل */
const absoluteUrl = (src: string) => new URL(src, site.url).href;

export function personJsonLd() {
  const sameAs = [
    site.socials.linkedin,
    site.socials.github,
    ...(site.socials.others ?? []).map((s) => s.url),
  ].filter((u): u is string => !!u && /^https?:\/\//.test(u)); // لا null (لسا ما وصل) ولا رابط ناقص

  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.alternateNames,
    givenName: "Mohammad",
    familyName: "Shaquqa",
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    image: site.profileImage ? absoluteUrl(site.profileImage) : undefined,
    email: site.email ? `mailto:${site.email}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: "Latakia", addressCountry: "SY" },
    alumniOf: { "@type": "CollegeOrUniversity", name: university.org },
    // قائمة منقّاية بقصد: تقنيات بيعرفها Google، مش كل نصوص قسم Skills
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Redux Toolkit",
      "TanStack Query",
    ],
    sameAs: sameAs.length ? sameAs : undefined, // [] فاضي ما إلو معنى، فمنشيله
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profilepage`,
        url: site.url,
        name: `${site.name} | ${site.role}`,
        mainEntity: { "@id": personId },
        dateModified: contentUpdatedAt,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        alternateName: site.alternateNames,
        publisher: { "@id": personId },
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // الـ Person كامل هون كمان: Google ما بيربط @id بين صفحات مختلفة، فبدونه الـ creator بيطلع فاضي
      personJsonLd(),
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: `${site.url}/projects/${project.slug}`,
        image: project.image ? absoluteUrl(project.image.src) : undefined,
        creator: { "@id": personId },
        keywords: project.stack.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${site.url}/#projects` },
          { "@type": "ListItem", position: 3, name: project.title },
        ],
      },
    ],
  };
}
