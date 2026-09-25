import { Download } from "lucide-react";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SectionLink } from "@/components/shared/section-link";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="border-border/80 bg-background/90 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <SectionLink
          href="/#top"
          className="focus-visible:ring-ring focus-visible:ring-offset-background flex min-w-0 items-baseline gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="text-foreground truncate text-[15px] font-semibold tracking-tight">
            {site.name}
          </span>
          <span className="text-subtle hidden sm:inline" aria-hidden="true">
            |
          </span>
          <span className="text-muted-foreground hidden truncate text-sm sm:inline">
            {site.role}
          </span>
        </SectionLink>

        <DesktopNav items={site.nav} />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="lg" className="px-3 text-sm sm:px-4">
            <a href={site.cvPath} download>
              <Download aria-hidden="true" />
              <span className="hidden sm:inline">Download CV (PDF)</span>
              <span className="sm:hidden">CV</span>
            </a>
          </Button>
          <MobileNav items={site.nav} />
        </div>
      </div>
    </header>
  );
}
