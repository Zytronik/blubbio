export interface dto_VersusScreen {
    player1Data: playerData;
    player2Data: playerData;
}

interface playerData {
    playerID: number;
    playerName: string;
    playerRank: number;
    playerGlicko: number;
}