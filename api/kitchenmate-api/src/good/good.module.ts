import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Good } from '../models/good.entity';
import { GoodSpec } from '../models/good-spec.entity';
import { GoodSpecValue } from '../models/good-spec-value.entity';
import { GoodSku } from '../models/good-sku.entity';
import { GoodSkuSpec } from '../models/good-sku-spec.entity';
import { GoodTag } from '../models/good-tag.entity';
import { PriceInfo } from '../models/price-info.entity';
import { Image } from '../models/image.entity';
import { GoodService } from './good.service';
import { GoodController } from './good.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Good,
      GoodSpec,
      GoodSpecValue,
      GoodSku,
      GoodSkuSpec,
      GoodTag,
      PriceInfo,
      Image
    ])
  ],
  providers: [GoodService],
  controllers: [GoodController],
  exports: [GoodService],
})
export class GoodModule {}
