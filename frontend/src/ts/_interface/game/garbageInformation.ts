import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness";

export interface GarbageInformation {
    garbage: number[];
    isSmallerRow: boolean;
    garbageMessiness: GARBAGE_MESSINESS;
    pairLocations: number[];
}