import { ValidateNested, IsOptional, IsArray, IsString } from 'class-validator';

export class SettingsDto {
  @ValidateNested({ each: true })
  inputs!: any[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  handlings!: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  graphics!: string[] | null;

  @ValidateNested()
  audio!: any;
}
