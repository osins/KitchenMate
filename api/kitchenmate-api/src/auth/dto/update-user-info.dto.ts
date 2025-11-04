import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(2)
  gender?: number;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}