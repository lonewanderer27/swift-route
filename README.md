# SwiftRoute — Full Stack Developer Case Study

SwiftRoute is a fictional last-mile logistics platform built as a take-home technical assessment. Couriers use a mobile app to manage their assigned delivery jobs throughout the day — picking up parcels, marking them in-transit, and confirming delivery.

---

## Monorepo Structure

This is a **pnpm monorepo** with two apps and one shared package:

```
swift-route/
├── apps/
│   ├── swift-route/     # NestJS 11 backend API
│   └── swift-app/       # Expo / React Native mobile app (Expo SDK 54)
└── packages/
    └── types/           # Shared TypeScript types (@swift-route/types)
```

The workspace is defined in `pnpm-workspace.yaml` with hoisted node linking.

---

## What Was Built

### Part 1 — Backend (NestJS) ✅

A NestJS REST API serving delivery job data from an in-memory store. No database — seed data is loaded on startup across three couriers.

**Endpoints** (all under `/delivery-jobs`):

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/delivery-jobs?courierId=&status=` | List jobs by courier (required) and optional status |
| `GET` | `/delivery-jobs/all?courierId=&status=` | Same, but validates `courierId` as UUID via `ParseUUIDPipe` |
| `GET` | `/delivery-jobs/:id` | Get a single job — 404 if not found |
| `POST` | `/delivery-jobs` | Create a job (status defaults to `assigned`) |
| `PUT` | `/delivery-jobs/:id` | Full replace |
| `PATCH` | `/delivery-jobs/:id` | Partial update |
| `PATCH` | `/delivery-jobs/:id/status` | Advance status — enforces state machine |
| `DELETE` | `/delivery-jobs/:id` | Delete job (204) |

**Status state machine** enforces a strict one-way transition:

```
assigned → in-transit → delivered
```

Any invalid transition (e.g. skipping a step, reversing, or updating a delivered job) returns `422 UnprocessableEntityException`.

**Seed data** — 9 jobs across 3 couriers, each covering all three statuses:

| Courier | IDs |
|---------|-----|
| Jeon Jung-kook | `jk_assigned`, `jk_inTransit`, `jk_delivered` |
| Sophia Laforteza | `sophia_assigned`, `sophia_inTransit`, `sophia_delivered` |
| Christopher Bang | `chris_assigned`, `chris_inTransit`, `chris_delivered` |

`JOB_IDS.ian` is a non-existent ID reserved for 404 test cases.

**DTO pattern** — each operation uses an `*Input` type (snake_case, matches API body) and a `*Model` class (implements `DeliveryJob`, transforms to camelCase domain shape). The model constructor handles all transformation — e.g. converting `courier: string` → `{ id: UUID, name: string }`.

**Tests** cover the three required test groups:

1. Query param validation — missing `courierId` returns 400; valid params return 200 with filtered list
2. Status transitions — all valid transitions and invalid ones including reversals and updating a delivered job
3. `GET /delivery-jobs/:id` — returns the correct job; returns 404 for an unknown ID

Tests use real `NestJS TestingModule` instances with the real service — no mocks. Status-transition tests are stateful and ordered within a `describe` block, relying on Jest's sequential execution to carry in-memory state across `it()` calls.

### Part 2 — Mobile (React Native / Expo) 🚧

The mobile app (`apps/swift-app`) is scaffolded with Expo SDK 54, Expo Router, and React Navigation. The courier-facing screens — **My Jobs** list and **Job Detail** — are yet to be implemented.

Planned implementation:
- **My Jobs screen** — list of delivery jobs with colour-coded status badges (assigned = blue, in-transit = orange, delivered = green), loading/empty/error states, pull-to-refresh, and navigation to Job Detail
- **Job Detail screen** — full job details with a status-appropriate action button, optimistic updates via Zustand, and error rollback on API failure
- **State management** — Zustand `deliveryJobsStore` with a `useDeliveryJobs(courierId)` custom hook
- **Styling** — plain `StyleSheet` (no Tamagui); chosen for zero setup overhead and direct React Native API without an abstraction layer

---

## Shared Types (`packages/types`)

Package name: `@swift-route/types`. No build step — imported directly from source via the monorepo workspace.

```ts
DeliveryStatus  // "assigned" | "in-transit" | "delivered"
PackageType     // "document" | "perishable" | "fragile" | "appliance" | "furniture"

type Courier      = { id: string; name: string }
type DeliveryNote = { id: string; createdAt: Date; deliveryId: string; note: string }
type DeliveryJob  = { id, createdAt, updatedAt, pickupAddress, dropoffAddress,
                      packageType, status, notes, courier }
```

`DeliveryStatus` and `PackageType` are defined as `const` objects rather than TypeScript `enum` to work around a known incompatibility between the NestJS boilerplate and TypeScript 5.7+.

---

## Getting Started

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
pnpm install
```

### Backend

```bash
# Development (watch mode)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod
```

Server listens on `PORT` env var or `3000` by default.

### Run Tests

```bash
# All unit tests
pnpm test

# Single file
pnpm test -- apps/swift-route/src/delivery-jobs/delivery-jobs.controller.spec.ts

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E
pnpm test:e2e
```

### Mobile App

```bash
cd apps/swift-app
pnpm start        # Expo dev server
pnpm ios          # iOS simulator
pnpm android      # Android emulator
```

### Other

```bash
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier across all apps
```
