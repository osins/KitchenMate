// src/common/snowflake/snowflake.module.ts
import { Module } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';

@Module({
  providers: [
    {
      provide: SnowflakeService,
      useFactory: () => {
        return new SnowflakeService({ datacenterId: 1, workerId: 3 });
      },
    },
  ],
  exports: [SnowflakeService],
})
export class SnowflakeModule {}
