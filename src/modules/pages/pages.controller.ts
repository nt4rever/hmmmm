import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { Public } from '@/decorators/auth.decorator';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Roles } from '@/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { ROLES } from '../users/entities';
import { CreateStaticPageDto, GetStaticPageDto } from './dto';
import { PagesService } from './pages.service';
import { StaticPageGetSerialization } from './serializations';

@Controller('pages')
@ApiTags('pages')
@ApiBearerAuth('token')
@Roles(ROLES.Admin)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @Public()
  @DocumentSerialization(StaticPageGetSerialization)
  async get(@Query() dto: GetStaticPageDto) {
    const page = await this.pagesService.findOneByCondition({
      type: dto.type,
      ...(dto.slug ? { slug: dto.slug } : {}),
    });
    if (!page) {
      throw new NotFoundException(ERRORS_DICTIONARY.PAGE_NOT_FOUND);
    }
    return page;
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() dto: CreateStaticPageDto) {
    const page = await this.pagesService.findOneByCondition({
      type: dto.type,
      ...(dto.slug ? { slug: dto.slug } : {}),
    });

    if (page) {
      return await this.pagesService.update(page._id.toString(), dto);
    }

    return await this.pagesService.create(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Query() dto: GetStaticPageDto) {
    const page = await this.pagesService.findOneByCondition({
      type: dto.type,
      ...(dto.slug ? { slug: dto.slug } : {}),
    });
    if (!page) {
      throw new NotFoundException(ERRORS_DICTIONARY.PAGE_NOT_FOUND);
    }
    await this.pagesService.hardRemove(page._id.toString());
  }
}
