import { IsEnum, IsNotEmpty } from 'class-validator';
import { NETWORK_COMMAND } from '../enum/network-command.enum';

export class GameCommandRequestDto {
  @IsEnum(NETWORK_COMMAND)
  @IsNotEmpty()
  command!: NETWORK_COMMAND;
}
