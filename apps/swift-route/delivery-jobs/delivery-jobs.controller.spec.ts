import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryJobsController } from './delivery-jobs.controller';
import { describe, beforeEach, it } from 'node:test';

describe('DeliveryJobsController', () => {
  let controller: DeliveryJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryJobsController],
    }).compile();

    controller = module.get<DeliveryJobsController>(DeliveryJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
