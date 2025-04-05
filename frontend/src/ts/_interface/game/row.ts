import { Field } from './field';

export interface Row {
    fields: Field[];
    size: number;
    isSmallerRow: boolean;
    isInDeathZone: boolean;
}
