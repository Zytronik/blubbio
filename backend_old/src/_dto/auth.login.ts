import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Username must contain, numbers, hyphens, and underscores.',
  })
  readonly username: string;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly password: string;
}
