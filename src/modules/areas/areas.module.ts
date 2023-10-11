import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { Area, AreaSchema } from './entities';
import { AreasRepository } from '@/repositories/areas.repository';

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
  exports: [AreasService],
})
export class AreasModule {}
