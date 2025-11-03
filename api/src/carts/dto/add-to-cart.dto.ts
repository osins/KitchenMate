import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty({ message: '商品ID不能为空' })
  @IsNumber({}, { message: '商品ID必须是数字' })
  productId: number;

  @IsNotEmpty({ message: '数量不能为空' })
  @IsNumber({}, { message: '数量必须是数字' })
  @Min(1, { message: '数量不能小于1' })
  quantity: number;
}