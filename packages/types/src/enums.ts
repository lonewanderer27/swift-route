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

export { DeliveryStatus, PackageType };
