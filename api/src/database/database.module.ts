import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development', // 仅开发环境同步
        logging: configService.get('NODE_ENV') === 'development',
        
        // 连接池配置 (Serverless 环境优化)
        extra: {
          connectionLimit: 5, // 限制连接数，避免 FC 冷启动问题
          acquireTimeout: 60000, // 获取连接超时时间
          timeout: 60000, // 连接超时时间
        },
        
        // 其他优化选项
        charset: 'utf8mb4',
        timezone: '+08:00', // 中国时区
        
        // 重连策略
        retryAttempts: 3,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}