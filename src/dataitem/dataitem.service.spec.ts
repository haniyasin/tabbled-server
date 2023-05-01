import { Test, TestingModule } from '@nestjs/testing';
import { DataItemService } from './dataitem.service';

describe('DataitemService', () => {
  let service: DataItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataItemService],
    }).compile();

    service = module.get<DataItemService>(DataItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
