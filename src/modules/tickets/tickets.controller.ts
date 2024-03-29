import { PaginationDto } from '@/common/dto';
import { RequestWithUser } from '@/common/types';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { Public } from '@/decorators/auth.decorator';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { fileMimetypeFilter } from '@/filters/file-minetype.filter';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseFilePipe } from '@/pipes/parse-file.pipe';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import {
  BadRequestException,
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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { VOTE_TYPE } from '../comments/entities';
import { PaginationService } from '../pagination/pagination.service';
import { TasksService } from '../tasks/tasks.service';
import { ROLES } from '../users/entities';
import { UsersService } from '../users/users.service';
import { VolunteersService } from '../volunteers/volunteers.service';
import { CreateTicketDoc } from './docs';
import {
  AssignTicketDto,
  CreateTicketDto,
  FilterTicketDto,
  UpdateTicketDto,
} from './dto';
import { Ticket } from './entities';
import {
  AssignTaskEvent,
  SendEmailTicketCreatedEvent,
  UploadTicketImageEvent,
} from './events';
import { TicketPagingSerialization } from './serializations';
import { TicketGetSerialization } from './serializations/ticket.get.serialization';
import { TicketsService } from './tickets.service';
import { Throttle } from '@nestjs/throttler';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

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
    private readonly usersService: UsersService,
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
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
    const canCreateTicket = await this.usersService.canCreateTicket(user);
    if (!canCreateTicket) {
      throw new BadRequestException(ERRORS_DICTIONARY.MAX_TICKET_PER_DAY);
    }
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
  @ApiQuery({
    name: 'user',
    type: String,
    required: false,
  })
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
    @Query() filter: FilterTicketDto,
    @Query('user') user?: string,
  ) {
    const count = await this.ticketsService.count(filter);
    const tickets = await this.ticketsService.findAll(filter, {
      join: [
        {
          path: 'comment_count',
        },
        {
          path: 'created_by',
          select: 'first_name last_name role avatar',
        },
        {
          path: 'area',
        },
        {
          path: 'voted_by',
          match: {
            created_by: user,
            type: VOTE_TYPE.TICKET,
          },
          select: {
            created_by: 0,
          },
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

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Public()
  @Get(':id/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  async view(@Param('id', ParseMongoIdPipe) id: string) {
    const ticket = await this.ticketsService.findOne(id);
    if (!ticket) return;
    await this.ticketsService.update(id, { view_count: ticket.view_count + 1 });
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Public API',
  })
  @DocumentSerialization(TicketGetSerialization)
  @ApiQuery({
    name: 'user',
    type: String,
    required: false,
  })
  async get(@Param('id', ParseMongoIdPipe) id: string, @Query('user') user?: string) {
    const ticket = await this.ticketsService.findOne(id, {
      join: [
        {
          path: 'comment_count',
        },
        {
          path: 'created_by',
          select: 'first_name last_name role avatar',
        },
        {
          path: 'area',
        },
        {
          path: 'evidences',
          populate: {
            path: 'created_by',
            select: 'first_name last_name role  avatar',
          },
        },
        {
          path: 'voted_by',
          match: {
            created_by: user,
            type: VOTE_TYPE.TICKET,
          },
          select: {
            created_by: 0,
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
    const task = await this.tasksService.create({
      ticket,
      assignee,
      note: dto.note,
      expires_at: dto.expires_at,
    });
    this.mailQueue.add(
      'ticket-assigned',
      {
        ticketId: ticket.id,
        email: assignee.email,
        taskId: task.id,
      },
      { removeOnComplete: true },
    );
  }
}
