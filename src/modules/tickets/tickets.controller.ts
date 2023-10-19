import { RequestWithUser } from '@/common/types';
import { fileMimetypeFilter } from '@/filters/file-minetype.filter';
import { ParseFilePipe } from '@/pipes/parse-file.pipe';
import { InjectQueue } from '@nestjs/bullmq';
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
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Queue } from 'bullmq';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard } from '../auth/guards';
import { CreateTicketDto } from './dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@ApiTags('tickets')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class TicketsController {
  constructor(
    @InjectQueue('image:upload')
    private readonly imageUploadQueue: Queue,
    private readonly ticketsService: TicketsService,
    private readonly areasService: AreasService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        area_id: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        lat: {
          type: 'number',
        },
        lng: {
          type: 'number',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['area_id', 'title', 'lat', 'lng', 'images'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('images', 5, { fileFilter: fileMimetypeFilter('image') }),
  )
  @ApiNoContentResponse()
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
    await this.imageUploadQueue.add('upload-image', {
      ticketId: ticket.id,
      images,
    });
  }
}
