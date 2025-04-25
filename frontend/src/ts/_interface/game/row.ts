import { GARBAGE_MESSINESS } from '@/ts/_enum/garbageMessiness';
import { Field } from './field';

export interface Row {
    fields: Field[];
    size: number;
    isSmallerRow: boolean;
    isInDeathZone: boolean;
    garbageMessiness: GARBAGE_MESSINESS;
    pairLocations: number[];
}
