import { GameInstance } from "../../logic/i/game.i.game-instance";

export interface dto_GameInstance {
    playerName: string;
    playerID: string;
    gameInstance: GameInstance;
}