import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AudioSettingsDto {
  @ApiProperty()
  @IsNumber()
  musicVolume!: number;

  @IsNumber()
  @ApiProperty()
  sfxVolume!: number;
}
