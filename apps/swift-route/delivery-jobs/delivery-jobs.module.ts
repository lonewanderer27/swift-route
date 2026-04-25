import { Module } from '@nestjs/common';
import { DeliveryJobsController } from './delivery-jobs.controller';

@Module({
  controllers: [DeliveryJobsController]
})
export class DeliveryJobsModule {}
