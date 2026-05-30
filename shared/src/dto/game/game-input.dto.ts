import { IsArray, IsBoolean, IsString } from 'class-validator';
import { INPUT_CONTEXT } from '../../enum/game/input-context.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GameInputDto {
  @IsString()
  @ApiProperty()
  name!: string;

  @IsString()
  @ApiProperty()
  description!: string;

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  customKeyMap!: string[];

  @IsString()
  @ApiProperty()
  defaultKeyCode!: string;

  @IsBoolean()
  @ApiProperty()
  isSingleTriggerAction!: boolean;

  @IsBoolean()
  @ApiProperty()
  pressed!: boolean;

  @IsArray()
  @ApiProperty()
  inputContext!: INPUT_CONTEXT[];
}
