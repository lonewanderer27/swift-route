import {
  Courier,
  DeliveryJob,
  DeliveryNote,
  DeliveryStatus,
  PackageType,
} from "@swift-route/types";
import { randomUUID } from "crypto";

export type CreateDeliveryJobInput = {
  pickup_address: string;
  dropoff_address: string;
  package_type: PackageType;
  courier: string;
  notes?: string[];
};

export class CreateDeliveryJobModel implements DeliveryJob {
  public id: string;
  public pickupAddress: string;
  public dropoffAddress: string;
  public packageType: PackageType;
  public status: DeliveryStatus;
  public notes: DeliveryNote[];
  public courier: Courier;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(input: CreateDeliveryJobInput) {
    this.id = randomUUID();
    this.pickupAddress = input.pickup_address;
    this.dropoffAddress = input.dropoff_address;
    this.packageType = input.package_type;
    this.status = DeliveryStatus.ASSIGNED;
    this.createdAt = new Date();
    this.updatedAt = new Date();

    // Transform note strings → DeliveryNote objects
    this.notes = (input.notes ?? []).map((note) => ({
      id: randomUUID(),
      createdAt: new Date(),
      deliveryId: this.id,
      note: note,
    }));

    // Transform courier name -> Courier objects
    this.courier = {
      id: randomUUID(),
      name: input.courier,
    };
  }
}
