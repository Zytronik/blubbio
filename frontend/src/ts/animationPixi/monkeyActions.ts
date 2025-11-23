import { useGameStore } from '@/stores/gameStore';
import { GameInstance } from '../_interface/game/gameInstance';
import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { useAnimationStore } from '@/stores/animationStore';

export function addMonkeyActions(instance: GameInstance, monkeyName: string): void {
    const gameStore = useGameStore();
    const pressFrequency = 400; //press something every 400ms
    let lastPressedAt = 0;

    const doNothing = (): void => {
        123;
    };
    const left = (): void => gameStore.pressedLeft(monkeyName);
    const releasedLeft = (): void => gameStore.releasedLeft(monkeyName);
    const right = (): void => gameStore.pressedRight(monkeyName);
    const releasedRight = (): void => gameStore.releasedRight(monkeyName);
    const center = (): void => gameStore.pressedCenter(monkeyName);
    const mirror = (): void => gameStore.pressedMirror(monkeyName);
    const shoot = (): void => gameStore.pressedShoot(monkeyName);
    const hold = (): void => gameStore.pressedHold(monkeyName);

    // const actions: CallableFunction[] = [shoot];
    const actions: CallableFunction[] = [doNothing, left, releasedLeft, right, releasedRight, center, mirror, shoot, hold];

    const monkeyActions: PixiAnimation = {
        name: 'monkeyDo',
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            console.log('Monkey ', monkeyName, ' setting up.');
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
            console.log('Monkey ', monkeyName, ' shutting down.');
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    useAnimationStore().playInstanceAnimation(monkeyActions, instance);
}
