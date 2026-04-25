import type { DeliveryNote } from "@swift-route/types";

// Delivered job IDs — mirrored from delivery-jobs.store.ts to avoid circular imports
const DELIVERED_JOB_IDS = {
  jungkook: "a1b2c3d4-0003-4000-8000-000000000003",
  sophia: "a1b2c3d4-0006-4000-8000-000000000006",
  chris: "a1b2c3d4-0009-4000-8000-000000000009",
} as const;

export const deliveryNotesStore: DeliveryNote[] = [
  // Jeon Jung-kook — delivered fragile package, Brisbane
  {
    id: "n1b2c3d4-0001-4000-8000-000000000001",
    deliveryId: DELIVERED_JOB_IDS.jungkook,
    createdAt: new Date("2026-04-23T09:15:00+10:00"),
    note: "Arrived at pick-up location. Fragile items bubble-wrapped and crated.",
  },
  {
    id: "n1b2c3d4-0002-4000-8000-000000000002",
    deliveryId: DELIVERED_JOB_IDS.jungkook,
    createdAt: new Date("2026-04-23T11:40:00+10:00"),
    note: "Traffic delay on M1. ETA updated to 1:00 PM.",
  },
  {
    id: "n1b2c3d4-0003-4000-8000-000000000003",
    deliveryId: DELIVERED_JOB_IDS.jungkook,
    createdAt: new Date("2026-04-23T13:05:00+10:00"),
    note: "Delivery complete. Recipient signed. No damage reported.",
  },

  // Sophia Laforteza — delivered document package, Canberra
  {
    id: "n1b2c3d4-0004-4000-8000-000000000004",
    deliveryId: DELIVERED_JOB_IDS.sophia,
    createdAt: new Date("2026-04-24T10:00:00+10:00"),
    note: "Documents collected and sealed. Chain of custody form signed at pick-up.",
  },
  {
    id: "n1b2c3d4-0005-4000-8000-000000000005",
    deliveryId: DELIVERED_JOB_IDS.sophia,
    createdAt: new Date("2026-04-24T12:30:00+10:00"),
    note: "Delivered to receptionist. ID verified. Recipient acknowledged receipt.",
  },

  // Christopher Bang — delivered appliance, Hobart
  {
    id: "n1b2c3d4-0006-4000-8000-000000000006",
    deliveryId: DELIVERED_JOB_IDS.chris,
    createdAt: new Date("2026-04-22T08:30:00+10:00"),
    note: "Appliance loaded onto truck with lift gate. Packaging intact.",
  },
  {
    id: "n1b2c3d4-0007-4000-8000-000000000007",
    deliveryId: DELIVERED_JOB_IDS.chris,
    createdAt: new Date("2026-04-22T11:00:00+10:00"),
    note: "Ferry crossing delayed by 30 minutes due to weather. Notified recipient.",
  },
  {
    id: "n1b2c3d4-0008-4000-8000-000000000008",
    deliveryId: DELIVERED_JOB_IDS.chris,
    createdAt: new Date("2026-04-22T14:15:00+10:00"),
    note: "Appliance installed at drop-off. Customer inspected and accepted delivery.",
  },
];
