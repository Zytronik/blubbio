export enum GARBAGE_MESSINESS {
    COPY_CLEAN = "COPY_CLEAN", //same colors as row underneath
    CLEAN = "CLEAN",
    REGULAR = "REGULAR",
    BAD = "BAD",
    WORST = "WORST"
}

export type GarbageStats = {
    colors: number;
    pairs: number;
};

//Note the garbage algorithm prioritizes no triplets over the amount of pairs
export const GARBAGE_STATS: Record<GARBAGE_MESSINESS, GarbageStats> = {
    [GARBAGE_MESSINESS.COPY_CLEAN]: { colors: 4, pairs: 3 },
    [GARBAGE_MESSINESS.CLEAN]: { colors: 4, pairs: 3 },
    [GARBAGE_MESSINESS.REGULAR]: { colors: 5, pairs: 1 },
    [GARBAGE_MESSINESS.BAD]: { colors: 5, pairs: 0 },
    [GARBAGE_MESSINESS.WORST]: { colors: 7, pairs: 0 },
};