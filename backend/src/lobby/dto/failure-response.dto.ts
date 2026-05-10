import { IsNotEmpty, IsString } from 'class-validator';

export class FailureResponseDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}
