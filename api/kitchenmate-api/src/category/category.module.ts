import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../models/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SnowflakeModule } from '../common/snowflake/snowflake.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category], 'default'), // 使用默认连接
    SnowflakeModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}