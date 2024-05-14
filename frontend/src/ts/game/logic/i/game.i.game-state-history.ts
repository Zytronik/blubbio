import { GAME_INPUT } from "../../network/i/game.network.i.game-input";
import { Bubble } from "./game.i.bubble";

export interface GameStateHistory {
    inputHistory: InputFrame[],
    boardHistory: BoardHistoryFrame[],
    bubbleQueueHistory: BubbleQueueFrame[],
    angleHistory: AngleFrame[],
    sentgarbagehistory: GarbageFrame[],
    receivedgarbagehistory: GarbageFrame[],
}

export interface InputFrame {
    indexID: number,
    frameTime: number,
    input: GAME_INPUT,
    angle: number,
    garbageAmount: number,
}

interface BoardHistoryFrame {
    frameTime: number,
    boardState: string,
}

interface BubbleQueueFrame {
    frameTime: number,
    currentBubble: Bubble,
    heldBubble: Bubble,
    seedState: number,
}

interface AngleFrame {
    frameTime: number,
    angle: number,
}

interface GarbageFrame {
    frameTime: number,
    garbageAmount: number,
    seedState: number,
}