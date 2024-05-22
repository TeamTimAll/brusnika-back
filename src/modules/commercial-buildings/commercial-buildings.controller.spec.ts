import { Test, TestingModule } from '@nestjs/testing';
import { CommercialBuildingsController } from './commercial-buildings.controller';

describe('CommercialBuildingsController', () => {
  let controller: CommercialBuildingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialBuildingsController],
    }).compile();

    controller = module.get<CommercialBuildingsController>(CommercialBuildingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
