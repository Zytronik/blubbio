import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileImageResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message!: string;
}
