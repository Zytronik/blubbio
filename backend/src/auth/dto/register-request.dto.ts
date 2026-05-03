import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @MaxLength(15)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Username must contain, numbers, hyphens, and underscores.',
  })
  @ApiProperty()
  username!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @ApiProperty()
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @ApiProperty()
  password!: string;
}
