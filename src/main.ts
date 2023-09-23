import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from '@configs/api-docs.config';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  configSwagger(app);
  await app.listen(configService.get('PORT') || 8000, () => {
    logger.log(
      `Application running on port http://localhost:${
        configService.get('PORT') || 8000
      }/api-docs`,
    );
  });
}
bootstrap();
