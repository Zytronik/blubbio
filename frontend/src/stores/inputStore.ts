import { INPUT_CONTEXT } from '@/ts/_enum/inputContext';
import { attachInputReader } from '@/ts/input/inputReader';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { useUserStore } from './userStore';
import { transitionPageBackwardsAnimation } from '@/ts/cssAnimation/transitionPageBackwards';
import { usePageStore } from './pageStore';
import { useMultiplayerStore } from './multiplayerStore';
import { NETWORK_COMMAND } from '@/ts/_enum/networkCommand';
import { allInputs } from '@/ts/input/allInputs';

export const useInputStore = defineStore('input', {
    state: () => ({
        hasAttached: false,
        context: INPUT_CONTEXT.MENU,
    }),
    actions: {
        setupInputReader(): void {
            if (!this.hasAttached) {
                this.hasAttached = true;
                attachInputReader();
            }
        },

        disableInput(): void {
            allInputs.forEach(input => {
                input.pressed = false;
            });
            this.context = INPUT_CONTEXT.DISABLED;
        },
        menuInputs(): void {
            allInputs.forEach(input => {
                input.pressed = false;
            });
            this.context = INPUT_CONTEXT.MENU;
        },
        gameWithResetInputs(): void {
            allInputs.forEach(input => {
                input.pressed = false;
            });
            this.context = INPUT_CONTEXT.GAME_WITH_RESET;
        },
        gameNoResetInputs(): void {
            allInputs.forEach(input => {
                input.pressed = false;
            });
            this.context = INPUT_CONTEXT.GAME_NO_RESET;
        },
        countdownInputs(): void {
            allInputs.forEach(input => {
                input.pressed = false;
            });
            this.context = INPUT_CONTEXT.COUNTDOWN;
        },

        leftPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().pressedLeft(localPlayer);
        },
        leftReleased(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().releasedLeft(localPlayer);
        },
        rightPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().pressedRight(localPlayer);
        },
        rightReleased(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().releasedRight(localPlayer);
        },
        changeApsPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().toggleAPS(localPlayer);
        },
        changeApsReleased(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().toggleAPS(localPlayer);
        },
        centerCursorPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().pressedCenter(localPlayer);
        },
        mirrorCursorPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().pressedMirror(localPlayer);
        },
        shootPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().pressedShoot(localPlayer);
            useMultiplayerStore().notifyEnemies(NETWORK_COMMAND.SHOOT);
        },
        holdPressed(): void {
            const localPlayer = useUserStore().getUserName();
            useGameStore().pressedHold(localPlayer);
        },
        resetPressed(): void {
            useGameStore().resetGame();
        },
        backPressed(): void {
            const localPlayer = useUserStore().getUserName();
            switch (this.context) {
                case INPUT_CONTEXT.MENU:
                    transitionPageBackwardsAnimation();
                    break;
                case INPUT_CONTEXT.GAME_WITH_RESET:
                    useGameStore().pressedBack(localPlayer);
                    break;
                case INPUT_CONTEXT.COUNTDOWN:
                    useGameStore().cancelGame();
                    break;
                default:
                    break;
            }
        },
        backReleased(): void {
            if (INPUT_CONTEXT.GAME_WITH_RESET) {
                const localPlayer = useUserStore().getUserName();
                useGameStore().releasedBack(localPlayer);
            }
        },
        channelPressed(): void {
            usePageStore().toggleCommunityOverlayAnimation();
        },

        DEBUG_getCurrentContext(): INPUT_CONTEXT {
          return this.context;
        }
    },
});
