import { IsNotEmpty, IsString } from 'class-validator';

export class JoinLobbyRequestDto {
  @IsString()
  @IsNotEmpty()
  lobbyId!: string;
}
