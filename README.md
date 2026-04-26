# SwiftRoute — Full Stack Developer Case Study

SwiftRoute is a fictional last-mile logistics platform built as a take-home technical assessment. Couriers use a mobile app to manage their assigned delivery jobs throughout the day — picking up parcels, marking them in-transit, and confirming delivery.

---

## Monorepo Structure

This is a **pnpm monorepo** with two apps and two shared packages:

```
swift-route/
├── apps/
│   ├── swift-route/     # NestJS 11 backend API
│   └── swift-app/       # Expo / React Native mobile app (Expo SDK 54)
└── packages/
    ├── types/           # Shared TypeScript types (@swift-route/types)
    └── seed-data/       # Shared seed data and ID constants (@swift-route/seed-data)
```

The workspace is defined in `pnpm-workspace.yaml` with hoisted node linking.

### Shared Types (`packages/types`)

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

### Shared Seed Data (`packages/seed-data`)

Package name: `@swift-route/seed-data`. Built with TypeScript to `dist/` and consumed as a workspace package.

Exports `COURIER_IDS`, `JOB_IDS`, `courierStore`, `deliveryNotesStore`, and `deliveryJobsStore`. Both the backend in-memory store and mobile tests import from here to guarantee consistent fixtures across the entire monorepo.

`JOB_IDS.ian` is a non-existent ID reserved for 404 test cases.

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

### Part 2 — Mobile (React Native / Expo) ✅

The mobile app (`apps/swift-app`) is built with Expo SDK 54, Expo Router, and Tamagui. Both courier-facing screens are fully implemented and tested.

**My Jobs screen** (`app/index.tsx`):
- Lists all delivery jobs for the active courier with colour-coded status badges (assigned = blue, in-transit = orange, delivered = green)
- Skeleton loader cards shown while the initial fetch is in flight
- Error state with a "Try again" link and an empty state with a "Refresh" link
- Pull-to-refresh via `FlatList`'s `onRefresh`
- Courier switcher via an avatar button in the header that opens `CourierDialogConfig`
- Tapping a card navigates to the Job Detail screen

**Job Detail screen** (`app/delivery-job/[id].tsx`):
- Displays status badge, package type (with emoji icon), pickup/dropoff addresses, delivery notes, and timestamps
- A sticky bottom action button advances the job through the state machine (`assigned → in-transit → delivered`) and is permanently disabled once delivered
- Optimistic update: the store is patched immediately; a 3-second simulated network delay lets the loading/spinner state be visible before the real API call is fired
- On API failure, the store is rolled back to the previous snapshot and an error toast is shown via `@tamagui/toast/v2`

**State management** — Zustand `useDeliveryJobsStore`:
- `jobs`, `prevJobs`, `loading`, `error` fields
- `advanceJobStatus(id, status)` — snapshots `prevJobs` then applies the optimistic update
- `revertJobStatus(error)` — restores `prevJobs` and sets the error message
- `useCourierStore` — persists the selected `courierId` across navigation

**Hooks**:
- `useDeliveryJobs(courierId)` — fetches jobs on mount and on `courierId` change, exposes `refetch`
- `useDeliveryJob(id)` — selects a single job from the store by ID
- `useUpdateDeliveryStatus()` — orchestrates the optimistic update, simulated delay, API call, and rollback

**Tests** cover four areas:

1. `useDeliveryJobs` hook — successful fetch populates the store; loading transitions correctly; API failure sets the error and leaves jobs empty
2. `useDeliveryJobsStore` — optimistic update is applied immediately; failed update is rolled back to the previous snapshot
3. `DeliveryJobDetails` screen — renders without crashing; initial button label matches job status; spinner/disabled state appears during the API call; error toast fires and button re-enables on failure; full `assigned → in-transit → delivered` lifecycle transition

Test conventions:
- Tamagui components are shimmed with plain `View`/`React.createElement` in `jest.mock("tamagui", ...)`
- `UNSAFE_getByProps({ id: "..." })` locates elements because shimmed Tamagui components don't support `testID`
- `useUpdateDeliveryStatus` has a 3-second simulated network delay; tests use `jest.useFakeTimers()` and `act(() => jest.advanceTimersByTime(3000))` to advance past it (marked with `TODO` comments to remove once the delay is dropped)

---

## Mobile App — Design Decisions

### Screen and component structure

The app has two screens under Expo Router's file-based routing:

- `app/_layout.tsx` — root Stack navigator, Tamagui provider, and toast provider live here
- `app/index.tsx` (My Jobs) — owns the list shell; delegates card rendering to `DeliveryJobCard`, skeleton loading to `DeliveryJobCardLoader`, and courier switching to `CourierDialogConfig`
- `app/delivery-job/[id].tsx` (Job Detail) — owns the action button and error toast; delegates status data to `useDeliveryJob` and mutation to `useUpdateDeliveryStatus`
- Components in `components/` are kept display-only with no store access; all store reads/writes go through hooks

See the attached MarkMap diagram for a visual overview.
<img src="./docs/images/frontend-architecture.svg" width="100%" />

### How the Zustand store is organised and why

Two stores with distinct responsibilities:

- `useDeliveryJobsStore` — owns the job list, loading, error, and the `prevJobs` rollback snapshot. Actions: `setJobs`, `setLoading`, `setError`, `advanceJobStatus`, `revertJobStatus`
- `useCourierStore` — owns only the selected `courierId`, persisted across navigation. Kept separate so courier selection changes don't trigger re-renders in job-list subscriptions

Zustand's flat, selector-based subscriptions made it straightforward to isolate the optimistic-update state (`prevJobs`) inside the store without threading it through component props.

### How optimistic updates and rollback are handled

- Courier taps the action button → `advanceJobStatus(id, nextStatus)` immediately snapshots `jobs` into `prevJobs` and patches the job in the list → UI reflects the new status instantly
- A simulated 3-second network delay fires, then the real `PATCH /delivery-jobs/:id/status` call is made
- **Happy path**: API succeeds → `setLoading(false)`, update is committed
- **Error path**: API throws → `revertJobStatus(errorMessage)` restores `jobs` from `prevJobs`, clears the snapshot, sets `error` → error toast is shown and the button re-enables

See the attached UML sequence diagram for the full flow.
<img src="./docs/images/optimistic-update-uml.png" align="center" style="width: 100%" />

### Styling choice and why

Tamagui was chosen for its layout primitives — `YStack`, `XStack`, `Button`, `Spinner`, `Separator`, and `Avatar` — which made it straightforward to compose screens and components quickly without writing boilerplate layout code. Where the primitives weren't enough, plain React Native `StyleSheet` was used to customise further (for example, the status badge pill).

---

## What I'd change or prioritise with more time

#### React Query for data fetching + built-in network retry
Replace `useDeliveryJobs` and `useDeliveryJob` with React Query hooks that wrap the existing service class — the service class stays, since it cleanly organises network requests per feature.

React Query gives automatic network error propagation, and built-in retry with exponential backoff where a transient network blip when marking a job delivered wouldn't roll back immediately, it would retry transparently before giving up.

#### Keep Zustand's current responsibility
With React Query owning server state, Zustand stays responsible for what it's good at: the optimistic update snapshot (`prevJobs` / `revertJobStatus`) and the courier selection (`useCourierStore`).

#### Replace the delivered action button with a "Delivery complete" banner
Advance status currently renders a disabled button that a courier can tap and get no feedback from. A toast is clearer and avoids the confusion of a tappable-looking element that does nothing.

#### Proper environment configuration
The API base URL is a runtime conditional in `api-client.ts` (`10.0.2.2` vs `localhost`). There's no `.env` / `app.config.js` setup for dev / staging / prod targets — the first thing a CI/CD pipeline would need is environment-based builds.

#### Performance on large job lists
`DeliveryJobCard` is not memoized, `handleJob` is recreated every render, and the store subscription in `index.tsx` pulls the full `jobs` array so any store change (including `loading` toggling) re-renders the entire list.

Targeted fixes:
- `React.memo` on the card
- `useCallback` on the handler
- Zustand `useShallow` selector so the list only re-renders when `jobs` actually changes, and `getItemLayout` if card heights are fixed

Beyond that, swapping `FlatList` for **FlashList** is also another option (Shopify's recycler-based replacement) would give a significant frame-rate improvement on long lists without requiring changes to the card components themselves.

#### Accessibility
Most interactive elements — cards, the action button, the avatar switcher — have no `accessibilityLabel` or `accessibilityRole`. The status badge is already text not color-only which is good, but the delivered button doesn't announce its `disabled` state to screen readers. This is a legal requirement in many markets and straightforward to implement, albeit time consuming.

#### Remove the simulated 3-second delay
Exists only to make the spinner visible during development. Real network latency makes it unnecessary, and the test `TODO` comments can be cleaned up at the same time.

---

## AI — Where it helped and where I made deliberate choices

### Monorepo and shared packages

Going with a monorepo was a choice I made from the start, with the goal of being able to share types and test data between the backend and mobile app in a structured way.

I started by defining the types on the backend side, then worked with Claude to extract them into a proper workspace package under `packages/` (`@swift-route/types`), wire up the imports in both apps, and resolve the TypeScript compilation errors that came up along the way. The structure was my decision; Claude helped me execute it without it becoming a rabbit hole.

Having seen how that pattern worked, I independently applied it a second time for the seed data — migrating the virtual in-memory stores from the backend into `@swift-route/seed-data`, making the same fixture data available to mobile tests without duplication. The structure and approach were entirely my own at that point; Claude helped me understand the pattern initially.

### Jest + React Native Testing Library issues with Tamagui & Expo

The hard part was tooling friction: Tamagui components don't work out of the box in a Jest environment, and Expo Router adds its own layer of mocking complexity.

Claude had a significant hand in resolving those errors — working out the right Tamagui shim shape (replacing components with plain `View`/`React.createElement` wrappers), and sorting out the `UNSAFE_getByProps` pattern as a workaround for the missing `testID` support on shimmed components.

The testing strategies were mine but debugging was very much a collaboration.

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

### Mobile Tests

```bash
# One-shot run (from repo root)
pnpm --filter ./apps/swift-app test -- --watchAll=false

# Single file
pnpm --filter ./apps/swift-app test -- --watchAll=false apps/swift-app/app/delivery-job/__tests__/\[id\].test.tsx
```

### Other

```bash
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier across all apps
```
