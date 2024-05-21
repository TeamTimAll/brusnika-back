import { Test, TestingModule } from '@nestjs/testing';
import { ClientStatusService } from './client-status.service';

describe('ClientStatusService', () => {
  let service: ClientStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientStatusService],
    }).compile();

    service = module.get<ClientStatusService>(ClientStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
