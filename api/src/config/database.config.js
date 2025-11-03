const { ConfigService } = require('@nestjs/config');

const configService = new ConfigService();

module.exports = {
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_DATABASE', 'kitchenmate'),
  
  // 迁移配置
  migrations: ['migrations/*.js'],
  migrationsTableName: 'migrations',
  
  // 连接池配置
  extra: {
    connectionLimit: 5,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  
  charset: 'utf8mb4',
  timezone: '+08:00',
  
  // 重连策略
  retryAttempts: 3,
  retryDelay: 3000,
};