import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { RequestWithUser } from '@/common/types';
import { Roles } from '@/decorators/roles.decorator';
import { ROLES } from '../users/entities';
import { FindAllSerialization } from '@/decorators/api-find-all.decorator';
import { TaskGetSerialization } from './serializations';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('my-task')
  @ApiOperation({
    summary: 'Volunteer get list task',
  })
  @Roles(ROLES.Volunteer)
  @UseGuards(RolesGuard)
  @FindAllSerialization({
    classToIntercept: TaskGetSerialization,
    isArray: true,
  })
  async myTask(@Req() { user }: RequestWithUser) {
    return await this.tasksService.findAll(
      {
        assignee: user,
      },
      {
        join: {
          path: 'ticket',
        },
      },
    );
  }
}
