import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPwResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message!: string;
}
