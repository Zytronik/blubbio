import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveLobbyRequestDto {
  @IsString()
  @IsNotEmpty()
  lobbyId!: string;
}
