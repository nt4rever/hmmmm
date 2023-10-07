import { DatabaseConfig, database_config } from '@configs/configuration.config';
import { ClassValidatorExceptionFilter } from '@exception-filters/class-validator-exception.filter';
import { MongoExceptionFilter } from '@exception-filters/mongo-exception.filter';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalExceptionFilter } from '@exception-filters/global-exception.filter';
import { AwsModule } from '@modules/aws/aws.module';
import * as Joi from 'joi';
import { AreasModule } from '@modules/areas/areas.module';
import { UserAreasModule } from '@modules/user-areas/user-areas.module';
import { VolunteersModule } from '@modules/volunteers/volunteers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_URI: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        JWT_ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_PRIVATE_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        AWS_ENDPOINT: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
        AWS_S3_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [database_config],
      cache: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<DatabaseConfig>('database').uri,
        dbName: configService.get<DatabaseConfig>('database').name,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AwsModule,
    AreasModule,
    UserAreasModule,
    VolunteersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ClassValidatorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
  ],
})
export class AppModule {}
