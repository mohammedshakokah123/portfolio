// Temporary token preview for phase 02; replaced by the real sections in phase 05.
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Theme preview</h1>
        <ThemeToggle />
      </div>
      <div className="space-y-2">
        <p className="text-foreground">text-foreground: headings</p>
        <p className="text-body">text-body: body copy</p>
        <p className="text-emphasis">text-emphasis: labels</p>
        <p className="text-muted-foreground">text-muted-foreground: paragraphs</p>
        <p className="text-subtle">text-subtle: secondary</p>
        <p className="text-brand">text-brand: icons and links</p>
        <p className="text-success">text-success: available</p>
        <p className="text-destructive">text-destructive: errors</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button variant="inverted">Inverted</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="rounded-lg border border-border bg-card/30 p-6">
        <span className="rounded-md bg-muted px-2 py-1 text-xs text-emphasis">chip</span>
        <div className="ph-grid mt-4 h-32 rounded-md border border-border" />
      </div>
    </main>
  );
}
