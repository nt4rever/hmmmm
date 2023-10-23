import { IsEnum, IsOptional, MaxLength } from 'class-validator';
import { TICKET_STATUS } from '../entities';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum UPDATE_TICKET_STATUS {
  IN_PROCESS = 'IN_PROCESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  NEW = 'NEW',
}

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(UPDATE_TICKET_STATUS)
  @ApiPropertyOptional({
    enum: UPDATE_TICKET_STATUS,
  })
  status?: TICKET_STATUS;

  @IsOptional()
  @MaxLength(500)
  close_message?: string;

  @IsOptional()
  @MaxLength(500)
  resolve_message?: string;
}
