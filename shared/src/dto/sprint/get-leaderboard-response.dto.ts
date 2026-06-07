import { ApiProperty } from "@nestjs/swagger";
import { LeaderboardEntryDto } from "./leaderboard-entry.dto";

export class GetLeaderboardResponseDto {
    @ApiProperty()
    entries!: LeaderboardEntryDto[];
}