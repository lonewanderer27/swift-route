import { Test, TestingModule } from "@nestjs/testing";
import { DeliveryJobsController } from "./delivery-jobs.controller";
import { DeliveryJobsService } from "./delivery-jobs.service";
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JOB_IDS } from "../stores/delivery-jobs.store";
import { DeliveryStatus } from "@swift-route/types";

describe("DeliveryJobsController", () => {
  let controller: DeliveryJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryJobsController],
      providers: [DeliveryJobsService],
    }).compile();

    controller = module.get<DeliveryJobsController>(DeliveryJobsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should throw Error 400 if there is no courierId", () => {
    expect(() => controller.findCourierJobs(undefined as any)).toThrow(
      BadRequestException,
    );
  });

  it("should throw 404 on unknown delivery job", () => {
    expect(() => controller.findOne("byd2c3d4-0001-4000-8000-000000000001"))
      .toThrow(
        NotFoundException,
      );
  });

  it("should return a known delivery job", () => {
    // choose one record from our static delivery jobs
    const jobId = JOB_IDS.chris_assigned;
    const expectedJob = controller.findOne(jobId);
    expect(controller.findOne(jobId)).toEqual(expectedJob);
  });

  it("should transition status from assigned to in-transit", () => {
    // choose one record from our static delivery jobs
    const jobId = JOB_IDS.chris_assigned;
    const initialJob = controller.findOne(jobId);

    // double check that the initial status is "assigned"
    const initialStatus = initialJob?.status;
    expect(initialStatus).toBe(DeliveryStatus.ASSIGNED);

    // now advance the status to "in-transit"
    // we expect that this will return the updated job
    const updatedJob = controller.patchStatus(jobId, {
      status: DeliveryStatus.IN_TRANSIT,
    });

    expect(
      updatedJob.status,
    ).toBe(DeliveryStatus.IN_TRANSIT);
  });

  it("should transition status from in-transit to delivered", () => {
    // choose one record from our static delivery jobs
    const jobId = JOB_IDS.chris_inTransit;
    const initialJob = controller.findOne(jobId);
    const expectedStatus = DeliveryStatus.DELIVERED;

    // double check that the initial status is "in-transit"
    const initialStatus = initialJob?.status;
    expect(initialStatus).toBe(DeliveryStatus.IN_TRANSIT);

    // now advance the status to "delivered"
    // we expect that this will return the updated job
    const updatedJob = controller.patchStatus(jobId, {
      status: expectedStatus,
    });

    expect(
      updatedJob.status,
    ).toBe(expectedStatus);
  });

  it("should throw 422 if tried to advance the status of an already delivered job", () => {
    // choose one record from our static delivery jobs
    const jobId = JOB_IDS.chris_delivered;
    const job = controller.findOne(jobId);

    // double check that the initial status is "delivered"
    const initialStatus = job?.status;
    expect(initialStatus).toBe(DeliveryStatus.DELIVERED);

    // now attempt to reverse status to "in-transit"
    // we expect it'll throw an Unprocessable Entity Exception (422)
    expect(() =>
      controller.patchStatus(jobId, { status: DeliveryStatus.IN_TRANSIT })
    ).toThrow(UnprocessableEntityException);
  });
});
