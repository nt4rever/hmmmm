import { PaginationDto } from '@/common/dto';
import { RequestWithUser } from '@/common/types';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { fileMimetypeFilter } from '@/filters/file-minetype.filter';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipe,
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
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { PaginationService } from '../pagination/pagination.service';
import { AddEvidenceEvent, UploadEvidenceImageEvent } from '../tickets/events';
import { EvidencesService } from '../tickets/evidences.service';
import { ROLES } from '../users/entities';
import { UpdateTaskDoc } from './docs';
import { FilterTaskDto, UpdateTaskDto } from './dto';
import { TASK_STATUS } from './entities';
import { TaskGetSerialization, TaskPagingSerialization } from './serializations';
import { TasksService } from './tasks.service';
import { FindAllSerialization } from '@/decorators/api-find-all.decorator';
import { ORDER_DIRECTION_TYPE } from '@/common/interfaces';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class TasksController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tasksService: TasksService,
    private readonly evidencesService: EvidencesService,
    private readonly paginationService: PaginationService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Volunteer get list task',
  })
  @Roles(ROLES.Volunteer)
  @UseGuards(RolesGuard)
  @PagingSerialization(TaskPagingSerialization)
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
    @Query() filter: FilterTaskDto,
    @Req() { user }: RequestWithUser,
  ) {
    const count = await this.tasksService.count({
      assignee: user,
      ...filter,
    });
    const tasks = await this.tasksService.findAll(
      {
        assignee: user,
        ...filter,
      },
      {
        join: {
          path: 'ticket',
          select: {
            area: 0,
            created_by: 0,
            evidences: 0,
          },
        },
        select: {
          assignee: 0,
        },
        paging: {
          limit,
          offset,
        },
        order: {
          ...order,
        },
      },
    );
    return this.paginationService.paginate(
      {
        page,
        per_page,
        count,
      },
      tasks,
    );
  }

  @Get('ticket/:id')
  @FindAllSerialization({
    classToIntercept: TaskGetSerialization,
    isArray: true,
  })
  async getByTicket(@Param('id', ParseMongoIdPipe) id: string) {
    const tasks = await this.tasksService.findAll(
      {
        ticket: id,
      },
      {
        join: {
          path: 'assignee',
          select: 'first_name last_name role avatar',
        },
        select: {
          ticket: 0,
        },
        order: {
          created_at: ORDER_DIRECTION_TYPE.ASC,
        },
      },
    );
    return tasks;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Volunteer task detail',
  })
  @DocumentSerialization(TaskGetSerialization)
  @Roles(ROLES.Volunteer)
  @UseGuards(RolesGuard)
  async get(@Param('id', ParseMongoIdPipe) id: string, @Req() { user }: RequestWithUser) {
    return await this.tasksService.findOneByCondition(
      {
        _id: id,
        assignee: user,
      },
      {
        join: [
          {
            path: 'ticket',
            populate: [
              { path: 'area' },
              { path: 'created_by', select: 'first_name last_name' },
              {
                path: 'evidences',
                populate: {
                  path: 'created_by',
                  select: 'first_name last_name',
                },
              },
            ],
          },
        ],
        select: {
          assignee: 0,
        },
      },
    );
  }

  @Patch(':id')
  @UpdateTaskDoc()
  @UseInterceptors(
    FilesInterceptor('images', 5, { fileFilter: fileMimetypeFilter('image') }),
  )
  @Roles(ROLES.Volunteer)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFiles(ParseFilePipe) images: Express.Multer.File[],
    @Body() dto: UpdateTaskDto,
    @Req() { user }: RequestWithUser,
  ) {
    const task = await this.tasksService.findOneByCondition(
      {
        _id: id,
        assignee: user,
      },
      {
        join: {
          path: 'ticket',
        },
      },
    );
    if (!task) {
      throw new NotFoundException(ERRORS_DICTIONARY.TASK_NOT_FOUND);
    }

    const evidence = await this.evidencesService.create({
      ...dto,
      created_by: user,
    });

    this.eventEmitter.emit(
      'evidence.upload-image',
      new UploadEvidenceImageEvent(task.ticket.id, evidence.id, images),
    );

    this.eventEmitter.emit(
      'ticket.add-evidence',
      new AddEvidenceEvent(task.ticket.id, evidence.id, dto.type),
    );

    await this.tasksService.update(task.id, {
      status: TASK_STATUS.DONE,
    });
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Volunteer change task status to CANCEL',
  })
  @Roles(ROLES.Volunteer)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() { user }: RequestWithUser,
  ) {
    const task = await this.tasksService.findOneByCondition({
      _id: id,
      assignee: user,
      status: TASK_STATUS.PENDING,
    });
    if (!task) {
      throw new NotFoundException(ERRORS_DICTIONARY.TASK_NOT_FOUND);
    }
    await this.tasksService.update(task.id, {
      status: TASK_STATUS.CANCELED,
    });
  }
}
