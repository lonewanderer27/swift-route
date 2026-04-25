import { Test, TestingModule } from "@nestjs/testing";
import { DeliveryJobsController } from "./delivery-jobs.controller";
import { DeliveryJobsService } from "./delivery-jobs.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { deliveryJobsStore, JOB_IDS } from "../stores/delivery-jobs.store";

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
    const expectedJob = deliveryJobsStore.find((job) => job.id === jobId);
    expect(controller.findOne(jobId)).toBe(expectedJob);
  });
});
