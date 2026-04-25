import type { Courier } from "@swift-route/types";

export const COURIER_IDS = {
  jungkook: "c1b2c3d4-0001-4000-8000-000000000001",
  sophia: "c1b2c3d4-0002-4000-8000-000000000002",
  chris: "c1b2c3d4-0003-4000-8000-000000000003",
} as const;

export const courierStore: Courier[] = [
  { id: COURIER_IDS.jungkook, name: "Jeon Jung-kook" },
  { id: COURIER_IDS.sophia, name: "Sophia Laforteza" },
  { id: COURIER_IDS.chris, name: "Christopher Bang" },
];
