import { ApiProperty } from '@nestjs/swagger';
import { Lobby } from '../../types/lobby/lobby.type';

export class LobbyUpdateResponseDto {
  @ApiProperty()
  lobby!: Lobby;
}
