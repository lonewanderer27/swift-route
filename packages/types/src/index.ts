enum DeliveryStatus {
  ASSIGNED = "assigned",
  IN_TRANSIT = "in-transit",
  DELIVERED = "delivered",
}

enum PackageType {
  DOCUMENT = "document",
  PERISHABLE = "perishable",
  FRAGILE = "fragile",
  APPLIANCE = "appliance",
  FURNITURE = "furniture",
}

type DeliveryNote = {
  id: string;
  createdAt: Date;
  deliveryId: string;
  note: string;
};

type DeliveryJob = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  pickupAddress: string;
  dropoffAddress: string;
  packageType: PackageType;
  status: DeliveryStatus;
  notes: DeliveryNote[];
};

export type { DeliveryJob, DeliveryNote };
export { DeliveryStatus, PackageType };
