import { IsNotEmpty, IsString } from 'class-validator';

export class StartLobbyRequestDto {
  @IsString()
  @IsNotEmpty()
  lobbyId!: string;
}
