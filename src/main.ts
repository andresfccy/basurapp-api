import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  return app;
}

async function bootstrap() {
  if (process.env.SERVERLESS === 'true') {
    return;
  }

  const app = await createApp();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Aplicación corriendo en http://localhost:${port}`);
  console.log(
    `📚 Documentación Swagger disponible en http://localhost:${port}/api`,
  );
}
void bootstrap();
