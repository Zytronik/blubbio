export interface GameEvents {
    onGameStart: () => void,
    onGameQuit: () => void,
    onGameReset: () => void,
    onGameDefeat: () => void,
    onGameVictory: () => void,
    onGarbageSend: (amount: number) => void,
}