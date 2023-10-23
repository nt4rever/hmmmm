import { IsDateString, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class AssignTicketDto {
  @IsNotEmpty()
  @IsMongoId()
  assignee: string;

  @IsOptional()
  note?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: Date;
}
