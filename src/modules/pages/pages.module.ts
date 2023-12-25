import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticPage, StaticPageSchema } from './entities/static-page.entity';
import { PagesRepository } from '@/repositories/pages.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StaticPage.name,
        schema: StaticPageSchema,
      },
    ]),
  ],
  controllers: [PagesController],
  providers: [
    PagesService,
    {
      provide: 'PagesRepository',
      useClass: PagesRepository,
    },
  ],
})
export class PagesModule {}
