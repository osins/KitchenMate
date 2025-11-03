import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  addressId: number;

  @IsString()
  @IsOptional()
  remark?: string;
}