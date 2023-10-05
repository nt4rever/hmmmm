import { configSwagger } from '@configs/api-docs.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(configService.get('API_PREFIX'));
  app.enableCors();
  app.use(morgan('tiny'));

  if (
    !configService.get('SWAGGER_ENABLE') ||
    configService.get('SWAGGER_ENABLE') === '1'
  ) {
    await configSwagger(app);
  }

  await app.listen(configService.get('PORT') || 8000, () => {
    logger.log(
      `Application running on port http://localhost:${
        configService.get('PORT') || 8000
      }/api-docs`,
    );
  });
}
bootstrap();
