import { PagesRepository } from '@/repositories/pages.repository';
import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { StaticPage } from './entities/static-page.entity';

@Injectable()
export class PagesService extends BaseServiceAbstract<StaticPage> {
  constructor(
    @Inject('PagesRepository')
    private readonly pagesRepository: PagesRepository,
  ) {
    super(pagesRepository);
  }
}
