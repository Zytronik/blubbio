import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { LayoutProperties } from '@/ts/_interface/pixi/layoutProperties';

export function calculateLayoutProperties(settings: GameSettings): LayoutProperties {
    const precisionWidth = settings.widthPrecisionUnits;
    const bubbleFullRadius = precisionWidth / (2 * settings.gridWidth);
    const precisionRowHeight = Math.floor(Math.sqrt(3 * bubbleFullRadius * bubbleFullRadius));
    const precisionHeight = precisionRowHeight * (settings.gridHeight + settings.gridExtraHeight);

    const calculatedProperties: LayoutProperties = {
        paddingBoardLeft: 1 / settings.gridWidth,
        paddingBoardRight: 1 / settings.gridWidth,
        paddingBoardTop: 1 / settings.gridHeight,
        precisionAspectRatio: precisionWidth / precisionHeight,
        maxHeightPercent: 0.8,
        multiLayoutGridPadding: 20,
        queuePreviewSize: settings.queuePreviewSize
    };

    return calculatedProperties;
}
