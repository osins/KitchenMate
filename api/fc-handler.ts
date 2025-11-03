import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';

let app: NestFastifyApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );

    // 安全中间件
    await app.register(fastifyHelmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    });

    // CORS 配置
    await app.register(fastifyCors, {
      origin: [
        'https://kitchenmate.example.com',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    });

    // 全局验证管道
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // 设置全局前缀
    app.setGlobalPrefix('api/v1');

    // 初始化应用
    await app.init();
  }
  
  return app;
}

/**
 * 阿里云函数计算入口处理器
 * @param event 事件对象
 * @param context 上下文对象
 * @returns 响应对象
 */
export const handler = async (event: any, context: any) => {
  try {
    const appInstance = await bootstrap();
    const fastifyInstance = appInstance.getHttpAdapter().getInstance();

    // 解析阿里云 FC 的事件格式
    const { httpMethod, path, headers, queryString, body, isBase64Encoded } = event;
    
    // 构造 Fastify 的请求格式
    const request = {
      method: httpMethod,
      url: path,
      headers: headers || {},
      query: queryString || {},
      body: isBase64Encoded ? Buffer.from(body, 'base64').toString() : body,
    };

    // 使用 Fastify 的 inject 方法处理请求
    const response = await fastifyInstance.inject(request);

    return {
      isBase64Encoded: false,
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.body,
    };
  } catch (error) {
    console.error('Handler error:', error);
    
    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable',
      }),
    };
  }
};

// 本地开发入口
if (require.main === module) {
  bootstrap().then(async (app) => {
    await app.listen(process.env.PORT || 7001, '0.0.0.0');
    console.log(`🚀 KitchenMate API is running on: http://localhost:${process.env.PORT || 7001}`);
  });
}