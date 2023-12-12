import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post as PostMethod,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { Roles } from '@/decorators/roles.decorator';
import { ROLES } from '../users/entities';
import {
  CreatePostCategoryDto,
  CreatePostDto,
  FilterPostDto,
  UpdatePostDto,
} from './dto';
import { FindAllSerialization } from '@/decorators/api-find-all.decorator';
import {
  PostCategoryGetSerialization,
  PostGetSerialization,
  PostPagingSerialization,
} from './serializations';
import { Public } from '@/decorators/auth.decorator';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import { PaginationDto } from '@/common/dto';
import { PaginationService } from '../pagination/pagination.service';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Throttle } from '@nestjs/throttler';
import { isObjectIdOrHexString } from 'mongoose';

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth('token')
@Roles(ROLES.Admin)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly paginationService: PaginationService,
  ) {}

  @PostMethod('category')
  @ApiOperation({
    summary: 'Admin create new post category',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async createCategory(@Body() dto: CreatePostCategoryDto) {
    await this.postsService.createCategory(dto);
  }

  @Get('categories')
  @Public()
  @FindAllSerialization({
    isArray: true,
    classToIntercept: PostCategoryGetSerialization,
  })
  async allCategory() {
    return await this.postsService.allCategory();
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id', ParseMongoIdPipe) id: string) {
    await this.postsService.removeCategory(id);
  }

  @PostMethod()
  @ApiOperation({
    summary: 'Admin create new post',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() dto: CreatePostDto) {
    await this.postsService.create(dto);
  }

  @Get()
  @Public()
  @PagingSerialization(PostPagingSerialization)
  async allPost(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
    @Query() filter: FilterPostDto,
  ) {
    const count = await this.postsService.count(filter);
    const posts = await this.postsService.findAll(filter, {
      join: {
        path: 'category',
      },
      paging: {
        limit,
        offset,
      },
      order: {
        ...order,
      },
    });
    return this.paginationService.paginate(
      {
        page,
        per_page,
        count,
      },
      posts,
    );
  }

  @Get(':id')
  @Public()
  @DocumentSerialization(PostGetSerialization)
  async getPost(@Param('id') id: string) {
    const searchParam = isObjectIdOrHexString(id)
      ? {
          _id: id,
        }
      : { slug: id };
    const post = await this.postsService.findOneByCondition(searchParam, {
      join: {
        path: 'category',
      },
    });
    if (!post) {
      throw new NotFoundException(ERRORS_DICTIONARY.POST_NOT_FOUND);
    }
    return post;
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(ERRORS_DICTIONARY.POST_NOT_FOUND);
    }
    const category = await this.postsService.findCategory(dto.category);
    await this.postsService.update(id, {
      ...dto,
      category,
    });
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseMongoIdPipe) id: string) {
    await this.postsService.remove(id);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Public()
  @Get(':id/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  async view(@Param('id', ParseMongoIdPipe) id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) return;

    await this.postsService.update(id, { view_count: post.view_count + 1 });
  }
}
