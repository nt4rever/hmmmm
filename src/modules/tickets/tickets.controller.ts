import { RequestWithUser } from '@/common/types';
import { fileMimetypeFilter } from '@/filters/file-minetype.filter';
import { ParseFilePipe } from '@/pipes/parse-file.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { CreateTicketDoc } from './docs';
import {
  AssignTicketDto,
  CreateTicketDto,
  FilterTicketDto,
  UpdateTicketDto,
} from './dto';
import { TicketsService } from './tickets.service';
import {
  AssignTaskEvent,
  SendEmailTicketCreatedEvent,
  UploadTicketImageEvent,
} from './events';
import { PaginationDto } from '@/common/dto';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import { PaginationService } from '../pagination/pagination.service';
import { Ticket } from './entities';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { TicketPagingSerialization } from './serializations';
import { Public } from '@/decorators/auth.decorator';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { TicketGetSerialization } from './serializations/ticket.get.serialization';
import { Roles } from '@/decorators/roles.decorator';
import { ROLES } from '../users/entities';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { VolunteersService } from '../volunteers/volunteers.service';
import { TasksService } from '../tasks/tasks.service';

@Controller('tickets')
@ApiTags('tickets')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class TicketsController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly ticketsService: TicketsService,
    private readonly areasService: AreasService,
    private readonly volunteersService: VolunteersService,
    private readonly tasksService: TasksService,
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
    this.eventEmitter.emit('ticket.assign-task', new AssignTaskEvent(ticket.id));
  }

  @Get()
  @Public()
  @PagingSerialization(TicketPagingSerialization)
  @ApiOperation({
    summary: 'Public API',
  })
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
    @Query() filter: FilterTicketDto,
  ) {
    const count = await this.ticketsService.count(filter);
    const tickets = await this.ticketsService.findAll(filter, {
      join: [
        {
          path: 'created_by',
          select: 'first_name last_name',
        },
        {
          path: 'area',
        },
      ],
      paging: {
        limit,
        offset,
      },
      order: {
        ...order,
      },
      select: {
        evidences: 0,
      },
    });
    return this.paginationService.paginate<Ticket>(
      {
        page,
        per_page,
        count,
      },
      tickets,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Public API',
  })
  @DocumentSerialization(TicketGetSerialization)
  async get(@Param('id', ParseMongoIdPipe) id: string) {
    const ticket = await this.ticketsService.findOne(id, {
      join: [
        {
          path: 'created_by',
          select: 'first_name last_name',
        },
        {
          path: 'area',
        },
        {
          path: 'evidences',
          populate: {
            path: 'created_by',
            select: 'first_name last_name',
          },
        },
      ],
    });
    if (!ticket) {
      throw new NotFoundException(ERRORS_DICTIONARY.TICKET_NOT_FOUND);
    }
    return ticket;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Area manager update ticket information',
  })
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateTicketDto,
    @Req() { user }: RequestWithUser,
  ) {
    const ticket = await this.ticketsService.findOneByCondition({
      _id: id,
      area: user.area,
    });
    if (!ticket) {
      throw new NotFoundException(ERRORS_DICTIONARY.TICKET_NOT_FOUND);
    }
    await this.ticketsService.update(ticket.id, dto);
  }

  @Post(':id/assign')
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async assign(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: AssignTicketDto,
    @Req() { user }: RequestWithUser,
  ) {
    const ticket = await this.ticketsService.getByArea(id, user.area);
    const assignee = await this.volunteersService.get(dto.assignee, user.area);
    await this.tasksService.create({
      ticket,
      assignee,
      note: dto.note,
      expires_at: dto.expires_at,
    });
  }
}
