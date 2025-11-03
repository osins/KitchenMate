import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
            createWithChildren: jest.fn(),
            findAll: jest.fn(),
            findTree: jest.fn(),
            findRootCategories: jest.fn(),
            findOne: jest.fn(),
            findByGroupId: jest.fn(),
            findChildrenByParentId: jest.fn(),
            findChildrenByParentGroupId: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeByGroupId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});