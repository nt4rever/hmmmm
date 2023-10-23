import { ResponsePagingSerialization } from '@/common/serializations';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskGetSerialization } from './task.get.serialization';

export class TaskPagingSerialization extends ResponsePagingSerialization {
  @Type(() => TaskGetSerialization)
  @ApiProperty({
    type: TaskGetSerialization,
    isArray: true,
  })
  items: TaskGetSerialization[];
}
