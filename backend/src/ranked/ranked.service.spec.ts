import { Test, TestingModule } from '@nestjs/testing';
import { RankedService } from './ranked.service';

describe('RankedService', () => {
  let service: RankedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankedService],
    }).compile();

    service = module.get<RankedService>(RankedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
