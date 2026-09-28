import { BackToTop } from "@/components/layout/back-to-top";
import { NewTabHint } from "@/components/shared/new-tab-hint";
import { SectionLink } from "@/components/shared/section-link";
import { site } from "@/content/site";

const linkClass =
  "rounded transition-colors duration-200 hover:text-emphasis focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** LinkedIn وGitHub وأي حساب تاني، والروابط اللي لسا null (ما وصلت) ما بتنعرض */
const socials = [
  { label: "LinkedIn", url: site.socials.linkedin },
  { label: "GitHub", url: site.socials.github },
  ...(site.socials.others ?? []),
].filter((s): s is { label: string; url: string } => s.url !== null);

export function SiteFooter() {
  return (
    <footer className="border-border/80 border-t">
      <div className="text-subtle mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}. {site.footer.credit}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              {/* بصفحات المشاريع ما في #top، فمنطلع لأول نفس الصفحة بدل ما نروح عالرئيسية */}
              <SectionLink href="/#top" fallbackId="main" className={linkClass}>
                Back to top
              </SectionLink>
            </li>
            <li>
              <a href={site.cvPath} download className={linkClass}>
                CV (PDF)
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {s.label}
                  <NewTabHint />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* عائم (fixed)، بس جوّا الـ footer مشان يكون ضمن landmark لقارئ الشاشة */}
      <BackToTop />
    </footer>
  );
}
