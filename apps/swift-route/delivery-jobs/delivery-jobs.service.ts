import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { deliveryJobsStore } from "../src/stores";
import {
  CreateDeliveryJobInput,
  CreateDeliveryJobModel,
} from "./dto/create-delivery-job.dto";
import {
  UpdateDeliveryJobInput,
  UpdateDeliveryJobModel,
} from "./dto/update-delivery-job.dto";
import {
  PatchDeliveryJobInput,
  PatchDeliveryJobModel,
} from "./dto/patch-delivery-job.dto";
import { PatchStatusInput, PatchStatusModel } from "./dto/patch-status.dto";
import { DeliveryStatus } from "@swift-route/types";

@Injectable()
export class DeliveryJobsService {
  private jobs = deliveryJobsStore;

  findAll(courierId?: string, status?: DeliveryStatus) {
    const jobs = this.jobs
      .filter((job) => {
        let includeJob = true;

        if (courierId) {
          includeJob = job.courier.id === courierId;
        } else {
          throw new BadRequestException("courierId is required");
        }

        if (includeJob && status) {
          includeJob = job.status === status;
        }

        return includeJob;
      });

    return jobs;
  }

  findOne(id: string) {
    // check first if we have the record
    const job = this.jobs.find((job) => job.id === id);

    if (!job) {
      // return a 404 error?
      throw new NotFoundException("Delivery Job not found");
    }

    // otherwise return the record
    return job;
  }

  createOne(body: CreateDeliveryJobInput) {
    // create a delivery job object
    const newJob = new CreateDeliveryJobModel(body);

    // push the new job to our static list
    this.jobs.push(newJob);
  }

  putOne(id: string, body: UpdateDeliveryJobInput) {
    // check first if we have the record
    const job = this.jobs.find((job) => job.id === id);

    if (!job) {
      // return a 404 error?
      throw new NotFoundException("Delivery Job not found");
    }

    // otherwise remove the existing record
    this.jobs = this.jobs.filter((job) => job.id != id);

    // create an updated imaginary record
    const updatedJob = new UpdateDeliveryJobModel(
      job.id,
      job.createdAt,
      body,
    );

    // then re-add the updated record
    this.jobs.push(updatedJob);

    // return the updated job
    return updatedJob;
  }

  patchOne(id: string, body: PatchDeliveryJobInput) {
    // check first if we have the record
    const job = this.jobs.find((job) => job.id === id);

    if (!job) {
      // return a 404 error?
      throw new NotFoundException("Delivery Job not found");
    }

    // otherwise remove the existing record
    this.jobs = this.jobs.filter((job) => job.id != id);

    // create a new updaated imaginary record
    const updatedJob = new PatchDeliveryJobModel(
      job,
      body,
    );

    // then re-add the updated record
    this.jobs.push(updatedJob);

    // return the updated job
    return updatedJob;
  }

  patchStatus(id: string, body: PatchStatusInput) {
    // check first if we have the record
    const jobIndex = this.jobs.findIndex((job) => job.id === id);
    const job = this.jobs.find((_, index) => jobIndex === index);

    if (!job) {
      // return a 404 error?
      throw new NotFoundException("Delivery Job not found");
    }

    const oldStatus = job.status;
    const newStatus = body.status;
    const invalidStatusException = new UnprocessableEntityException(
      `New delivery status not valid. Old: ${oldStatus}, New: ${newStatus}`,
    );

    // enforce valid status transition
    switch (oldStatus) {
      case DeliveryStatus.ASSIGNED: {
        // Assigned -> In-Transit
        if (newStatus !== DeliveryStatus.IN_TRANSIT) {
          throw invalidStatusException;
        }
        break;
      }
      case DeliveryStatus.IN_TRANSIT: {
        // In-Transit -> Delivered
        if (newStatus !== DeliveryStatus.DELIVERED) {
          throw invalidStatusException;
        }
      }
      case DeliveryStatus.DELIVERED: {
        // Delivered - Shall be final status
        throw invalidStatusException;
      }
      default: {
        // Do nothing, valid status change
      }
    }

    // proceed to remove the existing record
    this.jobs = this.jobs.filter((job) => job.id != id);

    // create a new updaated imaginary record
    const updatedJob = new PatchStatusModel(
      job,
      body,
    );

    // then re-add the updated record
    this.jobs.push(updatedJob);

    // return the updated job
    return updatedJob;
  }

  deleteOne(id: string) {
    // re-assign the jobs list without the specified record
    this.jobs = this.jobs.filter((job) => job.id != id);
  }
}
