import { Rank } from "../_interface/rank";

export class GetUserRatingResponseDto {
    rating!: number;
    ratingDeviation!: number;
    volatility!: number;
    isRanked!: boolean;
    rank!: Rank;
    probablyAroundRank!: Rank;
    globalRank!: number;
    nationalRank!: number;
    percentile!: number;
}
