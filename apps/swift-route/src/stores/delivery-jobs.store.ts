import type { DeliveryJob } from "@swift-route/types";
import { DeliveryStatus, PackageType } from "@swift-route/types";
import { COURIER_IDS, courierStore } from "./courier.store";
import { deliveryNotesStore } from "./delivery-notes.store";

export const JOB_IDS = {
  jk_assigned: "a1b2c3d4-0001-4000-8000-000000000001",
  jk_inTransit: "a1b2c3d4-0002-4000-8000-000000000002",
  jk_delivered: "a1b2c3d4-0003-4000-8000-000000000003",
  sophia_assigned: "a1b2c3d4-0004-4000-8000-000000000004",
  sophia_inTransit: "a1b2c3d4-0005-4000-8000-000000000005",
  sophia_delivered: "a1b2c3d4-0006-4000-8000-000000000006",
  chris_assigned: "a1b2c3d4-0007-4000-8000-000000000007",
  chris_inTransit: "a1b2c3d4-0008-4000-8000-000000000008",
  chris_delivered: "a1b2c3d4-0009-4000-8000-000000000009",
  ian: "a1b2c3d4-0009-4000-8000-000000000009",
} as const;

const jungkook = courierStore.find((c) => c.id === COURIER_IDS.jungkook)!;
const sophia = courierStore.find((c) => c.id === COURIER_IDS.sophia)!;
const chris = courierStore.find((c) => c.id === COURIER_IDS.chris)!;

const notesFor = (jobId: string) =>
  deliveryNotesStore.filter((n) => n.deliveryId === jobId);

export const deliveryJobsStore: DeliveryJob[] = [
  // ── Jeon Jung-kook ──────────────────────────────────────────────────────────
  {
    id: JOB_IDS.jk_assigned,
    createdAt: new Date("2026-04-25T08:00:00+10:00"),
    updatedAt: new Date("2026-04-25T08:00:00+10:00"),
    pickupAddress: "1 Martin Place, Sydney NSW 2000",
    dropoffAddress: "330 George St, Sydney NSW 2000",
    packageType: PackageType.DOCUMENT,
    status: DeliveryStatus.ASSIGNED,
    courier: jungkook,
    notes: [],
  },
  {
    id: JOB_IDS.jk_inTransit,
    createdAt: new Date("2026-04-24T14:30:00+10:00"),
    updatedAt: new Date("2026-04-25T07:45:00+10:00"),
    pickupAddress: "45 Collins St, Melbourne VIC 3000",
    dropoffAddress: "500 Bourke St, Melbourne VIC 3000",
    packageType: PackageType.PERISHABLE,
    status: DeliveryStatus.IN_TRANSIT,
    courier: jungkook,
    notes: [],
  },
  {
    id: JOB_IDS.jk_delivered,
    createdAt: new Date("2026-04-23T08:00:00+10:00"),
    updatedAt: new Date("2026-04-23T13:05:00+10:00"),
    pickupAddress: "88 Creek St, Brisbane QLD 4000",
    dropoffAddress: "123 Ann St, Brisbane QLD 4000",
    packageType: PackageType.FRAGILE,
    status: DeliveryStatus.DELIVERED,
    courier: jungkook,
    notes: notesFor(JOB_IDS.jk_delivered),
  },

  // ── Sophia Laforteza ────────────────────────────────────────────────────────
  {
    id: JOB_IDS.sophia_assigned,
    createdAt: new Date("2026-04-25T09:00:00+08:00"),
    updatedAt: new Date("2026-04-25T09:00:00+08:00"),
    pickupAddress: "1 St Georges Terrace, Perth WA 6000",
    dropoffAddress: "250 Murray St, Perth WA 6000",
    packageType: PackageType.APPLIANCE,
    status: DeliveryStatus.ASSIGNED,
    courier: sophia,
    notes: [],
  },
  {
    id: JOB_IDS.sophia_inTransit,
    createdAt: new Date("2026-04-24T11:00:00+09:30"),
    updatedAt: new Date("2026-04-25T08:15:00+09:30"),
    pickupAddress: "100 King William St, Adelaide SA 5000",
    dropoffAddress: "45 Rundle Mall, Adelaide SA 5000",
    packageType: PackageType.FURNITURE,
    status: DeliveryStatus.IN_TRANSIT,
    courier: sophia,
    notes: [],
  },
  {
    id: JOB_IDS.sophia_delivered,
    createdAt: new Date("2026-04-24T09:00:00+10:00"),
    updatedAt: new Date("2026-04-24T12:30:00+10:00"),
    pickupAddress: "1 London Circuit, Canberra ACT 2601",
    dropoffAddress: "55 Constitution Ave, Canberra ACT 2600",
    packageType: PackageType.DOCUMENT,
    status: DeliveryStatus.DELIVERED,
    courier: sophia,
    notes: notesFor(JOB_IDS.sophia_delivered),
  },

  // ── Christopher Bang ────────────────────────────────────────────────────────
  {
    id: JOB_IDS.chris_assigned,
    createdAt: new Date("2026-04-25T10:00:00+10:00"),
    updatedAt: new Date("2026-04-25T10:00:00+10:00"),
    pickupAddress: "3 Cavill Ave, Surfers Paradise QLD 4217",
    dropoffAddress: "50 Marine Parade, Coolangatta QLD 4225",
    packageType: PackageType.PERISHABLE,
    status: DeliveryStatus.ASSIGNED,
    courier: chris,
    notes: [],
  },
  {
    id: JOB_IDS.chris_inTransit,
    createdAt: new Date("2026-04-24T13:00:00+10:00"),
    updatedAt: new Date("2026-04-25T06:30:00+10:00"),
    pickupAddress: "1 King St, Newcastle NSW 2300",
    dropoffAddress: "100 Hunter St, Newcastle NSW 2300",
    packageType: PackageType.FRAGILE,
    status: DeliveryStatus.IN_TRANSIT,
    courier: chris,
    notes: [],
  },
  {
    id: JOB_IDS.chris_delivered,
    createdAt: new Date("2026-04-22T07:00:00+10:00"),
    updatedAt: new Date("2026-04-22T14:15:00+10:00"),
    pickupAddress: "1 Salamanca Place, Hobart TAS 7000",
    dropoffAddress: "22 Elizabeth St, Hobart TAS 7000",
    packageType: PackageType.APPLIANCE,
    status: DeliveryStatus.DELIVERED,
    courier: chris,
    notes: notesFor(JOB_IDS.chris_delivered),
  },
];
