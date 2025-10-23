import { Bubble } from './bubble';
import { GameStats } from './gameStats';
import { Grid } from './grid';
import { PixiAnimation } from '../pixi/pixiAnimation';
import { GameSettings } from './gameSettings';
import { HandlingSettings } from './handlingSettings';
import { GameSprites } from '../pixi/gameSprites';
import { rngReference } from './rngReference';
import { GarbagePreview } from './garbagePreview';
import { BoardVisuals } from '@/ts/pixi/container';
import { BubblePreview } from './bubblePreview';

export interface GameInstance {
    gameSettings: GameSettings;
    handlingSettings: HandlingSettings;
    bubbleSeed: rngReference;
    garbageSeed: rngReference;
    angle: number;
    currentBubble: Bubble;
    bubblePreview: BubblePreview;
    holdBubble?: Bubble;
    bubbleQueue: Bubble[];
    playGrid: Grid;
    garbagePreview: GarbagePreview;
    stats: GameStats;
    //replaydata

    left: boolean;
    right: boolean;
    aps: number;

    gameSprites: GameSprites;
    gameContainers: BoardVisuals;
    instanceAnimations: PixiAnimation[];
}
