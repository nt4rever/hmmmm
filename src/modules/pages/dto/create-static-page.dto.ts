import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { STATIC_PAGE_TYPE } from '../entities/static-page.entity';
import { Type } from 'class-transformer';

class StaticPageContentDto {
  @IsNotEmpty()
  @MaxLength(20)
  lang: string;

  @IsNotEmpty()
  @MaxLength(1000000)
  value: string;
}

export class CreateStaticPageDto {
  @IsNotEmpty()
  @IsEnum(STATIC_PAGE_TYPE)
  type: STATIC_PAGE_TYPE;

  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => StaticPageContentDto)
  content: StaticPageContentDto[];

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
