import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';

@ApiTags('volunteers')
@ApiBearerAuth('token')
@Controller('volunteers')
@UseGuards(JwtAccessTokenGuard)
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}
}
