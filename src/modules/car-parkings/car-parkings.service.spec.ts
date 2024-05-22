import { Test, TestingModule } from '@nestjs/testing';
import { CarParkingsService } from './car-parkings.service';

describe('CarParkingsService', () => {
  let service: CarParkingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarParkingsService],
    }).compile();

    service = module.get<CarParkingsService>(CarParkingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
