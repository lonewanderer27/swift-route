import type { DeliveryJob } from "@swift-route/types";
import { DeliveryStatus, PackageType } from "@swift-route/types";

const JOB_IDS = {
  assigned: "a1b2c3d4-0001-4000-8000-000000000001",
  inTransit: "a1b2c3d4-0002-4000-8000-000000000002",
  delivered: "a1b2c3d4-0003-4000-8000-000000000003",
} as const;

export const deliveryNotesStore: DeliveryJob["notes"] = [
  {
    id: "n1b2c3d4-0001-4000-8000-000000000001",
    deliveryId: JOB_IDS.delivered,
    createdAt: new Date("2026-04-23T09:15:00+10:00"),
    note: "Arrived at pick-up location. Furniture wrapped and loaded onto van.",
  },
  {
    id: "n1b2c3d4-0002-4000-8000-000000000002",
    deliveryId: JOB_IDS.delivered,
    createdAt: new Date("2026-04-23T11:40:00+10:00"),
    note: "Traffic delay on M1. ETA updated to 1:00 PM.",
  },
  {
    id: "n1b2c3d4-0003-4000-8000-000000000003",
    deliveryId: JOB_IDS.delivered,
    createdAt: new Date("2026-04-23T13:05:00+10:00"),
    note: "Delivery complete. Recipient signed. No damage reported.",
  },
];

export const deliveryJobsStore: DeliveryJob[] = [
  {
    id: JOB_IDS.assigned,
    createdAt: new Date("2026-04-25T08:00:00+10:00"),
    updatedAt: new Date("2026-04-25T08:00:00+10:00"),
    pickupAddress: "1 Martin Place, Sydney NSW 2000",
    dropoffAddress: "200 George St, Sydney NSW 2000",
    packageType: PackageType.DOCUMENT,
    status: DeliveryStatus.ASSIGNED,
    notes: [],
  },
  {
    id: JOB_IDS.inTransit,
    createdAt: new Date("2026-04-24T14:30:00+10:00"),
    updatedAt: new Date("2026-04-25T07:45:00+10:00"),
    pickupAddress: "45 Collins St, Melbourne VIC 3000",
    dropoffAddress: "320 Swanston St, Melbourne VIC 3000",
    packageType: PackageType.FRAGILE,
    status: DeliveryStatus.IN_TRANSIT,
    notes: [],
  },
  {
    id: JOB_IDS.delivered,
    createdAt: new Date("2026-04-23T08:00:00+10:00"),
    updatedAt: new Date("2026-04-23T13:05:00+10:00"),
    pickupAddress: "88 Creek St, Brisbane QLD 4000",
    dropoffAddress: "12 Fortitude Valley Rd, Brisbane QLD 4006",
    packageType: PackageType.FURNITURE,
    status: DeliveryStatus.DELIVERED,
    notes: deliveryNotesStore.filter((n) => n.deliveryId === JOB_IDS.delivered),
  },
];
