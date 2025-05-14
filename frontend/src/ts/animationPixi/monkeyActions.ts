import { useGameStore } from "@/stores/gameStore";
import { GameInstance } from "../_interface/game/gameInstance";
import { PixiAnimation } from "../_interface/pixi/pixiAnimation";

export function addMonkeyActions(instance: GameInstance, monkeyName: string): void {
    const gameStore = useGameStore();
    const pressFrequency = 400;         //press something every 400ms
    let lastPressedAt = 0;

    function doNothing(): void { 123; }
    function left(): void { gameStore.pressedLeft(monkeyName); }
    function releasedLeft(): void { gameStore.releasedLeft(monkeyName); }
    function right(): void { gameStore.pressedRight(monkeyName); }
    function releasedRight(): void { gameStore.releasedRight(monkeyName); }
    function center(): void { gameStore.pressedCenter(monkeyName); }
    function mirror(): void { gameStore.pressedMirror(monkeyName); }
    function shoot(): void { gameStore.pressedShoot(monkeyName); }
    function hold(): void { gameStore.pressedHold(monkeyName); }

    // const actions: CallableFunction[] = [shoot];
    const actions: CallableFunction[] = [doNothing, left, releasedLeft, right, releasedRight, center, mirror, shoot, hold];

    const monkeyActions: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            console.log("Monkey ", monkeyName, " setting up.");
        },
        renderFrame: function (currentTime: number): void {
            if (lastPressedAt + pressFrequency < currentTime) {
                lastPressedAt = currentTime;

                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                randomAction();
                // console.log("Monkey ", monkeyName, " did ", randomAction.name);
            }
        },
        onEnd: function (): void {
            console.log("Monkey ", monkeyName, " shutting down.");
        }
    }
    instance.instanceAnimations.push(monkeyActions);
}