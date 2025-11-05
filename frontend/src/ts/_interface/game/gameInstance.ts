import { Bubble } from './bubble';
import { GameStats } from './gameStats';
import { Grid } from './grid';
import { PixiAnimation } from '../pixi/pixiAnimation';
import { GameSettings } from './gameSettings';
import { HandlingSettings } from './handlingSettings';
import { GameSprites } from '../pixi/gameSprites';
import { rngReference } from './rngReference';
import { GarbagePreview } from './garbagePreview';
import { BubblePreview } from './bubblePreview';
import { GameSubContainers } from '../pixi/boardVisuals';

export interface GameInstance {
    playerName: string,
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
    gameSubContainers: GameSubContainers;
    instanceAnimations: Map<string, PixiAnimation>;
}
