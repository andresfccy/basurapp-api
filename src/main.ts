import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('BasurApp API')
    .setDescription('API REST para la aplicación de recolección de basuras')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación')
    .addTag('users', 'Gestión de usuarios')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Aplicación corriendo en http://localhost:${port}`);
  console.log(
    `📚 Documentación Swagger disponible en http://localhost:${port}/api`,
  );
}
void bootstrap();
