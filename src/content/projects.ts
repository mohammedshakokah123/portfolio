import { Component, LayoutDashboard, ScanBarcode, ShoppingCart } from "lucide-react";

import type { Project } from "@/types/content";

export const projects: readonly Project[] = [
  {
    slug: "pos-inventory",
    title: "POS & Inventory Management System",
    subtitle: "Multi-branch retail, internal business system",
    summary:
      "Point-of-sale and stock control for multi-branch retail, with offline-tolerant checkout and live inventory sync across stores.",
    icon: ScanBarcode,
    image: null, // TODO: { src: "/projects/pos.webp", alt: "..." }
    placeholderLabel: "Screenshot placeholder for the POS and inventory system",
    tech: ["React", "TypeScript", "Zustand", "TanStack Query", "Tailwind CSS"],
    overview:
      "Store staff were reconciling sales and stock across branches with spreadsheets, which meant stock counts drifted from reality and managers found out about shortages too late. The system replaces that with a single web-based POS and inventory tool used at the counter and in the back office.",
    architecture:
      "React + TypeScript SPA built with Vite. Server state (products, stock levels, orders) lives in TanStack Query with per-resource cache keys; transient UI state (the active cart, register session, selected branch) lives in small, focused Zustand stores. Feature-based folder structure keeps checkout, inventory, and reporting independently maintainable.",
    features: [
      "Keyboard-first checkout with barcode scanner input, optimised for speed at the counter.",
      "Optimistic cart and stock updates with automatic rollback when the API rejects a change.",
      "Queued sales when the connection drops, replayed in order once the register is back online.",
      "Role-based access for cashiers, branch managers, and admins, enforced in routing and UI.",
      "Printable receipts and exportable daily sales reports.",
    ],
    stack: ["React", "TypeScript", "Zustand", "TanStack Query", "Axios", "Tailwind CSS", "Vite"],
    links: {},
    nda: true,
  },
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Customer-facing storefront",
    summary:
      "Server-rendered storefront with faceted search, a persistent cart, and a multi-step checkout designed for fast first loads on mobile.",
    icon: ShoppingCart,
    image: null, // TODO: { src: "/projects/ecommerce.webp", alt: "..." }
    placeholderLabel: "Screenshot placeholder for the e-commerce platform",
    tech: ["Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    overview:
      "Most shoppers arrive on mobile from search and social links, so slow first loads and a long checkout were costing sales. The storefront was rebuilt around fast server-rendered pages, search-friendly product URLs, and a shorter checkout.",
    architecture:
      "Next.js with a mix of static generation for catalogue pages and server rendering for personalised pages. Redux Toolkit manages the cart and checkout flow, persisted to storage so the cart survives reloads. Product data is fetched through a typed API layer shared between server and client.",
    features: [
      "Faceted filtering and sorting synced to the URL, so every result set is shareable and indexable.",
      "Multi-step checkout with inline validation and clear recovery from payment errors.",
      "Optimised images with explicit dimensions to avoid layout shift on product grids.",
      "Structured data and meta tags generated per product for search engines.",
      "Fully responsive layout tested down to 320px viewports.",
    ],
    stack: ["Next.js", "TypeScript", "Redux Toolkit", "Axios", "Tailwind CSS"],
    links: {}, // TODO: { demo, source } إذا في رابط عام. إذا بيضل {} بيطلع "No public demo available"
    nda: false,
  },
  {
    slug: "operations-dashboard",
    title: "Real-time Operations Dashboard",
    subtitle: "Internal tool for operations managers",
    summary:
      "Live monitoring of orders, staff activity, and KPIs for operations managers, streamed over WebSockets with role-based views.",
    icon: LayoutDashboard,
    image: null, // TODO: { src: "/projects/dashboard.webp", alt: "..." }
    placeholderLabel: "Screenshot placeholder for the operations dashboard",
    tech: ["React", "WebSockets", "TanStack Query", "Zustand", "Axios"],
    overview:
      "Operations managers relied on end-of-day reports, so delays and bottlenecks were discovered hours after they happened. The dashboard gives them a live view of orders, staff activity, and key metrics so they can act during the shift.",
    architecture:
      "React SPA with a single WebSocket connection manager that merges live events into the TanStack Query cache, so REST snapshots and streamed updates share one source of truth. Zustand holds dashboard preferences such as filters, time range, and panel layout.",
    features: [
      "Automatic reconnection with backoff and a resync of missed data after reconnecting.",
      "Batched event updates to keep rendering smooth during bursts of activity.",
      "Virtualised tables for large order lists.",
      "Role-based views for managers and team leads.",
      "Visible connection status so users always know whether data is live.",
    ],
    stack: [
      "React",
      "TypeScript",
      "WebSockets",
      "TanStack Query",
      "Zustand",
      "Axios",
      "Tailwind CSS",
    ],
    links: {},
    nda: true,
  },
  {
    slug: "ui-component-library",
    title: "Internal UI Component Library",
    subtitle: "Shared design system for product teams",
    summary:
      "A typed, accessible component kit built on Radix primitives and Tailwind tokens, shared across several product teams.",
    icon: Component,
    image: null, // TODO: { src: "/projects/library.webp", alt: "..." }
    placeholderLabel: "Screenshot placeholder for the UI component library",
    tech: ["React", "Radix UI", "Tailwind CSS", "Vite", "TypeScript"],
    overview:
      "Each product team had its own buttons, modals, and form inputs, with inconsistent behaviour and repeated accessibility bugs. The library gives every team the same tested, accessible building blocks, so new screens are faster to build and look consistent.",
    architecture:
      "Components are thin, typed wrappers around Radix UI primitives, styled with Tailwind and shared design tokens for colour, spacing, and type. Variants are expressed as typed props rather than ad-hoc class names. Built and bundled with Vite in library mode with tree-shakeable exports.",
    features: [
      "Dialogs, menus, tabs, selects, and tooltips with full keyboard and screen reader support.",
      "Form components integrated with validation and consistent error messaging.",
      "Light and dark themes driven by tokens rather than duplicated styles.",
      "Documented usage examples for each component.",
    ],
    stack: ["React", "TypeScript", "Radix UI", "Tailwind CSS", "Vite"],
    links: {}, // TODO: { demo, source } إذا في رابط عام. إذا بيضل {} بيطلع "No public demo available"
    nda: false,
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
