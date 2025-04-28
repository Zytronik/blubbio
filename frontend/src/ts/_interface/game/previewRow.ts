import { Bubble } from "./bubble"

export interface PreviewRow {
    bubbles: Bubble[],
    extraBubble?: Bubble,
    isSmallerRow: boolean,
    
}