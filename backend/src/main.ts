import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as promClient from 'prom-client';
import helmet from 'helmet';
import compression from 'compression';
import { Response, Request } from 'express';

function parseOrigins(env?: string): (string | RegExp)[] | boolean {
  if (!env) return true; // dev: libera tudo
  const items = env.split(',').map(s => s.trim()).filter(Boolean);
  if (!items.length) return true;
  return items.map((s) => {
    if (s.startsWith('/') && s.endsWith('/')) {
      const body = s.slice(1, -1);
      return new RegExp(body);
    }
    return s;
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança e performance
  const isProd = (process.env.NODE_ENV || 'development') === 'production';
  app.use(helmet());
  app.use(compression());

  // CORS por .env
  const origins = parseOrigins(process.env.CORS_ORIGINS);
  app.enableCors({ origin: origins, credentials: true });

  // Prefixo global
  app.setGlobalPrefix('api');

  // Validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Rotare API')
    .setDescription('API do sistema Rotare')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // /health
  app.getHttpAdapter().getInstance().get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // /metrics (Prometheus)
  promClient.collectDefaultMetrics();
  app.getHttpAdapter().getInstance().get('/metrics', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

  // Shutdown hooks (permitir sigterm/sigint)
  app.enableShutdownHooks();

  await app.listen(process.env.API_PORT ? Number(process.env.API_PORT) : 3000);
}
bootstrap();
