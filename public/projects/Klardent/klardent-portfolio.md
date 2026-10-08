# Klardent: Dental Lab Management SaaS

Portfolio content for the project card and the project details page.

---

## Project card

**Title**
Klardent: Dental Lab Management SaaS

**Short description** (card, 2 lines)
Multi-tenant SaaS for dental laboratories, covering quotes, case production, quality review, invoicing, and payroll across five user roles in three languages.

**Tags** (card, 5 max)
`React` `TanStack Query` `Tailwind CSS` `Firebase` `Stripe`

**Cover image**
`02-lab-admin/01-dashboard.png` (light) or `02-lab-admin/22-dashboard-dark.png` (matches the dark portfolio theme)

---

## Project details page

**Title**
Klardent: Dental Lab Management SaaS

**Subtitle**
Multi-tenant B2B platform for dental laboratories and the dentists they work with

**Tags**
`React` `JavaScript` `TanStack Query` `React Hook Form` `Zod` `Tailwind CSS` `shadcn/ui` `Firebase` `Stripe` `i18next`

### Overview & business problem

Dental labs coordinate work between dentists, technicians, and quality reviewers, and most of that coordination happens over phone calls, chat apps, and spreadsheets. Quotes get lost, nobody knows which stage a case is in, and invoices are prepared by hand at the end of the month.

Klardent puts the whole workflow in one web platform. A dentist submits a case and requests a quote, the lab prices it and assigns it, a technician works through the production steps, a reviewer approves or sends it back, and the lab invoices the dentist. Labs subscribe to the platform on a paid plan, and a separate console lets the platform owner manage labs, plans, promotions, and support.

### Architecture

React single-page application built with Vite and styled with Tailwind CSS on top of shadcn/ui (Radix) components. The app serves five roles from one codebase: platform super admin, lab admin, technician, reviewer, and doctor. Each role has its own route tree, sidebar, and dashboard.

All server state lives in TanStack Query, organised as one query module per resource (cases, quotes, invoices, salaries, subscriptions, tickets, and so on). A small auth context holds the current user and their permissions, and a single route guard enforces authentication, role, and permission checks before a page renders. A shared Axios instance attaches the token and the active language to every request and handles expired sessions and API errors in one place.

Forms use React Hook Form with Zod schemas. Real-time features run on Firebase: Firestore listeners for chat and Cloud Messaging with a service worker for push notifications. Subscription payments go through Stripe Elements.

### Key technical features

- Role and permission based access control across around 70 routes, enforced in routing and in the UI, with each role redirected to its own dashboard.
- Full case lifecycle from quote request to delivery, with per-case work steps, progress tracking, file attachments, and a review queue for approving or rejecting finished work.
- Four-step lab registration wizard (lab details, account, plan selection, payment) with Stripe checkout, free trials, and coupon codes.
- Subscription billing for labs: plan upgrades, payment history, and plan limits reflected in the interface.
- Real-time chat between labs and doctors on Firestore, plus push notifications through Firebase Cloud Messaging.
- Three languages (English, German, Arabic) with full right-to-left layout for Arabic and more than 2,000 translation keys per language.
- Light and dark themes across every screen.
- Analytics dashboards per role built with Recharts, including revenue trends, case status distribution, and technician performance.
- Data tables with server-side pagination, filtering, and debounced search built on TanStack Table.
- File uploads with a progress indicator and the option to cancel mid-upload.
- Platform console for the owner: lab management, subscription plans, promotions, transactions, support tickets, and a CMS for the public landing page and FAQs.
- Invoicing and payroll modules, including salary slips and leave requests for lab staff.

### Stack

React 18, JavaScript, Vite, React Router 7, TanStack Query, TanStack Table, React Hook Form, Zod, Axios, Tailwind CSS, shadcn/ui (Radix UI), Recharts, i18next, Firebase (Firestore, Cloud Messaging), Stripe.

### My role

Frontend developer. <!-- TODO: add one line on scope, e.g. "Built the frontend end to end against a Laravel REST API" or "Part of a team of N" -->

### Status / link

<!-- TODO: pick one and delete the other -->
- `Client project, under NDA` with a "Request a walkthrough" button
- `Live` with a link to the production site

---

## Suggested screenshots for the details page

| Order | File | Shows |
|---|---|---|
| 1 | `02-lab-admin/01-dashboard.png` | Lab admin dashboard with revenue and case status |
| 2 | `02-lab-admin/19-case-details.png` | Case details and lifecycle |
| 3 | `03-technician/11-task-details.png` | Technician work steps and attachments |
| 4 | `04-reviewer/02-review-queue.png` | Quality review queue |
| 5 | `05-doctor/01-dashboard.png` | Doctor portal |
| 6 | `01-super-admin/01-dashboard.png` | Platform owner console |
| 7 | `01-super-admin/06-subscriptions.png` | Subscription plan management |
| 8 | `02-lab-admin/25-dashboard-arabic-rtl.png` | Arabic right-to-left layout |
| 9 | `02-lab-admin/22-dashboard-dark.png` | Dark theme |
| 10 | `00-public/03-register.png` | Registration wizard |
