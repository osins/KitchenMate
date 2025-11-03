import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl, Min, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: '商品名称不能为空' })
  @IsString({ message: '商品名称必须是字符串' })
  name: string;

  @IsOptional()
  @IsString({ message: '商品描述必须是字符串' })
  description?: string;

  @IsNotEmpty({ message: '价格不能为空' })
  @IsNumber({}, { message: '价格必须是数字' })
  @Min(0, { message: '价格不能小于0' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: '原价必须是数字' })
  @Min(0, { message: '原价不能小于0' })
  originalPrice?: number;

  @IsNotEmpty({ message: '库存不能为空' })
  @IsNumber({}, { message: '库存必须是数字' })
  @Min(0, { message: '库存不能小于0' })
  stock: number;

  @IsOptional()
  @IsUrl({}, { message: '主图URL格式不正确' })
  imageUrl?: string;

  @IsOptional()
  @IsArray({ message: '图片列表必须是数组' })
  imageUrls?: string[];

  @IsOptional()
  @IsNumber({}, { message: '分类ID必须是数字' })
  categoryId?: number;

  @IsOptional()
  @IsNumber({}, { message: '排序值必须是数字' })
  sortOrder?: number;

  @IsOptional()
  specifications?: Record<string, any>;
}