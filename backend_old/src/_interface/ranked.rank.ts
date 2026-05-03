export interface RankInfo {
  ascii: string;
  name: string;
  iconName: string;
  percentile: number;
  prevRank?: Rank;
  nextRank?: Rank;
}

export interface Rank {
  ascii: string;
  percentile: number;
  name: string;
  iconName: string;
}

export interface Ratings {
  rating: number;
  ratingDeviation: number;
  volatility: number;
}
