import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class ResponseIdSerialization {
  @ApiProperty({
    example: '631d9f32a65cf07250b8938c',
  })
  @Type(() => String)
  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  id: string;

  @ApiPropertyOptional()
  created_at?: Date;

  @ApiPropertyOptional()
  updated_at?: Date;

  @ApiPropertyOptional()
  deleted_at?: Date;
}
