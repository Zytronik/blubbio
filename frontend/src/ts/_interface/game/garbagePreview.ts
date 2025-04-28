import { GarbageInformation } from "./garbage";
import { PreviewRow } from "./previewRow";
import { Row } from "./row";

export interface GarbagePreview {
    incomingAmount: number,
    preview: PreviewRow,
    isPreviewRunning: boolean,
    previewBaseDuration: number,
    durationSpeedMultiplier: number,
    generatedGarbage: GarbageInformation[],
}