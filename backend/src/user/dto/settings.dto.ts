import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsArray, IsString } from 'class-validator';
import { AudioSettingsDto } from './audio-settings.dto';
import { GameInputDto } from 'src/game/dto/game-input.dto';

export class SettingsDto {
  @ValidateNested({ each: true })
  @Type(() => GameInputDto)
  inputs!: GameInputDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  handlings!: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  graphics!: string[] | null;

  @ValidateNested()
  @Type(() => AudioSettingsDto)
  audio!: AudioSettingsDto;
}
