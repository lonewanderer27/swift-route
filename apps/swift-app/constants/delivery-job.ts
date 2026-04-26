import { DeliveryStatus, PackageType } from "@swift-route/types";

export const STATUS_CONFIG: Record<DeliveryStatus, { label: string; bg: string; color: string }> = {
  [DeliveryStatus.ASSIGNED]: { label: "Assigned", bg: "#DBEAFE", color: "#1D4ED8" },
  [DeliveryStatus.IN_TRANSIT]: { label: "In Transit", bg: "#FFEDD5", color: "#C2410C" },
  [DeliveryStatus.DELIVERED]: { label: "Delivered", bg: "#DCFCE7", color: "#15803D" },
};

export const PACKAGE_ICON: Record<PackageType, string> = {
  [PackageType.DOCUMENT]: "📄",
  [PackageType.PERISHABLE]: "🧊",
  [PackageType.FRAGILE]: "⚠️",
  [PackageType.APPLIANCE]: "🔌",
  [PackageType.FURNITURE]: "🪑",
};
