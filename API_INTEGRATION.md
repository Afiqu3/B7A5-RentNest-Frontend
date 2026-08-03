# API Integration

How the RentNest frontend talks to the backend, and which UI each endpoint powers.

All requests target `process.env.BACKEND_API_URL` and are made from **Server
Actions** / server components (files under `_actions/`, `_action/`, and
`service/`) — never from the browser. Authenticated calls forward the
`accessToken` cookie as a `Cookie` header; see [Authentication](#authentication).

Base URL: `${BACKEND_API_URL}` (e.g. `https://rent-nest-eta.vercel.app`)

---

## Authentication

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | `loginAction` — `app/(auth)/_actions/authActions.ts` | `LoginForm` |
| POST | `/api/auth/register` | `registrationAction` — `authActions.ts` | `RegisterForm` |
| GET | `/api/auth/me` | `getMe` — `service/getMe.ts` | Public / dashboard / auth layouts, `Navbar`, `UserMenu`, all profile pages |
| POST | `/api/auth/refresh-token` | `getNewAccessToken` — `service/refreshToken.ts` | Silent token refresh (called by `isAccessTokenExist`) |
| POST | `/api/auth/logout` | `logout` — `service/logout.ts` | `UserMenu` |
| PATCH | `/api/auth/my-profile` | `updateProfileAction` — `_actions/profileActions.ts` | `MyProfile` |

**Cookie model.** `loginAction` stores `accessToken` (1 day) and `refreshToken`
(7 days) as `httpOnly` cookies. `isAccessTokenExist` (`service/refreshToken.ts`)
verifies the access token and, if it has expired but the refresh token is valid,
transparently mints a new one before every authenticated request.

---

## Properties

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| GET | `/api/properties/available` | `getAvailableProperties` — `service/properties.ts`; `getLatestProperties` — `app/(public)/_action/actions.ts` | `/properties` list (search, filter, sort, pagination); home `LatestProperties` |
| GET | `/api/properties/:id` | `getPropertyDetails` — `_action/propertyDetails.ts` | Property details page — **signed-out** view |
| GET | `/api/properties/:id/user` | `getPropertyDetailsForUser` — `propertyDetails.ts` | Property details page — **signed-in** view (adds landlord contact) |
| GET | `/api/properties` | `getAllProperties` — `_actions/propertyActions.ts` | Admin `PropertyListings` |
| GET | `/api/properties/my-properties` | `getMyListings` — `_actions/myListings.ts` | Landlord `MyListing` |
| POST | `/api/properties` | `createListing` — `myListings.ts` | `ListingFormDialog` (create) |
| PATCH | `/api/properties/:id` | `updateListing` — `myListings.ts` | `ListingFormDialog` (edit) |
| DELETE | `/api/properties/:id` | `deleteListing` — `myListings.ts` | `MyListing` (delete confirm) |

Property create/edit payloads are validated with `propertySchema`
(`lib/validations.ts`) before the request is sent.

---

## Categories

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| GET | `/api/categories` | `getAllCategory` — `_actions/categoryActions.ts` | Admin `Categories`; landlord listing form (category picker) |
| POST | `/api/categories` | `createCategory` — `categoryActions.ts` | Admin `Categories` |
| PUT | `/api/categories/:id` | `updateCategory` — `categoryActions.ts` | Admin `Categories` |
| DELETE | `/api/categories/:id` | `deleteCategory` — `categoryActions.ts` | Admin `Categories` |

---

## Rentals (requests)

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| GET | `/api/rentals` | `getAllRentalRequests` — `_actions/rentalRequestActions.ts` | Admin `RentalRequests` |
| GET | `/api/rentals/my-request` | `getMyRequests` — `_actions/myRequestActions.ts` | Tenant `MyRequests` |
| GET | `/api/rentals/my-rental` | `getAllLandlordRequests` — `_actions/landlordRequestsAction.ts` | Landlord `LandlordRequests` |
| POST | `/api/rentals/:id` | `requestRental` — `_action/propertyDetails.ts` | `RequestRentalDialog` (tenant submits a request) |
| PUT | `/api/rentals/:id/status` | `updateRequestStatus` — `landlordRequestsAction.ts` | `RequestDecision` (approve / reject) |

Rental request payloads are validated with `rentalRequestSchema`
(`lib/validations.ts`); status updates are constrained to `APPROVED` / `REJECTED`.

---

## Payments

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| GET | `/api/payments/checkout/:rentalId` | `getPaymentUrl` — `_actions/myRequestActions.ts` | `MyRequests` — redirects to the payment gateway |
| GET | `/api/payments/history` | `getPaymentHistory` — `_actions/paymentActions.ts` | Tenant `Payments` |

After the gateway redirects back, `/dashboard/payments/success` and
`/dashboard/payments/cancel` are static pages — they call no API.

---

## Reviews

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| GET | `/api/reviews/:rentalId/exists` | `isReviewed` — `_actions/myRequestActions.ts` | `MyRequests` (hide the review form once submitted) |
| POST | `/api/reviews/:rentalId` | `createReview` — `myRequestActions.ts` | `MyRequests` (leave a review) |

---

## Admin

| Method | Endpoint | Server function | Consumed by |
| --- | --- | --- | --- |
| GET | `/api/auth/overview` | `getOverviewData` — `_actions/overviewActions.ts` | Admin `Overview` (charts) |
| GET | `/api/auth/users` | `getAllUsers` — `_actions/usersActions.ts` | Admin `Users` |
| PUT | `/api/auth/users/:id` | `updateUserActiveStatus` — `usersActions.ts` | Admin `Users` (block / unblock) |

---

## Third-party: Cloudinary (not the backend API)

| Action | SDK call | Consumed by |
| --- | --- | --- |
| Upload property photo | `uploadPropertyImage` — `_actions/uploadActions.ts` (Cloudinary Node SDK, server-side) | `ImageField` in `ListingFormDialog` |

The image is uploaded to Cloudinary server-side; only the returned `secure_url`
is stored on the property record. The API secret never reaches the browser.

---

## Caching & revalidation

- **Per-user reads** (`getMe`, `getMyListings`, rentals, payments) use
  `cache: "no-store"` / `"no-cache"` — the response is scoped to the caller's
  cookie and must not be shared across users.
- **Shared reads** (`getAllCategory`, admin lists) use `force-cache` with a tag
  (`category`, `users`, `properties`, `rentals`).
- **Writes** call `revalidateTag(...)` so dependent lists refresh (e.g. a listing
  create/update/delete revalidates `my-properties` and `properties`).

## Response envelope

Most endpoints return `{ success, statusCode, message, data }`; list endpoints
add `meta: { page, limit, total, totalPages }`. Actions guard against missing or
malformed payloads by falling back to empty data and surfacing `message` to the
user via toasts.
