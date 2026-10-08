# SooqSuria Admin Dashboard — portfolio content

Content is split to match the portfolio layout: the project card first, then the details page section by section.

---

## 1. Project card

**Title**

Classifieds Marketplace Admin Dashboard

**Description** (2 lines)

Back-office dashboard for a C2C classifieds marketplace: ad moderation, bulk listing import, seller verification, and wallet transactions, in English and Arabic.

**Tags**

`React` `TanStack Query` `React Hook Form` `Tailwind CSS` `i18next`

**Card image:** `screenshots/05-ads.png`

---

## 2. Details page

**Title**

Classifieds Marketplace Admin Dashboard

**Subtitle**

C2C marketplace, back-office moderation and operations system

**Tags**

`React` `TanStack Query` `React Hook Form` `Tailwind CSS` `i18next`

**Main image:** `screenshots/05-ads.png`

### Overview & business problem

SooqSuria is a classifieds marketplace where users post ads for cars, real estate, and electronics from a mobile app. Every listing, seller, and payment has to be reviewed by the platform's team before it can be trusted: ads need approval, sellers need identity verification, wallet top-ups arrive as cash and bank transfers that staff record by hand, and dealers want to publish hundreds of listings at once. The dashboard gives that team one web tool for all of it, with each role seeing only the sections it is responsible for.

### Architecture

React SPA built with Vite, consuming a REST API. Server state (ads, users, transactions, tickets) lives in TanStack Query, with one module of query and mutation hooks per resource and cache invalidation after every write, so tables stay current without manual refetching. Pagination, search, and filtering run on the server behind a single reusable table component built on TanStack Table. A central Axios instance attaches the auth token and language header and maps API errors to consistent toasts. Routes and sidebar items are both gated by the same role configuration.

### Key technical features

- Four-step bulk import wizard (upload, map columns, validate, import) with row-level error fixing, auto-fix, and resumable sessions.
- Ad review page that diffs the owner's edits field by field, showing the old value next to the new one.
- Smart search that detects whether the input is a title, phone number, email, or ID and sends the matching filter.
- Role-based access for six staff roles, enforced in routing and in the UI.
- Full English and Arabic support with automatic RTL layout, plus light and dark themes.
- Create-ad form with category-specific dynamic fields, image and video upload, and a live preview.
- KPI dashboard with daily, weekly, and monthly comparison and Excel export.

### Stack

React, Vite, React Router, TanStack Query, TanStack Table, React Hook Form, Zod, Axios, Tailwind CSS, shadcn/ui, Recharts, i18next.

### Footer badge

Client project, admin access only · **Request a walkthrough**

---

## 3. Gallery (optional)

All images are in `screenshots/`, 3840 px wide, and use demo data.

| File | Caption |
|---|---|
| `05-ads.png` | Ads management with status counters and filters |
| `02-dashboard.png` | KPI dashboard with period comparison |
| `06-ad-details.png` | Ad review with field-by-field edit diff |
| `08-bulk-import.png` | Bulk import wizard |
| `10-popular-ads.png` | Most viewed, liked, and favourited ads |
| `14-verification.png` | Seller verification requests |
| `11-transactions.png` | Wallet transactions and revenue stats |
| `17-support-ticket.png` | Support ticket dialog |
| `31-ads-ar.png` | Arabic (RTL) interface |
| `41-ads-dark.png` | Dark mode |
