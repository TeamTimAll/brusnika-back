import { Test, TestingModule } from '@nestjs/testing';
import { ClientStatusController } from './client-status.controller';

describe('ClientStatusController', () => {
  let controller: ClientStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientStatusController],
    }).compile();

    controller = module.get<ClientStatusController>(ClientStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
