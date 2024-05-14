import { Field } from "./game.i.field";

export interface Row {
    fields: Field[],
    size: number,
    isSmallerRow: boolean,
    isInDeathZone: boolean,
}