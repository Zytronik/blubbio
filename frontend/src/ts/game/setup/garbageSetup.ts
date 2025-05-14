import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness"
import { GameSettings } from "@/ts/_interface/game/gameSettings"
import { GarbagePreview } from "@/ts/_interface/game/garbagePreview"
import { PreviewRow } from "@/ts/_interface/game/previewRow"
import { Row } from "@/ts/_interface/game/row"

export function getEmptyGarbagePreview(settings: GameSettings): GarbagePreview {
    const previewRow: PreviewRow = {
        bubbles: [],
        isSmallerRow: true,
    }
    return {
        incomingAmount: 0,
        preview: previewRow,
        isPreviewRunning: false,
        previewBaseDuration: settings.previewBaseDuration,
        durationSpeedMultiplier: 1,
        generatedGarbage: []
    }
}