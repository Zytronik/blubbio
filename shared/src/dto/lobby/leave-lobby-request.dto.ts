import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveLobbyRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lobbyId!: string;
}
