import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LobbyStartedResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lobbyId!: string;
}
