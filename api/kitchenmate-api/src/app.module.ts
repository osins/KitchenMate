import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoodModule } from './good/good.module';
import { CategoryModule } from './category/category.module';
import { SnowflakeIdSubscriber } from './common/snowflake/snowflake-id.subscriber';
import { SnowflakeModule } from './common/snowflake/snowflake.module';
import { SnowflakeService } from './common/snowflake/snowflake.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kitchenmate',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // 在生产环境中不要使用 synchronize
      logging: process.env.NODE_ENV !== 'production',
      poolSize: parseInt(process.env.DB_CONNECTION_LIMIT || '5', 10), // 阿里云RDS连接数限制
      subscribers: [SnowflakeIdSubscriber],
    }),
    GoodModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
