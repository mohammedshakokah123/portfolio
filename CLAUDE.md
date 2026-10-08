@AGENTS.md

# Portfolio: Mohammad Shaquqa

Keep the `@AGENTS.md` import on the first line. `next dev` maintains the block inside `AGENTS.md` and leaves this file alone.

Personal portfolio of a frontend engineer (Latakia, Syria). One Next.js app, statically generated, site copy in English. Not deployed yet.

**Stack:** Next.js 16.3.6 (App Router), React 19.2.8, TypeScript (strict), Tailwind CSS v4. Contact form: react-hook-form, `zod/mini`, a Server Action and Resend. There is no test runner: verification is lint, build, and checking in a browser.

## Status

_Last updated: 2026-10-08. Update this section whenever it stops being true._

The site is being rebuilt from **v1** (a formal dark/light design built with shadcn/ui) into **v2** (a pixel-art platformer game), based on `design/pixel art.html`.

- **v1** is what `src/` contains today. It was implemented through phase 10 of its plan; deployment (phase 11) was never run. Its plan is archived in `docs/plan-v1/`.
- **v2** is fully planned in `docs/plan/` and **no v2 code exists yet**. The next step is phase 01.
- Progress lives in the checklist in `docs/plan/README.md`. That checklist, not this file, says which phase is next.
- The plan and the design file are on branch `feat/chloellia-project`, which is ahead of `main` and not pushed. Phase 01 creates `feat/pixel-art` from the branch that contains `docs/plan/`. Do not branch from `main` until that work is merged.

## Read this before working

1. `docs/plan/README.md`: the index, the progress checklist, and the routine that ends every phase.
2. `docs/plan/00-overview.md`: the decisions, a map from every block of the reference to the file and phase that ports it, the target folder tree, the conventions, the intentional differences from the reference, and the risks.
3. The file of the phase being worked on. It contains the code to write and the exact line ranges to port, so there is no need to read the reference (about 2,600 lines) in full.

The TypeScript in the phase files was extracted and passes `tsc` and `eslint` with this repo's config. The sprite generator in phase 02 reproduces the reference output byte for byte. Nothing in the plan has been run in a browser yet.

## Decisions already made

The owner made these on 2026-10-08. Do not reopen them unless the owner does.

1. v2 **replaces** v1 and matches the reference 1:1, including looping animation, sound effects and collectible gems. An earlier rule ("formal audience, one-time motion only") was lifted by the owner.
2. The reference CSS is **ported as-is** into `src/styles/pixel/*.css` with its class names. Tailwind stays for utilities only.
3. Project details open in a native `<dialog>`, and the `/projects/[slug]` pages are removed. The site becomes one page (`/`) whose six stages and project dialogs are all server-rendered. `html[data-stage]` shows one stage at a time.
4. Sprites are generated at build time: `scripts/build-sprites.mjs` turns the maps in `src/pixel/` into `src/styles/pixel/sprites.generated.css`. The output must match the reference byte for byte (`npm run sprites:check`).
5. The game engine is plain TypeScript modules in `src/game/`, ported from the reference script. State lives in small stores read with `useSyncExternalStore`. Clicks are handled by listeners on `document`, so stage content stays Server Components.
6. Content comes from `src/content/`. The projects and contact details inside the reference are placeholders. The contact form keeps the Server Action and Resend.
7. No new dependencies. v2 removes `next-themes`, `sonner`, `radix-ui`, `shadcn`, `class-variance-authority`, `tw-animate-css` and `lucide-react`.

## Commands

```bash
npm run dev            # http://localhost:3000
npm run build          # must pass at the end of every phase
npm run lint
npm run format
npm run sprites        # from phase 02 on: regenerate sprites.generated.css
npm run sprites:check  # from phase 02 on: compare the output with the reference
```

- `npm run build` needs `NEXT_PUBLIC_SITE_URL`. `src/content/site.ts` throws without it, on purpose. It is set in `.env.local`, together with `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` for the contact form.
- A phase ends with `npm run format && npm run lint && npm run build`. Then compare with the reference, opened directly in a browser next to `localhost:3000`, at 375, 768, 1024, 1280, 1440 and 1680px, in day and night mode, and again with reduced motion and with the keyboard only.

## Codebase map

**Today (v1). Phase 01 deletes most of it.**

| Path | Contents |
|------|----------|
| `src/app/` | `layout.tsx`, `page.tsx` (six scroll sections), `projects/[slug]/`, `actions/contact.ts`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `globals.css` (shadcn tokens) |
| `src/components/` | `ui/` (shadcn), `layout/`, `sections/`, `projects/`, `contact/`, `motion/`, `shared/`, `providers/` |
| `src/content/` | `site.ts`, `skills.ts`, `experience.ts`, `projects.ts`: all copy and data, typed by `src/types/content.ts` |
| `src/lib/` | `dates.ts`, `validations/contact.ts`, `seo/`, `sections.ts`, `utils.ts` (`cn`) |

Kept unchanged in v2: `src/app/actions/contact.ts`, `src/lib/validations/contact.ts`, `src/lib/dates.ts`, `src/lib/seo/metadata.ts`, `src/app/robots.ts`, `src/components/shared/json-ld.tsx` and `src/components/shared/new-tab-hint.tsx`.

**Target (v2).** The full tree is in `docs/plan/00-overview.md`.

| Path | Contents |
|------|----------|
| `src/pixel/` | Sprite maps (ASCII, one character per pixel) and the SVG generator. Build-time only, run directly by Node |
| `src/game/` | The engine: router, hero, wipe, sound, gems, effects, dialogs, stores, boot script |
| `src/styles/pixel/` | One CSS file per section of the reference, plus `sprites.generated.css` and `fallbacks.css` |
| `src/components/` | `pixel/` (UI kit), `layout/` (HUD, world, overlays), `game/` (client islands), `stages/`, `projects/`, `contact/`, `shared/` |

**Assets and references**

- `design/pixel art.html` is the v2 reference. The file name contains a space, so quote it in commands. `design/reference.html` is the v1 reference.
- `public/projects/SooqSuria/`, `public/projects/Klardent/` and `public/projects/Chloellia/` each hold `00-cover.webp` (1920×768, the cartridge image in v2), `00-hero.webp` (1920×1200) and numbered gallery screenshots.
- The CV is `public/cv/Mouhammad-Shakokah-CV.pdf`.

## Rules for v2 work

- The reference is the spec. Port CSS and JS as they are. Only the changes listed in the phase file are allowed. If something else has to change, stop and ask.
- Anything added that the reference does not have goes under a comment of the form `/* إضافة عن المرجع: <reason> */`.
- The import order in `globals.css` mirrors the section order of the reference. Rules of equal specificity depend on it, so do not reorder.
- `src/pixel/**` is executed by Node: relative imports carry the `.ts` extension, types use `import type`, and there is no `enum`, no `namespace` and no `@/` alias.
- Never edit `sprites.generated.css` by hand.
- Client components must not import `@/content/site`. It resolves the site URL and pulls all content into the bundle. Pass strings as props instead. `@/content/labels` is allowed.
- The engine may change the DOM directly only on nodes rendered by Server Components. Any `aria-*` attribute or text that follows state belongs in a client component subscribed to a store.
- Links between stages are plain `<a href="#about">`. `next/link` is used only on the 404 page.
- Line numbers in the plan refer to the reference at commit `04412b1`.

## Conventions

- Server Components by default. `"use client"` only where the component needs it.
- Files in kebab-case, components in PascalCase, named exports. Default exports only for pages and layouts.
- No copy hard-coded in components: text comes from `src/content/`.
- Code comments and plan docs are written in Syrian Arabic with English technical terms. Site copy and identifiers are English.
- Commits follow Conventional Commits in English (`feat:`, `fix:`, `docs:`, `chore:`). v1 used one commit per finished phase, for example `feat: add hero and about sections (phase 05)`.
- When a phase is finished, tick it in `docs/plan/README.md`, note under it anything that deviated from the plan, and update the Status section above.
- The owner writes in Syrian Arabic. Reply in the same dialect.

## Gotchas

- `next build` type-checks every file under `src/`, imported or not. A leftover file that imports a removed package fails the build.
- ESLint is strict (`eslint-plugin-react-hooks` 7): no `setState` inside an effect, no ref read during render, and no passing a function that reads a ref to another function during render. That last one fired on `handleSubmit(onSubmit)` when `onSubmit` read a ref. `@next/next` also warns about `location.assign("/…")` for internal destinations.
- Tailwind's preflight is active: links have no underline, and every element starts with zero margin, padding and border.
- A class with the name of a Tailwind utility collides with it. The reference's `.block` is `.q-block` in v2.
- In v2 `<main>` has `pointer-events: none`, and a `<dialog>` inside it inherits that even in the top layer. A `<dialog>` opened inside a `display: none` ancestor leaves the page inert with nothing visible.
- In development, React Strict Mode strips the attributes the boot script sets on `<html>`. The plan's `reapplyBoot()` restores them. Background: `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`.
- Git prints CRLF warnings on this Windows machine. They are harmless.

## Open items for the owner

- Is the Davinda job still current? `davinda.period.end` is `"2026-09"`, so v2 will label it "Quest complete".
- Name spelling: the site says "Mohammad Shaquqa", while the CV file and the GitHub account say "Shakokah". One spelling is needed before deployment.
- Still missing: profile photo, public email, LinkedIn and GitHub URLs, domain. They are `null` in `src/content/site.ts`, and components hide whatever is `null`.
- `public/projects/Chloellia/PORTFOLIO.md`, `public/projects/SooqSuria/PORTFOLIO.md` and `public/projects/Klardent/klardent-portfolio.md` are working notes that get served publicly because they sit in `public/`.

The full table is in `docs/plan/13-deploy.md`.
