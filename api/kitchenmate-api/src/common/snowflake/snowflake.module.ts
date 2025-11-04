// src/common/snowflake/snowflake.module.ts
import { Module } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';

@Module({
  providers: [],
  exports: [], // 导出 SnowflakeService 供其他模块使用
})
export class SnowflakeModule {}
