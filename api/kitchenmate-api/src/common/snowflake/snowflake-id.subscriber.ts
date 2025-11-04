// src/common/snowflake/snowflake-id.subscriber.ts
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { SnowflakeService } from './snowflake.service';
import { ConfigService } from '@nestjs/config';

@EventSubscriber()
export class SnowflakeIdSubscriber implements EntitySubscriberInterface {
  private snowflakeService: SnowflakeService;

  constructor() {
    // 手动创建 SnowflakeService 实例
    this.snowflakeService = new SnowflakeService(new ConfigService());
    console.log('SnowflakeIdSubscriber constructor', this.snowflakeService);
  }

  async beforeInsert(event: InsertEvent<any>) {
    const entity = event.entity;

    if (!entity) return;

    // 若实体已有 id 则不覆盖
    if (!entity.id) {
      entity.id = await this.snowflakeService.nextId();

      console.log(`Generated snowflake ID: ${entity.id}`, event);
    }
  }
}
