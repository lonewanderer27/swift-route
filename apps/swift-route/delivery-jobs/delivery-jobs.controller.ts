import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { DeliveryJob, DeliveryStatus } from "@swift-route/types";
import { CreateDeliveryJobInput } from "./dto/create-delivery-job.dto";
import { UpdateDeliveryJobInput } from "./dto/update-delivery-job.dto";
import { DeliveryJobsService } from "./delivery-jobs.service";
import { PatchDeliveryJobInput } from "./dto/patch-delivery-job.dto";
import { PatchStatusInput } from "./dto/patch-status.dto";

@Controller("delivery-jobs")
export class DeliveryJobsController {
  constructor(private deliveryJobsService: DeliveryJobsService) {}

  /*
    TODO: GET /delivery-jobs

    required param: ?courierId (string)
    optional param: ?status (DeliveryStatus)
  */
  @Get()
  findAll(
    @Query("courierId") courierId: string,
    @Query("status") status: DeliveryStatus,
  ): DeliveryJob[] {
    return this.deliveryJobsService.findAll(courierId, status);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deliveryJobsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOne(@Body() body: CreateDeliveryJobInput) {
    return this.deliveryJobsService.createOne(body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  updateOne(
    @Param("id") id: string,
    @Body() body: UpdateDeliveryJobInput,
  ) {
    return this.deliveryJobsService.putOne(id, body);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  patchOne(
    @Param("id") id: string,
    @Body() body: PatchDeliveryJobInput,
  ) {
    return this.deliveryJobsService.patchOne(id, body);
  }

  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  patchStatus(
    @Param("id") id: string,
    @Body() body: PatchStatusInput,
  ) {
    return this.deliveryJobsService.patchStatus(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeOne(
    @Param("id") id: string,
  ) {
    return this.deliveryJobsService.deleteOne(id);
  }
}
