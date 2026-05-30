import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token!: string;
}
