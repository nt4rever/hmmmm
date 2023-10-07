import { Module, forwardRef } from '@nestjs/common';
import { UserAreasService } from './user-areas.service';
// import { UserAreasController } from './user-areas.controller';
import { AreasModule } from '@modules/areas/areas.module';
import { UsersModule } from '@modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAreasRepository } from '@repositories/user-areas.repository';
import { UserArea, UserAreaSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserArea.name,
        schema: UserAreaSchema,
      },
    ]),
    UsersModule,
    forwardRef(() => AreasModule),
  ],
  // controllers: [UserAreasController],
  providers: [
    UserAreasService,
    {
      provide: 'UserAreasRepositoryInterface',
      useClass: UserAreasRepository,
    },
  ],
  exports: [UserAreasService],
})
export class UserAreasModule {}
