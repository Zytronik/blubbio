import { IsNotEmpty, IsString } from 'class-validator';

export class LobbyStartedResponseDto {
  @IsString()
  @IsNotEmpty()
  lobbyId!: string;
}
