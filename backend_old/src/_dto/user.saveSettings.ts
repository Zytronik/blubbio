import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AudioSettings {
  @IsNumber()
  musicVolume: number;

  @IsNumber()
  sfxVolume: number;
}

class Input {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  customKeyMap: string[];

  @IsString()
  defaultKeyCode: string;

  @IsBoolean()
  isSingleTriggerAction: boolean;

  @IsBoolean()
  pressed: boolean;

  fire: () => void;

  @IsOptional()
  release?: () => void;

  @IsArray()
  inputContext: INPUT_CONTEXT[];
}

enum INPUT_CONTEXT {
  DISABLED = 'DISABLED',
  MENU = 'MENU',
  GAME_WITH_RESET = 'GAME_WITH_RESET',
  GAME_NO_RESET = 'GAME_NO_RESET',
}

export class SaveSettingsDto {
  @ValidateNested({ each: true })
  @Type(() => Input)
  inputs: Input[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  handlings: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  graphics: string[] | null;

  @ValidateNested()
  @Type(() => AudioSettings)
  audio: AudioSettings;
}
