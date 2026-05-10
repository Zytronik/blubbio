import { IsNumber } from 'class-validator';

export class AudioSettingsDto {
  @IsNumber()
  musicVolume!: number;

  @IsNumber()
  sfxVolume!: number;
}
