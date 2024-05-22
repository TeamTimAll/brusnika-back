import { Test, TestingModule } from '@nestjs/testing';
import { CarParkingsController } from './car-parkings.controller';

describe('CarParkingsController', () => {
  let controller: CarParkingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarParkingsController],
    }).compile();

    controller = module.get<CarParkingsController>(CarParkingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
