import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsPositive, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray } from 'class-validator';

@Entity('invoice_vos')
export class InvoiceVO {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  buyerName: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  buyerTaxNo: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  buyerPhone: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  email: string;

  @Column({ type: 'int', default: 2 })
  @IsNumber()
  @Min(1)
  @Max(2)
  titleType: number;

  @Column({ type: 'int', default: 1 })
  @IsNumber()
  @Min(1)
  @Max(2)
  ontentType: number;

  @Column({ type: 'int', default: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  invoiceType: number;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  money: string;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString()
  updatedAt: Date;
}