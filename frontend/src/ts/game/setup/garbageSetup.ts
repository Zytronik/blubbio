import { GameSettings } from "@/ts/_interface/game/gameSettings"
import { GarbagePreview } from "@/ts/_interface/game/garbagePreview"
import { PreviewRow } from "@/ts/_interface/game/previewRow"

export function getEmptyGarbagePreview(settings: GameSettings): GarbagePreview {
    const previewRow: PreviewRow = {
        bubbles: [],
        isSmallerRow: true,
    }
    return {
        preview: previewRow,
        isPreviewRunning: false,
        previewBaseDuration: settings.previewBaseDuration,
        durationSpeedMultiplier: 1,
        generatedGarbage: []
    }
}