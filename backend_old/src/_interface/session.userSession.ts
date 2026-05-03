import { RankInfo } from './ranked.rank';

export interface UserSession {
  role: 'guest' | 'spectator' | 'user' | null;
  username: string;
  currentPage: string;
  clientId: string;
  isRanked: boolean;
  userId: number;
  email: string;
  countryCode?: string;
  country?: string;
  pbUrl?: string;
  bannerUrl?: string;
  LastDisconnectedAt: Date;
  rating: number;
  ratingDeviation: number;
  volatility: number;
  createdAt: Date;
  rank: RankInfo;
  globalRank: number;
  percentile: number;
  probablyAroundRank: RankInfo;
}
