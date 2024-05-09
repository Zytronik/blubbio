import { GameStats } from "./game.i.game-stats";

export interface PlayerData {
    playerID: number;
    playerName: string;
    playerRank: string;
    playerGlobalRank: number;
    playerNationalRank: number;
    playerGlicko: number;
    playerRD: number;
    playerProfilePicture: string;
    playerCountry: string;
    playerScore: number;
    hasWon: boolean;
    eloDiff: number;
    playerStats: GameStats[];
}