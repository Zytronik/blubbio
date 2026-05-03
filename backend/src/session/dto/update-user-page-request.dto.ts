import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPageRequestDto {
  @IsString()
  @IsNotEmpty()
  currentPage!: string;
}
