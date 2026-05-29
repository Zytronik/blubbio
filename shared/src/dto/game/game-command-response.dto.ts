import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NETWORK_COMMAND } from '../../enum/game/network-command.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GameCommandResponseDto {
  @IsEnum(NETWORK_COMMAND)
  @IsNotEmpty()
  @ApiProperty()
  command!: NETWORK_COMMAND;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username!: string;
}
