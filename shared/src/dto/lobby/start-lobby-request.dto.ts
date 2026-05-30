import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StartLobbyRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lobbyId!: string;
}
