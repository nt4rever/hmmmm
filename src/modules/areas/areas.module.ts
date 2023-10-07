import { UserAreasModule } from '@modules/user-areas/user-areas.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasRepository } from '@repositories/areas.repository';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { Area, AreaSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Area.name,
        schema: AreaSchema,
      },
    ]),
    UserAreasModule,
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
