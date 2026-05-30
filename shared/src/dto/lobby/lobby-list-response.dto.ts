import { ApiProperty } from "@nestjs/swagger";
import { Lobby } from "../../types/lobby/lobby.type";


export class LobbyListResponseDto {
  @ApiProperty()
  lobbies!: Lobby[];
}
