import { Evidence, EvidenceDocument } from '@/modules/tickets/entities';
import { BaseRepositoryAbstract } from './base';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EvidencesRepositoryInterface } from '@/modules/tickets/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EvidencesRepository
  extends BaseRepositoryAbstract<EvidenceDocument>
  implements EvidencesRepositoryInterface
{
  constructor(
    @InjectModel(Evidence.name) private readonly evidenceModel: Model<EvidenceDocument>,
  ) {
    super(evidenceModel);
  }
}
