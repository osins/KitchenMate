import { IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsNumber({}, { message: '数量必须是数字' })
  @Min(1, { message: '数量不能小于1' })
  quantity?: number;

  @IsOptional()
  @IsBoolean({ message: '选择状态必须是布尔值' })
  isSelected?: boolean;
}