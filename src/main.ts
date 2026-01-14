import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { CustomResponseFilter } from './common/filter/logging-exception.filter.js';
import { DetailedLoggingInterceptor } from './common/interceptor/detailed-logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new DetailedLoggingInterceptor());
  app.useGlobalFilters(new CustomResponseFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 ~ App is running on port: ${await app.getUrl()}`);
}
bootstrap();
