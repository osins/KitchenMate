import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('payment_vos')
export class PaymentVO {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  payStatus: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  amount: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @IsOptional()
  @IsString()
  currency: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  payType: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  payWay: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  payWayName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  interactId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  traceNo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  channelTrxNo: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  period: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  payTime: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  paySuccessTime: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}