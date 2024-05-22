import { Test, TestingModule } from '@nestjs/testing';
import { CommercialBuildingsService } from './commercial-buildings.service';

describe('CommercialBuildingsService', () => {
  let service: CommercialBuildingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialBuildingsService],
    }).compile();

    service = module.get<CommercialBuildingsService>(CommercialBuildingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
