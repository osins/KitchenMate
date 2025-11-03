import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('logistics_vos')
export class LogisticsVO {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  logisticsType: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  logisticsNo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  logisticsStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  logisticsCompanyCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  logisticsCompanyName: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  receiverAddressId: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  provinceCode: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  cityCode: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  countryCode: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  receiverProvince: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  receiverCity: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  receiverCountry: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  receiverArea: string;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  receiverAddress: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  receiverPostCode: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  receiverLongitude: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  receiverLatitude: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  receiverIdentity: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  receiverPhone: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  receiverName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  expectArrivalTime: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  senderName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  senderPhone: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  senderAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  sendTime: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  arrivalTime: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}