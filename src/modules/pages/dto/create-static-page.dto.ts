import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { STATIC_PAGE_TYPE } from '../entities/static-page.entity';

export class CreateStaticPageDto {
  @IsNotEmpty()
  @IsEnum(STATIC_PAGE_TYPE)
  type: STATIC_PAGE_TYPE;

  @IsNotEmpty()
  @MaxLength(100000)
  content: string;

  @IsOptional()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @MaxLength(500)
  brief_content?: string;

  @IsOptional()
  @MaxLength(200)
  slug: string;

  @IsOptional()
  @MaxLength(200)
  keyword_SEO?: string;

  @IsOptional()
  @MaxLength(500)
  description_SEO?: string;
}
