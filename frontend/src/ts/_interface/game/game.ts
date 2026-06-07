import { GAME_MODE } from '@/ts/_enum/gameMode';
import { RoundData } from './roundData';
import { GameInstance } from './gameInstance';

export interface Game {
    gameMode: GAME_MODE;
    spectating: boolean;
    spectatorTarget: string;
    rounds: RoundData[];
    instancesMap: Map<string, GameInstance>; //UserName
}
