import { FlaskConical, Megaphone } from "lucide-react";

import type { Project } from "@/types/content";

const sooqSuria = "/projects/SooqSuria";
const klardent = "/projects/Klardent";

export const projects: readonly Project[] = [
  {
    slug: "classifieds-admin-dashboard",
    title: "Classifieds Marketplace Admin Dashboard",
    subtitle: "C2C marketplace, back-office moderation and operations system",
    summary:
      "Back-office dashboard for a C2C classifieds marketplace: ad moderation, bulk listing import, seller verification, and wallet transactions, in English and Arabic.",
    icon: Megaphone,
    image: {
      src: `${sooqSuria}/00-hero.webp`,
      alt: "Admin KPI dashboard shown in light and dark themes, with activity, revenue, and registration figures and a comparison chart",
    },
    placeholderLabel: "Screenshot placeholder for the classifieds admin dashboard",
    tech: ["React", "TanStack Query", "React Hook Form", "Tailwind CSS", "i18next"],
    overview:
      "SooqSuria is a classifieds marketplace where users post ads for cars, real estate, and electronics from a mobile app. Every listing, seller, and payment has to be reviewed by the platform's team before it can be trusted: ads need approval, sellers need identity verification, wallet top-ups arrive as cash and bank transfers that staff record by hand, and dealers want to publish hundreds of listings at once. The dashboard gives that team one web tool for all of it, with each role seeing only the sections it is responsible for.",
    architecture:
      "React SPA built with Vite, consuming a REST API. Server state (ads, users, transactions, tickets) lives in TanStack Query, with one module of query and mutation hooks per resource and cache invalidation after every write, so tables stay current without manual refetching. Pagination, search, and filtering run on the server behind a single reusable table component built on TanStack Table. A central Axios instance attaches the auth token and language header and maps API errors to consistent toasts. Routes and sidebar items are both gated by the same role configuration.",
    features: [
      "Four-step bulk import wizard (upload, map columns, validate, import) with row-level error fixing, auto-fix, and resumable sessions.",
      "Ad review page that diffs the owner's edits field by field, showing the old value next to the new one.",
      "Smart search that detects whether the input is a title, phone number, email, or ID and sends the matching filter.",
      "Role-based access for six staff roles, enforced in routing and in the UI.",
      "Full English and Arabic support with automatic RTL layout, plus light and dark themes.",
      "Create-ad form with category-specific dynamic fields, image and video upload, and a live preview.",
      "KPI dashboard with daily, weekly, and monthly comparison and Excel export.",
    ],
    stack: [
      "React",
      "Vite",
      "React Router",
      "TanStack Query",
      "TanStack Table",
      "React Hook Form",
      "Zod",
      "Axios",
      "Tailwind CSS",
      "shadcn/ui",
      "Recharts",
      "i18next",
    ],
    links: {},
    nda: false,
    accessNote: "Client project, admin access only",
    gallery: [
      {
        src: `${sooqSuria}/04-ads-management.webp`,
        alt: "Ads management table with status counters, search, and per-ad review actions",
        caption: "Ads management with status counters and filters",
      },
      {
        src: `${sooqSuria}/02-dashboard.webp`,
        alt: "KPI dashboard with active users, listings, revenue, and a daily, weekly, and monthly comparison chart",
        caption: "KPI dashboard with period comparison",
      },
      {
        src: `${sooqSuria}/06-ad-details.webp`,
        alt: "Ad details page highlighting the edited title and price with the old value next to the new one",
        caption: "Ad review with field-by-field edit diff",
      },
      {
        src: `${sooqSuria}/08-user-details.webp`,
        alt: "User dialog showing contact details, wallet balance, the user's ads, and top-up, reset password, and suspend actions",
        caption: "User details with wallet top-up and account actions",
      },
      {
        src: `${sooqSuria}/10-verification-requests.webp`,
        alt: "Seller verification requests list",
        caption: "Seller verification requests",
      },
      {
        src: `${sooqSuria}/09-support-ticket.webp`,
        alt: "Support ticket dialog opened over the tickets list",
        caption: "Support ticket dialog",
      },
      {
        src: `${sooqSuria}/05-ads-management-arabic-rtl.webp`,
        alt: "Ads management page in Arabic with a right-to-left layout",
        caption: "Arabic (RTL) interface",
      },
      {
        src: `${sooqSuria}/07-popular-ads-dark.webp`,
        alt: "Popular ads grid in dark mode, ranked by views, likes, and favourites",
        caption: "Most viewed, liked, and favourited ads, in dark mode",
      },
      {
        src: `${sooqSuria}/03-dashboard-dark.webp`,
        alt: "KPI dashboard in dark mode",
        caption: "KPI dashboard in dark mode",
      },
      {
        src: `${sooqSuria}/01-login.webp`,
        alt: "Staff login screen",
        caption: "Staff login",
      },
    ],
  },
  {
    slug: "klardent-dental-lab-saas",
    title: "Klardent: Dental Lab Management SaaS",
    subtitle: "Multi-tenant B2B platform for dental laboratories and the dentists they work with",
    summary:
      "Multi-tenant SaaS for dental laboratories, covering quotes, case production, quality review, invoicing, and payroll across five user roles in three languages.",
    icon: FlaskConical,
    image: {
      src: `${klardent}/00-hero.webp`,
      alt: "Lab admin case details page shown in light and dark themes, with case information, team assignment, attachments, and quote pricing",
    },
    placeholderLabel: "Screenshot placeholder for the Klardent dental lab platform",
    tech: ["React", "TanStack Query", "Tailwind CSS", "Firebase", "Stripe"],
    // \n\n = فقرة جديدة بصفحة التفاصيل
    overview:
      "Dental labs coordinate work between dentists, technicians, and quality reviewers, and most of that coordination happens over phone calls, chat apps, and spreadsheets. Quotes get lost, nobody knows which stage a case is in, and invoices are prepared by hand at the end of the month.\n\nKlardent puts the whole workflow in one web platform. A dentist submits a case and requests a quote, the lab prices it and assigns it, a technician works through the production steps, a reviewer approves or sends it back, and the lab invoices the dentist. Labs subscribe to the platform on a paid plan, and a separate console lets the platform owner manage labs, plans, promotions, and support.",
    architecture:
      "React single-page application built with Vite and styled with Tailwind CSS on top of shadcn/ui (Radix) components. The app serves five roles from one codebase: platform super admin, lab admin, technician, reviewer, and doctor. Each role has its own route tree, sidebar, and dashboard.\n\nAll server state lives in TanStack Query, organised as one query module per resource (cases, quotes, invoices, salaries, subscriptions, tickets, and so on). A small auth context holds the current user and their permissions, and a single route guard enforces authentication, role, and permission checks before a page renders. A shared Axios instance attaches the token and the active language to every request and handles expired sessions and API errors in one place.\n\nForms use React Hook Form with Zod schemas. Real-time features run on Firebase: Firestore listeners for chat and Cloud Messaging with a service worker for push notifications. Subscription payments go through Stripe Elements.",
    features: [
      "Role and permission based access control across around 70 routes, enforced in routing and in the UI, with each role redirected to its own dashboard.",
      "Full case lifecycle from quote request to delivery, with per-case work steps, progress tracking, file attachments, and a review queue for approving or rejecting finished work.",
      "Four-step lab registration wizard (lab details, account, plan selection, payment) with Stripe checkout, free trials, and coupon codes.",
      "Subscription billing for labs: plan upgrades, payment history, and plan limits reflected in the interface.",
      "Real-time chat between labs and doctors on Firestore, plus push notifications through Firebase Cloud Messaging.",
      "Three languages (English, German, Arabic) with full right-to-left layout for Arabic and more than 2,000 translation keys per language.",
      "Light and dark themes across every screen.",
      "Analytics dashboards per role built with Recharts, including revenue trends, case status distribution, and technician performance.",
      "Data tables with server-side pagination, filtering, and debounced search built on TanStack Table.",
      "File uploads with a progress indicator and the option to cancel mid-upload.",
      "Platform console for the owner: lab management, subscription plans, promotions, transactions, support tickets, and a CMS for the public landing page and FAQs.",
      "Invoicing and payroll modules, including salary slips and leave requests for lab staff.",
    ],
    stack: [
      "React 18",
      "JavaScript",
      "Vite",
      "React Router 7",
      "TanStack Query",
      "TanStack Table",
      "React Hook Form",
      "Zod",
      "Axios",
      "Tailwind CSS",
      "shadcn/ui (Radix UI)",
      "Recharts",
      "i18next",
      "Firebase (Firestore, Cloud Messaging)",
      "Stripe",
    ],
    links: { demo: "https://klardent.net/" },
    nda: false,
    gallery: [
      {
        src: `${klardent}/03-case-details.webp`,
        alt: "Lab admin case details page with case information, assigned doctor, technician, and reviewer, attachments, and quote pricing",
        caption: "Case details and team assignment (lab admin)",
      },
      {
        src: `${klardent}/05-quote-request.webp`,
        alt: "Quote request page with the doctor's request details and a form for line items, delivery date, and quote validity",
        caption: "Pricing a doctor's quote request",
      },
      {
        src: `${klardent}/02-doctor-create-case.webp`,
        alt: "Create new case form with patient information, case type, material, shade, a tooth selection chart, and a submission checklist",
        caption: "Doctor portal: submitting a new case",
      },
      {
        src: `${klardent}/06-doctor-case-detail.webp`,
        alt: "Doctor's case detail page showing case status, patient information, and case information with selected teeth",
        caption: "Doctor portal: case status and details",
      },
      {
        src: `${klardent}/10-technician-schedule.webp`,
        alt: "Technician schedule listing upcoming deadlines with case number, patient, work type, and priority",
        caption: "Technician schedule and deadlines",
      },
      {
        src: `${klardent}/11-technician-performance.webp`,
        alt: "Technician performance page",
        caption: "Technician performance",
      },
      {
        src: `${klardent}/12-quality-reports.webp`,
        alt: "Quality reports page with approved, revision, and rejected counts, first-pass approval rate, and common revision reasons",
        caption: "Reviewer quality reports",
      },
      {
        src: `${klardent}/09-materials-inventory.webp`,
        alt: "Materials inventory page",
        caption: "Materials inventory",
      },
      {
        src: `${klardent}/13-vacations.webp`,
        alt: "Vacations page for staff leave requests",
        caption: "Staff leave requests",
      },
      {
        src: `${klardent}/08-subscription-plan-multicurrency.webp`,
        alt: "Create subscription plan form in the platform console, with plan names in three languages and pricing in SAR, USD, and EUR",
        caption: "Platform console: subscription plan with multi-currency pricing",
      },
      {
        src: `${klardent}/07-dashboard-arabic-rtl.webp`,
        alt: "Dashboard in Arabic with a right-to-left layout",
        caption: "Arabic (RTL) interface",
      },
      {
        src: `${klardent}/04-case-details-dark.webp`,
        alt: "Case details page in dark mode",
        caption: "Case details in dark mode",
      },
      {
        src: `${klardent}/01-login.webp`,
        alt: "Login screen",
        caption: "Login",
      },
    ],
  },
];

/** النصوص الثابتة بكروت المشاريع وصفحة التفاصيل */
export const projectLabels = {
  viewDetails: "View details",
  placeholder: "Screenshot",
  overview: "Overview & business problem",
  architecture: "Architecture",
  features: "Key technical features",
  stack: "Stack",
  gallery: "Screenshots",
  nda: "Internal system, under NDA",
  noPublicDemo: "No public demo available", // مشروع مش NDA بس ما إلو رابط (أو داشبورد خاص)
  requestWalkthrough: "Request a walkthrough",
  liveDemo: "Live demo",
  sourceCode: "Source code",
} as const;

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i < projects.length - 1 ? projects[i + 1] : null,
  };
}
