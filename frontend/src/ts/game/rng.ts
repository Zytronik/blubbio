import { rngReference } from "../_interface/game/rngReference";

// min: 0, max: 5 => 0,1,2,3,4,5
export function XORRandom(min: number, max: number, seed: rngReference): number {
    min = Math.floor(min);
    max = Math.ceil(max) + 1;
    const random = (seed.value & 0x7FFFFFFF) / 0x80000000;
    nextSeed(seed);
    return Math.floor(random * (max - min)) + min;
}


function nextSeed(seed: rngReference): void {
    let nextSeed = seed.value;
    nextSeed ^= (nextSeed << 21);
    nextSeed ^= (nextSeed >>> 35);
    nextSeed ^= (nextSeed << 4);
    seed.value = nextSeed;
}