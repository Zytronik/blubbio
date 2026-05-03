import { Test, TestingModule } from '@nestjs/testing';
import { GlickoService } from './glicko.service';

describe('GlickoService', () => {
  let service: GlickoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlickoService],
    }).compile();

    service = module.get<GlickoService>(GlickoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
