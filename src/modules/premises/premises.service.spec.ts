import { Test, TestingModule } from '@nestjs/testing';
import { PremisesService } from './premises.service';

describe('PremisesService', () => {
  let service: PremisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PremisesService],
    }).compile();

    service = module.get<PremisesService>(PremisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
