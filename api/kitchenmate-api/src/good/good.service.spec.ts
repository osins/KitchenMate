import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Good } from '../models/good.entity';
import { GoodSpec } from '../models/good-spec.entity';
import { GoodSpecValue } from '../models/good-spec-value.entity';
import { GoodSku } from '../models/good-sku.entity';
import { GoodSkuSpec } from '../models/good-sku-spec.entity';
import { GoodTag } from '../models/good-tag.entity';
import { GoodService } from './good.service';

describe('GoodService', () => {
  let service: GoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoodService,
        {
          provide: getRepositoryToken(Good),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(GoodSpec),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GoodSpecValue),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GoodSku),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GoodSkuSpec),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GoodTag),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: Connection,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {
                create: jest.fn(),
                save: jest.fn(),
              },
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<GoodService>(GoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
