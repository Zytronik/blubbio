import { ApiProperty } from '@nestjs/swagger';
import { Rank } from '../../types/ranked/rank.type';

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
  prevRank?: Rank;
  @ApiProperty()
  nextRank?: Rank;
  @ApiProperty()
  probablyAroundRank!: Rank;
  @ApiProperty()
  globalRank!: number;
  @ApiProperty()
  nationalRank!: number | null;
  @ApiProperty()
  percentile!: number;
}
