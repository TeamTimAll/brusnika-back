import { Test, TestingModule } from '@nestjs/testing';
import { PremisesController } from './premises.controller';

describe('PremisesController', () => {
  let controller: PremisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PremisesController],
    }).compile();

    controller = module.get<PremisesController>(PremisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
