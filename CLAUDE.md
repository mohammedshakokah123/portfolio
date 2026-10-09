@AGENTS.md

# Portfolio: Mohammad Shakokah

Keep the `@AGENTS.md` import on the first line. `next dev` maintains the block inside `AGENTS.md` and leaves this file alone.

Personal portfolio of a frontend engineer (Latakia, Syria). One Next.js app, statically generated, site copy in English. Not deployed yet.

**Stack:** Next.js 16.3.6 (App Router), React 19.2.8, TypeScript (strict), Tailwind CSS v4. Contact form: react-hook-form, `zod/mini`, a Server Action and Resend. There is no test runner: verification is lint, build, and checking in a browser.

## Status

_Last updated: 2026-10-09. Update this section whenever it stops being true._

The site is being rebuilt from **v1** (a formal dark/light design built with shadcn/ui) into **v2** (a pixel-art platformer game), based on `design/pixel art.html`.

- **v1** is on `main` and `feat/chloellia-project`. It was implemented through phase 10 of its plan; deployment (phase 11) was never run. Its plan is archived in `docs/plan-v1/`.
- **v2** is planned in `docs/plan/` and is being built on branch `feat/pixel-art`. Phases 01 to 11 are done: foundation, sprites, UI kit (previewed on the temporary `/kit` route), content, the fixed shell (world scene, HUD, ground bar, day/night toggle), the stage engine (router, hero, wipe, sound, pause menu), all six stages (title screen, About, Skills, Experience, Projects with its project dialogs and screenshot lightbox, and Contact, whose form sends real email through Resend), and the gems (one per stage, collected with a click, saved in `ms-gems`, counted in the HUD and in the pause menu). Since phase 10 the site uses the same font files the reference gets from Google on Windows, and everything built so far matches the reference pixel for pixel, with the reference loading its own fonts, when both show the same text. Where the reference's content is placeholder (the projects, the contact links), that comparison renders the port's markup inside the reference, together with the few rules the port adds on purpose (each under an `إضافة عن المرجع` comment; the visible ones are in the table of intentional differences in `docs/plan/00-overview.md`). The owner confirmed that the phase 10 test emails arrived, and on 2026-10-09 settled its two open points by keeping what the reference does: the form grows when its error messages wrap to two lines, and the submit button is `disabled` while sending, so the focus falls to `<body>` afterwards. At the owner's request the submit button also shows a CSS-only pixel loader in place of its icon while sending (`.loader` in `contact.css`); results still appear in the status line below the form. Content the owner added the same day: Chloéllia has two links ("Live demo" and a new "Live site" button, which Klardent now uses too), and the Contact links list phone, WhatsApp, GitHub and Facebook. Phase 11 (2026-10-09) was compared with the reference with the gem as part of the comparison, and every row of its sound table was checked against the reference. One difference comes from the plan itself and waits for the owner: the gem counter goes up at the click, while the reference changes it 500ms later, when the gem disappears. After phase 11, at the owner's request (2026-10-09): the surname is spelled "Shakokah" in the site, and every scrollbar is drawn in the kit's style (the block at the end of `base.css`; mouse devices only, 21px wide). The longer name and the visible scrollbar exposed an overlap that the reference has too (the HUD name ran under its neighbours from 720px and from 1240px). It is fixed by showing the short CV label at 720–819px and 1240–1309px (end of `hud.css`). The next step is phase 12.
- Progress lives in the checklist in `docs/plan/README.md`. That checklist, not this file, says which phase is next.
- `feat/pixel-art` was created from `feat/chloellia-project`, which holds the plan and the design file and is ahead of `main`. Neither branch is pushed. Do not branch from `main` until that work is merged.

## Read this before working

1. `docs/plan/README.md`: the index, the progress checklist, and the routine that ends every phase.
2. `docs/plan/00-overview.md`: the decisions, a map from every block of the reference to the file and phase that ports it, the target folder tree, the conventions, the intentional differences from the reference, and the risks.
3. The file of the phase being worked on. It contains the code to write and the exact line ranges to port, so there is no need to read the reference (about 2,600 lines) in full.

The TypeScript in the phase files was extracted and passes `tsc` and `eslint` with this repo's config. The sprite generator in phase 02 reproduces the reference output byte for byte. Phases 12 and 13 have not been run in a browser yet.

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

**v1 (on `main`). Phase 01 removed most of it from `feat/pixel-art`.**

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
- `src/assets/fonts/` holds the two site fonts: the latin subsets of Press Start 2P and Pixelify Sans, byte for byte the files Google serves the reference to Chrome on Windows (with TrueType hinting). `src/lib/fonts.ts` declares them with `next/font/local`, `layout.tsx` imports it, and `tokens.css` names the families literally, as the reference does.

## Rules for v2 work

- The reference is the spec. Port CSS and JS as they are. Only the changes listed in the phase file are allowed. If something else has to change, stop and ask.
- Anything added that the reference does not have goes under a comment of the form `/* إضافة عن المرجع: <reason> */`.
- The import order in `globals.css` mirrors the section order of the reference. Rules of equal specificity depend on it, so do not reorder.
- `src/pixel/**` is executed by Node: relative imports carry the `.ts` extension, types use `import type`, and there is no `enum`, no `namespace` and no `@/` alias.
- Never edit `sprites.generated.css` by hand.
- An icon the reference does not have goes in `EXTRA_ICONS` in `src/pixel/sprites/icons.ts`, never in `ICONS`. The generator appends those after the reference output, and `sprites:check` still compares the reference part byte for byte. `phone` and `chat` (the Contact rows) are there.
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
- `npm run format` is `prettier --write .`, and nothing ignores `design/` or `docs/`. Run as written it reformats `design/pixel art.html` (2,614 lines become 5,269, so the plan's line numbers stop matching), `design/reference.html`, every plan file and this file. Until `.prettierignore` covers them, format with `npx prettier --write src scripts package.json` and check that `git status -- design docs` is empty.
- JSX text mixed with an expression (`0/{total}`, `Stage {n}`) renders as several text nodes, and kerning stops at each boundary. In Pixelify Sans that changes the width by a fraction of a pixel and can move a glyph. Write such text as one template string: `` {`0/${total}`} ``. Press Start 2P has no kerning, so it is not affected.
- React hydrates `<title>` after the engine's first `render()`, which resets `document.title`. `initRouter` keeps a `MutationObserver` on `<head>` for that. Do not remove it.
- `next/font/local` under Turbopack (Next 16.3.6) has three traps, all hit in phase 10. The `variable` and `className` it returns use the JS variable name (`pressStart`) as the family, not the `font-family` given in `declarations`, so they point at a family that does not exist: `src/lib/fonts.ts` uses neither, and `tokens.css` names the families. A `"` inside a declaration value breaks the build, because the options travel as unescaped JSON: use single quotes. And the family name must be quoted: unquoted, `Press Start 2P` (a word that starts with a digit) makes the whole `@font-face` invalid, the browser drops it without a message, and the text falls back to Consolas. Option values must also be literals, not constants.
- `next dev` keeps its files in `.next/dev`. Deleting `.next` while a dev server runs breaks that server (`EPERM` and `Module not found` errors) until it is restarted. `npm run build` does not need `.next` deleted.
- `next start` can leave one optimized image hanging. When the first request for a `/_next/image` variant that is not cached yet is cut off in its first few milliseconds (a reload or a navigation right after `load`, which is what scripted comparisons do), that variant stays pending inside the server process, and every later request for the same URL waits forever until the server is restarted. It shows up as one cover or thumbnail that never loads while the others do. Restart the server before looking for a bug in the page, and in scripted runs request every variant once, without aborting, before the first reload. The cause is in Next 16.3.6 (`fetchInternalImage` in `node_modules/next/dist/server/image-optimizer.js` hands the client's socket to the internal request), not in this repo. `next dev` was not tested. Details are in the notes at the end of `docs/plan/09-projects.md`.
- In Chrome, `getComputedStyle` returns an `auto` margin either as the used value or as `0px`, depending on the last layout. When a comparison with the reference reports only a `margin` difference on a centred element such as `.stage-inner`, and the rectangles are equal, the two pages are the same.
- Screenshots of the same page can differ by a few low-contrast pixels inside an image. In one browser session Chrome draws a scaled image differently depending on the size the same image was shown at before, and a comparison script visits many viewport sizes in one session. A difference that stays inside one `<img>`, with identical computed styles around it, is this and not CSS. A screenshot taken in a fresh session settles it.
- Playwright hides every scrollbar in headless mode (`--hide-scrollbars`), so the scripted comparisons with the reference lay the page out on the full viewport width and never show the custom scrollbar. A real desktop browser gives 21px to it on every stage that scrolls. Anything tight (the HUD above all) must also be checked with the scrollbar visible: launch with `ignoreDefaultArgs: ["--hide-scrollbars"]`.
- `.btn-icon` is 44px wide in the reference but has no `flex: none`, so it shrinks in a flex row as soon as its neighbour wraps (the dialog close button was 24px wide on phones). Wherever an icon button sits next to text that can wrap, give the button `flex: none` and the text `min-width: 0`, under an `إضافة عن المرجع` comment.

## Open items for the owner

- Gem counter timing: it goes up at the click, as the phase 11 plan says. The reference changes it 500ms later, when the gem disappears. Keep it, or match the reference (a few lines in `collect()` in `src/game/gems.ts`)? Details are in the notes at the end of `docs/plan/11-gems.md`.
- Is the Davinda job still current? `davinda.period.end` is `"2026-09"`, so v2 will label it "Quest complete".
- Name spelling: the owner settled the surname on 2026-10-09. The site says "Mohammad Shakokah", like the CV file, the GitHub account (`mohammedshakokah123`) and the Facebook profile (`mohammed.shakokah`). What is left is the first name: the CV file is `Mouhammad-…` and the accounts say "mohammed", and `site.alternateNames` holds only the Arabic name. The two reference files in `design/` and the v1 archive in `docs/plan-v1/` still say "Shaquqa", on purpose.
- Still missing: profile photo, public email, LinkedIn URL, domain. They are `null` in `src/content/site.ts`, and components hide whatever is `null`. GitHub, Facebook and the phone and WhatsApp number (`+963 933 981 269`) were added on 2026-10-09.
- `public/projects/Chloellia/PORTFOLIO.md`, `public/projects/SooqSuria/PORTFOLIO.md` and `public/projects/Klardent/klardent-portfolio.md` are working notes that get served publicly because they sit in `public/`.
- Should `.prettierignore` cover `design/`, `docs/`, `public/` and `CLAUDE.md`? See the `npm run format` gotcha above.

The full table is in `docs/plan/13-deploy.md`.
