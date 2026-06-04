import { ApiProperty } from '@nestjs/swagger';

export class CreateSprintResponseDto {
    @ApiProperty()
    uid!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty()
    gameStartTime!: number;

    @ApiProperty()
    gameEndTime!: number;

    @ApiProperty()
    gameDuration!: number;

    @ApiProperty()
    bubblesShot!: number;

    @ApiProperty()
    bubblesPerSecond!: number;

    @ApiProperty()
    bubblesClearToWin!: number;

    @ApiProperty()
    bubblesCleared!: number;

    @ApiProperty()
    createdAt!: Date;
}