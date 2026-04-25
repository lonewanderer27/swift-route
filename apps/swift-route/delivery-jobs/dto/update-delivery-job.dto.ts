import {
  Courier,
  DeliveryJob,
  DeliveryNote,
  DeliveryStatus,
  PackageType,
} from "@swift-route/types";
import { randomUUID } from "crypto";

type UpdateDeliveryJobInput = {
  pickupAddress: string;
  dropoffAddress: string;
  packageType: PackageType;
  status: DeliveryStatus;
  courier: string;
  notes?: string[];
};

export class UpdateDeliveryJobModel implements DeliveryJob {
  public id: string;
  public pickupAddress: string;
  public dropoffAddress: string;
  public packageType: PackageType;
  public status: DeliveryStatus;
  public notes: DeliveryNote[];
  public courier: Courier;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(input: UpdateDeliveryJobInput) {
    this.id = randomUUID();
    this.pickupAddress = input.pickupAddress;
    this.dropoffAddress = input.dropoffAddress;
    this.packageType = input.packageType;
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

    // Transform courier name -> Courier object
    this.courier = {
      id: randomUUID(),
      name: input.courier
    }
  }
}
