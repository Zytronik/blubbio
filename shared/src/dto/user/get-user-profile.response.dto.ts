import { ApiProperty } from '@nestjs/swagger';

export class GetUserProfileResponseDto {
  @ApiProperty()
  uid!: string;
  @ApiProperty()
  username!: string;
  @ApiProperty()
  email!: string;
  @ApiProperty()
  countryCode?: string;
  @ApiProperty()
  country?: string;
  @ApiProperty()
  pbUrl?: string;
  @ApiProperty()
  bannerUrl?: string;
  @ApiProperty()
  lastDisconnectedAt?: Date;
  @ApiProperty()
  settings?: string;
  @ApiProperty()
  createdAt!: Date;
}
