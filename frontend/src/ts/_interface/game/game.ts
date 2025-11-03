import { GAME_MODE } from '@/ts/_enum/gameMode';
import { INPUT_CONTEXT } from '@/ts/_enum/inputContext';
import { RoundData } from './roundData';
import { GameInstance } from './gameInstance';

export interface Game {
    gameMode: GAME_MODE;
    inputContext: INPUT_CONTEXT;
    spectating: boolean;
    spectatorTarget: string;
    rounds: RoundData[];
    instancesMap: Map<string, GameInstance>; //UserName
}
