import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';
import { AreaDocument, Area } from '@/modules/areas/entities';
import { AreasRepositoryInterface } from '@/modules/areas/interfaces';

@Injectable()
export class AreasRepository
  extends BaseRepositoryAbstract<AreaDocument>
  implements AreasRepositoryInterface
{
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<AreaDocument>,
  ) {
    super(areaModel);
  }
}
