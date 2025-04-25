import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness";

export interface GarbageResult {
    garbage: number[];
    isSmallerRow: boolean;
    garbageMessiness: GARBAGE_MESSINESS;
    pairLocations: number[];
}