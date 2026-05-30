import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsArray, IsString } from 'class-validator';
import { AudioSettingsDto } from './audio-settings.dto';
import { GameInputDto } from '../game/game-input.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ValidateNested({ each: true })
  @Type(() => GameInputDto)
  @ApiProperty()
  inputs!: GameInputDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  handlings!: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  graphics!: string[] | null;

  @ValidateNested()
  @Type(() => AudioSettingsDto)
  @ApiProperty()
  audio!: AudioSettingsDto;
}
