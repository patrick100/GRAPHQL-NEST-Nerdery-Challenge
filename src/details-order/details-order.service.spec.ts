import { Test, TestingModule } from '@nestjs/testing';
import { DetailsOrderService } from './details-order.service';

describe('DetailsOrderService', () => {
  let service: DetailsOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailsOrderService],
    }).compile();

    service = module.get<DetailsOrderService>(DetailsOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
