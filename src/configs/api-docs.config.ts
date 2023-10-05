import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from '../metadata';

export async function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .addSecurity('token', { type: 'http', scheme: 'bearer' })
    .setTitle('Hmmmm project')
    .setDescription('## The Hmmmm API description')
    .setVersion('1.0.0')
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
