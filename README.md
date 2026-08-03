# RentNest

RentNest is a modern, responsive rental-property marketplace built with
Next.js. Landlords list properties, manage availability, and approve or reject
rental requests from a dashboard. Tenants browse listings with advanced
filtering, submit rental requests, and pay securely. Admins moderate the whole
platform — users, listings, categories, and requests — from a dedicated console.

---

## Tech stack

- **Framework:** Next.js 16 (App Router, React 19) with `cacheComponents` /
  Partial Prerendering enabled
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, `shadcn/ui` + Radix primitives
- **Animation:** `motion` (Framer Motion), `tw-animate-css`
- **Validation:** Zod
- **Auth:** JWT in `httpOnly` cookies (access + refresh), verified server-side
- **Media:** Cloudinary (server-side uploads)
- **UX:** `sonner` toasts, `swiper` carousels, `recharts` dashboards

The frontend has no local database or API routes — all data flows through
**Server Actions** and server components that call an external backend. See
[`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full endpoint map.

---

## Getting started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- A running RentNest backend and a Cloudinary account

### Install

```bash
npm install
```

### Environment

Create a `.env` in the project root:

```bash
# Backend
BACKEND_API_URL=https://your-backend.example.com

# JWT secrets — must match the backend's signing secrets
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Cloudinary (server-side upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloud-name
```

> **Note:** `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are required. Without
> them, server-side token verification fails and the silent refresh flow can't
> run.

### Run

```bash
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

---

## Project structure

```
app/
  (public)/            Marketing + browsing (home, about, properties, details)
    _action/           Public server actions (listings, property details)
    _components/        Home sections, property cards, filters, details UI
  (auth)/              Login & register
    _actions/          Auth server actions
    _components/        Login / register forms
  (dashboard)/         Authenticated area (tenant, landlord, admin)
    _actions/          Server actions grouped by feature
    _components/        Dashboard feature UIs
    dashboard/         Tenant: profile, my-requests, payments (+ success/cancel)
    landlord-dashboard/ Landlord: profile, listings, landlord-requests
    admin-dashboard/   Admin: overview, listings, requests, users, categories
components/
  ui/                  shadcn/ui primitives
  shared/              Navbar, Footer, ThemeProvider, UserMenu
  custom-ui/           Project-specific inputs
lib/                   Types, zod schemas, nav config, shared feature types
service/               Auth/session helpers (getMe, refreshToken, logout)
utils/                 JWT helpers
```

Routes are organized into three App Router **route groups** — `(public)`,
`(auth)`, and `(dashboard)` — each with its own layout. Feature code lives
beside its route in colocated `_actions/` and `_components/` folders.

---

## Roles & areas

| Role | Home | Can do |
| --- | --- | --- |
| **Tenant** | `/dashboard` | Browse & filter listings, view details, request to rent, pay, review, track requests |
| **Landlord** | `/landlord-dashboard` | Create / edit / delete listings (with photo upload), approve or reject rental requests |
| **Admin** | `/admin-dashboard` | Moderate users, listings, categories, and all rental requests; view platform overview |

The sidebar is role-driven via `lib/dashboard-nav.ts`.

---

## Key features

- **Auth with silent refresh** — JWTs in `httpOnly` cookies; expired access
  tokens are renewed from the refresh token before each authenticated request.
- **Property browsing** — server-side search, price filter, sort, and pagination
  with streaming skeletons.
- **Listing management** — create/edit dialog with Zod validation, chip-based
  amenities editor, availability status, and drag-and-drop Cloudinary uploads.
- **Rental workflow** — tenants request to rent (date + duration, validated);
  landlords approve/reject; admins oversee everything.
- **Payments** — checkout redirect to the gateway, plus success/cancel return
  pages and a payment history view.
- **Theming** — light/dark via `next-themes`, consistent design tokens in
  `app/globals.css`.

---

## Conventions

- **Server Actions only** for data access — no `fetch` from client components.
  A `"use server"` module may export **only** async functions, so shared types
  and constants live in `lib/*` (e.g. `lib/listings.ts`, `lib/property-details.ts`).
- **Validation** lives in `lib/validations.ts` and runs server-side in the action
  before any request is sent; field errors are returned to the form.
- **Caching** — per-user reads are uncached; shared reads are tagged and
  revalidated on write. See [`API_INTEGRATION.md`](./API_INTEGRATION.md).

---

## Documentation

- [`API_INTEGRATION.md`](./API_INTEGRATION.md) — every backend endpoint mapped to
  the server function and UI that consumes it.

---

## Live API

- Production base URL: https://rentnest-client-beta.vercel.app