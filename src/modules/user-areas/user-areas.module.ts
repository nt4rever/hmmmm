import { Module } from '@nestjs/common';
import { UserAreasService } from './user-areas.service';
import { UserAreasController } from './user-areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserArea, UserAreaSchema } from './entities';
import { UserAreasRepository } from '@repositories/user-areas.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserArea.name,
        schema: UserAreaSchema,
      },
    ]),
  ],
  controllers: [UserAreasController],
  providers: [
    UserAreasService,
    {
      provide: 'UserAreasRepositoryInterface',
      useClass: UserAreasRepository,
    },
  ],
})
export class UserAreasModule {}
