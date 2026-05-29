import { GlickoPlayer } from './glicko-player.type';

export type Glicko2Constructor = new (config: unknown) => {
  makePlayer(r: number, rd: number, vol: number): GlickoPlayer;
  updateRatings(matches: [GlickoPlayer, GlickoPlayer, number][]): void;
  predict(p1: GlickoPlayer, p2: GlickoPlayer): number;
};
