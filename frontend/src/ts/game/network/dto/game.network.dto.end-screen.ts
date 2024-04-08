export interface dto_EndScreen {
    matchID: string;
    firstTo: number;
    player1Data: PlayerData;
    player2Data: PlayerData;
}

interface PlayerData {
    playerID: number;
    playerName: string;
    playerScore: number;
    hasWon: boolean;
    eloDiff: number;
}