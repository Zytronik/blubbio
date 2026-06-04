import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateSprintRequestDto {
    @ApiProperty()
    @IsNumber()
    gameStartTime!: number;

    @ApiProperty()
    @IsNumber()
    gameEndTime!: number;

    @ApiProperty()
    @IsNumber()
    gameDuration!: number;

    @ApiProperty()
    @IsNumber()
    bubblesShot!: number;

    @ApiProperty()
    @IsNumber()
    bubblesPerSecond!: number;

    @ApiProperty()
    @IsNumber()
    bubblesClearToWin!: number;

    @ApiProperty()
    @IsNumber()
    bubblesCleared!: number;
}