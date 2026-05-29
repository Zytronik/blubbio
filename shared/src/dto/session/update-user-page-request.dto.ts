import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPageRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currentPage!: string;
}
