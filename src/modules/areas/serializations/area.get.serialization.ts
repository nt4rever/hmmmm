import { ResponseIdSerialization } from '@common/serializations';
import { ApiProperty } from '@nestjs/swagger';

export class AreaGetSerialization extends ResponseIdSerialization {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  radius: number;

  @ApiProperty()
  is_active: boolean;
}
