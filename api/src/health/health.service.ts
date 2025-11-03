import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  async getHealthStatus() {
    const startTime = Date.now();
    
    // 这里可以添加数据库连接检查、Redis连接检查等
    const databaseStatus = 'healthy'; // 实际实现中应检查数据库连接
    const redisStatus = 'healthy'; // 实际实现中应检查Redis连接
    
    const responseTime = Date.now() - startTime;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get('NODE_ENV', 'development'),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: databaseStatus,
        redis: redisStatus,
      },
      responseTime: `${responseTime}ms`,
    };
  }
}