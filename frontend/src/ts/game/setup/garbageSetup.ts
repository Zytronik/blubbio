import { GameSettings } from "@/ts/_interface/game/gameSettings"
import { GarbagePreview } from "@/ts/_interface/game/garbagePreview"

export function getEmptyGarbagePreview(settings: GameSettings): GarbagePreview {
    return {
        isPreviewRunning: false,
        previewBaseDuration: settings.previewBaseDuration,
        durationSpeedMultiplier: 1,
        generatedGarbage: []
    }
}