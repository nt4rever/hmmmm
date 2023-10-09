import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ManagersService } from './managers.service';

@Controller('managers')
@ApiTags('managers')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}
}
