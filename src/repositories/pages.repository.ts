import {
  StaticPage,
  StaticPageDocument,
} from '@/modules/pages/entities/static-page.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

@Injectable()
export class PagesRepository extends BaseRepositoryAbstract<StaticPageDocument> {
  constructor(
    @InjectModel(StaticPage.name)
    private readonly pageModel: Model<StaticPageDocument>,
  ) {
    super(pageModel);
  }
}
