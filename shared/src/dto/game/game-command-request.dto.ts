import { IsEnum, IsNotEmpty } from 'class-validator';
import { NETWORK_COMMAND } from '../../enum/game/network-command.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GameCommandRequestDto {
  @IsEnum(NETWORK_COMMAND)
  @IsNotEmpty()
  @ApiProperty()
  command!: NETWORK_COMMAND;
}
