import { configSwagger } from '@configs/api-docs.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix(configService.get('API_PREFIX'));
  app.enableCors();
  app.use(morgan('tiny'));

  if (
    !configService.get('SWAGGER_ENABLE') ||
    configService.get('SWAGGER_ENABLE') === '1'
  ) {
    configSwagger(app);
  }

  await app.listen(configService.get('PORT') || 8000, async () => {
    logger.log(`Application running on ${await app.getUrl()}/api-docs`);
  });
}
bootstrap();
