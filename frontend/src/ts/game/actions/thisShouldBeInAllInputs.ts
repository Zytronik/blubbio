import { useGameStore } from "@/stores/gameStore";
import { useUserStore } from "@/stores/userStore";

export function leftDown(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedLeft(localPlayer);
}

export function leftUp(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().releasedLeft(localPlayer);
}

export function rightDown(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedRight(localPlayer);
}

export function rightUp(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().releasedRight(localPlayer);
}

export function toggleAPS(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().toggleAPS(localPlayer);
}

export function centerCursor(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedCenter(localPlayer);
}

export function mirrorAngle(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedMirror(localPlayer);
}

export function shoot(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedShoot(localPlayer);
}

export function hold(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedHold(localPlayer);
}

export function reset(): void {
    // const localPlayer = useUserStore().getUserName();
    // useGameStore().(localPlayer);
}

export function quit(): void {
    // const localPlayer = useUserStore().getUserName();
    // useGameStore().pressedShoot(localPlayer);
}