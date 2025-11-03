import { IsString, IsNotEmpty, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  province: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  district: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  detailAddress: string;

  @IsString()
  @IsOptional()
  @Length(0, 10)
  postalCode?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}