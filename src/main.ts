import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './utils/transform.interceptor';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: String(configService.get('AWS_ACCESS_KEY_ID')),
    secretAccessKey: String(configService.get('AWS_SECRET_ACCESS_KEY')),
    region: configService.get('AWS_REGION'),
  });

  const options = new DocumentBuilder()
    .setTitle('RAVN Nest Challenge')
    .setDescription('Electronics Store API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Running in ${process.env.NODE_ENV} mode`);
}
bootstrap();
