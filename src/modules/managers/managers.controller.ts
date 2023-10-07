import { Controller } from '@nestjs/common';
import { ManagersService } from './managers.service';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}
}
