import { RequestWithUser } from '@/common/types';
import { fileMimetypeFilter } from '@/filters/file-minetype.filter';
import { ParseFilePipe } from '@/pipes/parse-file.pipe';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard } from '../auth/guards';
import { CreateTicketDoc } from './docs';
import { CreateTicketDto } from './dto';
import { TicketsService } from './tickets.service';
import { SendEmailTicketCreatedEvent, UploadTicketImageEvent } from './events';

@Controller('tickets')
@ApiTags('tickets')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class TicketsController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly ticketsService: TicketsService,
    private readonly areasService: AreasService,
  ) {}

  @Post()
  @CreateTicketDoc()
  @UseInterceptors(
    FilesInterceptor('images', 5, { fileFilter: fileMimetypeFilter('image') }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @UploadedFiles(ParseFilePipe) images: Express.Multer.File[],
    @Body() dto: CreateTicketDto,
    @Req() { user }: RequestWithUser,
  ) {
    const area = await this.areasService.get(dto.area_id);
    const ticket = await this.ticketsService.create({
      ...dto,
      area,
      created_by: user,
    });
    this.eventEmitter.emit(
      'ticket.upload-image',
      new UploadTicketImageEvent(ticket.id, images),
    );
    this.eventEmitter.emit(
      'ticket.send-mail',
      new SendEmailTicketCreatedEvent(user.email, ticket.id),
    );
  }
}
