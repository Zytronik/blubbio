import { IsArray, IsBoolean, IsString } from 'class-validator';
import { INPUT_CONTEXT } from '../enum/input-context.enum';

export class InputDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  customKeyMap!: string[];

  @IsString()
  defaultKeyCode!: string;

  @IsBoolean()
  isSingleTriggerAction!: boolean;

  @IsBoolean()
  pressed!: boolean;

  @IsArray()
  inputContext!: INPUT_CONTEXT[];
}