import { ApiProperty } from '@nestjs/swagger';
import type { Rank } from 'src/ranked/types/rank.type';

export class GetUserRatingResponseDto {
  @ApiProperty()
  rating!: number;
  @ApiProperty()
  ratingDeviation!: number;
  @ApiProperty()
  volatility!: number;
  @ApiProperty()
  isRanked!: boolean;
  @ApiProperty()
  rank!: Rank;
  @ApiProperty()
  probablyAroundRank!: Rank;
  @ApiProperty()
  globalRank!: number;
  @ApiProperty()
  nationalRank!: number;
  @ApiProperty()
  percentile!: number;
}
