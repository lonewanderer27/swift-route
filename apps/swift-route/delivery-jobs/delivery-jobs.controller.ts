import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { deliveryJobsStore } from "../src/stores";
import { DeliveryJob } from "@swift-route/types";
import { CreateDeliveryJobModel } from "./dto/create-delivery-job.dto";
import { UpdateDeliveryJobModel } from "./dto/update-delivery-job.dto";

@Controller("delivery-jobs")
export class DeliveryJobsController {
  // TODO: GET /delivery-jobs
  @Get()
  findAll(): DeliveryJob[] {
    return deliveryJobsStore;
  }

  // TODO: GET /delivery-jobs/:id
  @Get(":id")
  findOne(@Param("id") id: string) {
    return deliveryJobsStore.find((record) => record.id === id);
  }

  // TODO: POST /delivery-jobs
  @Post()
  createOne(@Body() createDeliveryJobModel: CreateDeliveryJobModel) {
    return createDeliveryJobModel;
  }

  // TODO: PUT /delivery-jobs/:id
  @Put(":id")
  updateOne(
    @Param("id") id: string,
    @Body() updateDeliveryJobModel: UpdateDeliveryJobModel,
  ) {
    const { id: _ignoredId, ...updatePayload } = updateDeliveryJobModel;

    return {
      id,
      ...updatePayload,
    };
  }

  // TODO: PATCH /delivery-jobs/:id/status
}
