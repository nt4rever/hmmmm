import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { STATIC_PAGE_TYPE } from '../entities/static-page.entity';

export class GetStaticPageDto {
  @IsNotEmpty()
  @IsEnum(STATIC_PAGE_TYPE)
  type: STATIC_PAGE_TYPE;

  @IsOptional()
  @IsString()
  slug?: string;
}
