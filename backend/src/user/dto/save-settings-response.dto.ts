import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SaveSettingsResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message!: string;
}
