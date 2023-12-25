import { PaginationDto } from '@/common/dto';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { Public } from '@/decorators/auth.decorator';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
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
import { PaginationService } from '../pagination/pagination.service';
import { ROLES } from '../users/entities';
import { CreateStaticPageDto, GetStaticPageDto } from './dto';
import { PagesService } from './pages.service';
import {
  StaticPageGetSerialization,
  StaticPagePagingSerialization,
} from './serializations';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';

@Controller('pages')
@ApiTags('pages')
@ApiBearerAuth('token')
@Roles(ROLES.Admin)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly paginationService: PaginationService,
  ) {}

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

  @Get('/all')
  @PagingSerialization(StaticPagePagingSerialization)
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
  ) {
    const count = await this.pagesService.count();
    const pages = await this.pagesService.findAll(
      {},
      {
        paging: {
          limit,
          offset,
        },
        select: {
          content: 0,
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
      pages,
    );
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
