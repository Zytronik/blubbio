import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NETWORK_COMMAND } from '../enum/network-command.enum';

export class GameCommandResponseDto {
  @IsEnum(NETWORK_COMMAND)
  @IsNotEmpty()
  command!: NETWORK_COMMAND;

  @IsString()
  @IsNotEmpty()
  username!: string;
}
