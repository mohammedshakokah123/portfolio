# Chloéllia — portfolio copy

Copy for the portfolio project card and the project details page. Screenshot paths are relative to the repo root (`screenshots/`, 1920×1080).

---

## Project card (Featured projects)

**Title**

Chloéllia: Fine Jewellery E-commerce Storefront

**Description**

Multilingual storefront for a fine-jewellery house: product catalogue with filters, guest cart, four-step checkout with card payment, and a customer account with orders and returns, in four languages including Arabic.

**Tags**

`Next.js` `TypeScript` `TanStack Query` `Tailwind CSS` `i18next`

**Cover image**

`screenshots/01-home-hero.png` in front, `screenshots/12-product-detail.png` behind it.

---

## Details page

**Title**

Chloéllia: Fine Jewellery E-commerce Storefront

**Subtitle**

B2C luxury retail, multilingual storefront with checkout and customer self-service

**Tags**

`Next.js` `TypeScript` `TanStack Query` `Tailwind CSS` `i18next`

### Overview & business problem

Chloéllia is a fine-jewellery house selling gemstone pieces, precious metals, and Goldbacks to customers across Europe and the Middle East. The brand needed a storefront that feels like a luxury boutique and still does the work of a full shop: browsing a catalogue of high-value pieces, buying without being forced to register, paying by card, and handling orders, addresses, and returns without contacting support. It also had to serve four languages, including right-to-left Arabic, and show prices in the customer's currency. The storefront covers that whole journey, from the first visit to the return request, on top of the client's existing REST API.

### Architecture

Next.js App Router application where every route lives under a `[lang]` segment. Middleware redirects un-prefixed URLs to the default locale and passes the locale to server code, so pages, metadata, and API requests are all rendered in the right language. Data flows in one direction: components call thin TanStack Query hooks, hooks call a service layer, and services call a single Axios instance. The service layer maps raw API responses into view-model types, which keeps translation fallbacks, stock status, and price formatting out of the components. Shipping and payment options are prefetched on the server and hydrated on the client. Server state lives in TanStack Query with per-locale cache keys; Zustand holds only the session state for the cart and preferred currency. The Axios instance injects the locale headers and the auth token and clears the token on a 401.

### Key technical features

- Locale-prefixed routing for English, Arabic, French, and Swedish, with automatic RTL layout for Arabic.
- Guest cart and wishlist tied to one session ID that the API merges into the customer's account on login.
- Four-step checkout (shipping, billing, review, confirmation) with shipping-method pricing, discount codes, and Nexi card payment verification.
- Draft-based returns wizard: eligible orders, item selection, eligibility check, return shipping, refund method, and review.
- Catalogue with category tabs, a filters drawer, sorting, grid and list views, quick view, and stock badges.
- Currency switcher across five currencies and a live metal-prices panel fed by the API.
- Customer account: profile, saved addresses, order history and order details, notification preferences, password change, and account deletion.
- Bespoke consultation and client-services forms with schema validation and image upload.
- Service layer with a translation fallback chain (requested locale, then English, then raw name), so a missing translation never shows an empty field.

### Stack

Next.js (App Router), React, TypeScript, TanStack Query, Zustand, React Hook Form, Zod, Axios, Tailwind CSS, Framer Motion, i18next.

### Screenshots

| File | Caption |
|---|---|
| `screenshots/01-home-hero.png` | Home page with video hero |
| `screenshots/11-collections.png` | Catalogue with category tabs, filters, and sorting |
| `screenshots/12-product-detail.png` | Product page with gallery and add to cart |
| `screenshots/20-cart.png` | Cart with order summary |
| `screenshots/21-checkout-shipping.png` | Checkout, shipping step with delivery methods |
| `screenshots/28-account-order-detail.png` | Order details with price breakdown |
| `screenshots/26-account-addresses.png` | Saved addresses in the customer account |
| `screenshots/13-craftsmanship.png` | Bespoke consultation form |
| `screenshots/16-about-craftsmanship.png` | About page, craftsmanship section |
| `screenshots/32-home-arabic-rtl.png` | Arabic (RTL) interface |

Extra shots if the gallery needs more: `03-home-brand-story.png` (brand story section), `08-home-instagram.png` (Instagram and trust badges), `22-wishlist.png` (wishlist), `23-sign-in.png` (sign in), `29-account-returns.png` (returns and refunds).

### Footer badge

Client project, live storefront

Button: `Visit site` if the site is public, otherwise `Request a walkthrough`.
