import { Injectable, NotFoundException } from "@nestjs/common";
import { deliveryJobsStore } from "../src/stores";
import {
  CreateDeliveryJobInput,
  CreateDeliveryJobModel,
} from "./dto/create-delivery-job.dto";
import {
  UpdateDeliveryJobInput,
  UpdateDeliveryJobModel,
} from "./dto/update-delivery-job.dto";

@Injectable()
export class DeliveryJobsService {
  private jobs = deliveryJobsStore;

  findAll() {
    return this.jobs;
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

  deleteOne(id: string) {
    // re-assign the jobs list without the specified record
    this.jobs = this.jobs.filter((job) => job.id != id);
  }
}
