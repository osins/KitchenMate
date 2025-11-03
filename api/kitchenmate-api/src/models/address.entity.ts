import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, default: '88888888' })
  @IsString()
  saasId: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  uid: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  authToken: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  addressId: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  countryName: string;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  countryCode: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  provinceName: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  provinceCode: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  cityName: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  cityCode: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  districtName: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  districtCode: string;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  detailAddress: string;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(1)
  isDefault: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  addressTag: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  latitude: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  longitude: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  storeId: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}