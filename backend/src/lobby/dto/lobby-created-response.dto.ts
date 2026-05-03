import { IsNotEmpty, IsString } from 'class-validator';

export class LobbyCreatedResponseDto {
  @IsString()
  @IsNotEmpty()
  lobbyId!: string;
}
