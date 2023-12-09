import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ExportReportDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
