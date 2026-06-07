import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class LeaderboardEntryDto {
    @ApiProperty()
    @IsString()
    userId!: string;
    @ApiProperty()
    @IsString()
    username!: string;
    @ApiProperty()
    @IsNumber()
    bubblesPerSecond!: number;
    @ApiProperty()
    @IsNumber()
    gameDuration!: number;
    @IsNumber()
    @ApiProperty()
    rank!: number;
    @ApiProperty()
    @IsString()
    profilePicture!: string;
}