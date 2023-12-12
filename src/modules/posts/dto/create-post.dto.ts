import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @MaxLength(500)
  brief_content?: string;

  @IsNotEmpty()
  @MaxLength(100000)
  content: string;

  @IsOptional()
  @MaxLength(200)
  picture?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag_search?: string[];

  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @IsOptional()
  @MaxLength(200)
  keyword_SEO?: string;

  @IsOptional()
  @MaxLength(500)
  description_SEO?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;
}
