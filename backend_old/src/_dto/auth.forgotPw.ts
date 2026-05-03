import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPwDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
