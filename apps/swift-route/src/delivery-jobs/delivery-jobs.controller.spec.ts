import { Test, TestingModule } from "@nestjs/testing";
import { DeliveryJobsController } from "./delivery-jobs.controller";
import { DeliveryJobsService } from "./delivery-jobs.service";
import { BadRequestException } from "@nestjs/common";

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

  it("should throw Error 400 if there is no courierId", async () => {
    expect(() => controller.findCourierJobs(undefined as any)).toThrow(
      BadRequestException,
    );
  });
});
