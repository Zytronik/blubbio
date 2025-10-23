import { GarbageInformation } from "./garbageInformation";
import { PreviewRow } from "./previewRow";

export interface GarbagePreview {
    isPreviewRunning: boolean,
    previewBaseDuration: number,
    durationSpeedMultiplier: number,
    generatedGarbage: GarbageInformation[],
}