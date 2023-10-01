import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './entities';
import { AreasRepository } from '@repositories/areas.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Area.name,
        schema: AreaSchema,
      },
    ]),
  ],
  controllers: [AreasController],
  providers: [
    AreasService,
    {
      provide: 'AreasRepositoryInterface',
      useClass: AreasRepository,
    },
  ],
})
export class AreasModule {}
