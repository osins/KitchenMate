// src/common/snowflake/snowflake.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

export interface SnowflakeOptions {
  epoch?: number; // 自定义起始时间戳（毫秒）
  datacenterId?: number; // 0-31
  workerId?: number; // 0-31
}

@Injectable()
export class SnowflakeService implements OnModuleInit {
  private readonly logger = new Logger(SnowflakeService.name);

  private epoch: bigint;
  private datacenterId: bigint;
  private workerId: bigint;

  private sequence: bigint = 0n;
  private lastTimestamp: bigint = 0n;

  // bit lengths
  private readonly sequenceBits = 12n;
  private readonly workerIdBits = 5n;
  private readonly datacenterIdBits = 5n;
  private readonly maxSequence = (1n << this.sequenceBits) - 1n; // 4095
  private readonly maxWorkerId = (1n << this.workerIdBits) - 1n; // 31
  private readonly maxDatacenterId = (1n << this.datacenterIdBits) - 1n; // 31

  // shifts
  private readonly workerIdShift = this.sequenceBits;
  private readonly datacenterIdShift = this.sequenceBits + this.workerIdBits;
  private readonly timestampShift =
    this.sequenceBits + this.workerIdBits + this.datacenterIdBits;

  constructor(options?: SnowflakeOptions) {
    // 默认 epoch：2020-01-01T00:00:00.000Z
    const defaultEpoch = Date.UTC(2020, 0, 1);
    this.epoch = BigInt(options?.epoch ?? defaultEpoch);
    const datacenterId = options?.datacenterId ?? 0;
    const workerId = options?.workerId ?? 0;

    if (datacenterId < 0 || datacenterId > Number(this.maxDatacenterId)) {
      throw new Error(
        `datacenterId must be between 0 and ${this.maxDatacenterId}`,
      );
    }
    if (workerId < 0 || workerId > Number(this.maxWorkerId)) {
      throw new Error(`workerId must be between 0 and ${this.maxWorkerId}`);
    }

    this.datacenterId = BigInt(datacenterId);
    this.workerId = BigInt(workerId);
  }

  onModuleInit() {
    this.logger.log(
      `Snowflake initialized - epoch=${this.epoch}, datacenter=${this.datacenterId}, worker=${this.workerId}`,
    );
  }

  private currentTimestamp(): bigint {
    return BigInt(Date.now());
  }

  private async waitNextMillis(lastTs: bigint): Promise<bigint> {
    let ts = this.currentTimestamp();
    while (ts <= lastTs) {
      // spin wait - small sleep to avoid 100% CPU
      await new Promise((r) => setTimeout(r, 0));
      ts = this.currentTimestamp();
    }
    return ts;
  }

  /**
   * 生成下一个 ID，返回 string（因为 BigInt 在 JSON 中不安全）
   */
  async nextId(): Promise<string> {
    let timestamp = this.currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      // 时钟回拨：短暂等待直到回到 lastTimestamp（也可选择抛错）
      const diff = this.lastTimestamp - timestamp;
      this.logger.warn(`Clock moved backwards. Waiting ${diff} ms.`);
      timestamp = await this.waitNextMillis(this.lastTimestamp);
    }

    if (timestamp === this.lastTimestamp) {
      // 同一毫秒内
      this.sequence = (this.sequence + 1n) & this.maxSequence;
      if (this.sequence === 0n) {
        // 序列溢出，等待下一毫秒
        timestamp = await this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      // 新的毫秒，重置 sequence
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const shiftedTimestamp = (timestamp - this.epoch) << this.timestampShift;
    const shiftedDatacenter = this.datacenterId << this.datacenterIdShift;
    const shiftedWorker = this.workerId << this.workerIdShift;
    const id =
      shiftedTimestamp | shiftedDatacenter | shiftedWorker | this.sequence;

    // 返回字符串格式，兼容数据库与前端传输
    return id.toString();
  }

  /**
   * 如果你还想返回 BigInt 类型（用于内部处理），可以使用：
   */
  async nextBigInt(): Promise<bigint> {
    const idStr = await this.nextId();
    return BigInt(idStr);
  }

  // 解码示例（字符串 id）
  decode(idStr: string) {
    const id = BigInt(idStr);
    const timestamp = (id >> this.timestampShift) + this.epoch;
    const datacenterId =
      (id >> this.datacenterIdShift) & ((1n << this.datacenterIdBits) - 1n);
    const workerId =
      (id >> this.workerIdShift) & ((1n << this.workerIdBits) - 1n);
    const sequence = id & this.maxSequence;
    return {
      timestamp: Number(timestamp),
      datacenterId: Number(datacenterId),
      workerId: Number(workerId),
      sequence: Number(sequence),
    };
  }
}
