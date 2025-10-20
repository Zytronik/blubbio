import { GarbageInformation } from "./garbageInformation";
import { PreviewRow } from "./previewRow";

export interface GarbagePreview {
    preview: PreviewRow,
    isPreviewRunning: boolean,
    previewBaseDuration: number,
    durationSpeedMultiplier: number,
    generatedGarbage: GarbageInformation[],
}