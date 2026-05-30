import { debugChannel } from "@/ts/network/debugChannel";
import { defineStore } from "pinia";

export const useDebugStore = defineStore('debug', {
    state: () => ({
        debugWindow: null as Window | null,
    }),
    actions: {
        initDebugChannel() {
            debugChannel.onmessage = (event) => {
                const { action, payload } = event.data;

                switch (action) {
                    case "refreshLayout":
                        this.refreshLayout();
                        break;
                    case "killPlayer":
                        this.killPlayer(payload);
                        break;
                    case "addMonkeyPlayer":
                        this.addMonkeyPlayer();
                        break;
                    case "playAnimation":
                        this.playAnimation();
                        break;
                    case "queueGarbage":
                        this.queueGarbage();
                        break;
                }
            };
        },
        destroyDebugChannel() {
            debugChannel.close();
        },
        send(action: string, payload?: any) { // TODO create type for actions and payloads !!!!!!!!!!!
            debugChannel.postMessage({ action, payload });
        },
        openDebugWindow(width = 1200, height = 600): void {
            console.log('Opening debug window');
            if (this.debugWindow && !this.debugWindow.closed) {
                this.debugWindow.focus();
                return;
            }

            this.debugWindow = window.open(
                "/debug",
                "debugWindow",
                `width=${width},height=${height},resizable=yes,scrollbars=yes`
            );

            //TODO broadcast when closed
            if (this.debugWindow) {
                const checkClosed = setInterval(() => {
                    if (!this.debugWindow || this.debugWindow.closed) {
                        this.debugWindow = null;
                        console.log('Debug window closed');
                        clearInterval(checkClosed);
                    }
                }, 1000);
            }
        },
        closeDebugWindow(): void {
            if (this.debugWindow && !this.debugWindow.closed) {
                this.debugWindow.close();
            }

            this.debugWindow = null;
        },
        killPlayer(userName: string): void {
            //todo
            console.log(`Killing player ${userName}`);
        },
        addMonkeyPlayer(): void {
            //todo
            console.log('Adding monkey player');
        },
        refreshLayout(): void {
            //todo
            console.log('Refreshing layout');
        },
        playAnimation(): void {
            //todo
            console.log('Playing animation');
        },
        queueGarbage(): void {
            //todo
            console.log('Queueing garbage');
        },
    }
});

// export const pixiDebug1: Input = {
//     name: 'debug1',
//     description: 'asdf',
//     customKeyMap: ['Numpad1', 'KeyI', ''],
//     defaultKeyCode: 'Numpad1',
//     isSingleTriggerAction: true,
//     pressed: false,
//     fire: () => {
//         console.log('pressed debug 1');
//         // useGameStore().setupSprint();
//         useGameStore().createMonkeyTesting(5);
//     },
//     inputContext: [INPUT_CONTEXT.DEBUG],
// };
// export const pixiDebug2: Input = {
//     name: 'debug2',
//     description: 'asdf',
//     customKeyMap: ['Numpad2', 'KeyO', ''],
//     defaultKeyCode: 'Numpad2',
//     isSingleTriggerAction: true,
//     pressed: false,
//     fire: () => {
//         console.log('pressed debug 2');
//         useGameStore().startGame();
//     },
//     inputContext: [INPUT_CONTEXT.DEBUG],
// };
// export const pixiDebug3: Input = {
//     name: 'debug3',
//     description: 'asdf',
//     customKeyMap: ['Numpad3', 'KeyP', ''],
//     defaultKeyCode: 'Numpad3',
//     isSingleTriggerAction: true,
//     pressed: false,
//     fire: () => {
//         console.log('pressed debug 3');
//         useGameStore().refreshLayout();
//     },
//     inputContext: [INPUT_CONTEXT.DEBUG],
// };
// export const pixiDebug4: Input = {
//     name: 'debug4',
//     description: 'asdf',
//     customKeyMap: ['Numpad4', 'KeyF', ''],
//     defaultKeyCode: 'Numpad4',
//     isSingleTriggerAction: true,
//     pressed: false,
//     fire: () => {
//         console.log('pressed debug 4');
//         // renderCountdown(() => {true});
//         useContainerStore().cleanUpGameContainer();
//     },
//     inputContext: [INPUT_CONTEXT.DEBUG],
// };
// export const pixiDebug5: Input = {
//     name: 'debug5',
//     description: 'asdf',
//     customKeyMap: ['Numpad5', '', ''],
//     defaultKeyCode: 'Numpad5',
//     isSingleTriggerAction: true,
//     pressed: false,
//     fire: () => {
//         console.log('pressed debug 5');
//         useGameStore().debugLogGameField();
//     },
//     inputContext: [INPUT_CONTEXT.DEBUG],
// };
// export const pixiDebug6: Input = {
//     name: 'debug6',
//     description: 'asdf',
//     customKeyMap: ['Numpad6', '', ''],
//     defaultKeyCode: 'Numpad6',
//     isSingleTriggerAction: true,
//     pressed: false,
//     fire: () => {
//         console.log('pressed debug 6');
//         useGameStore().addGarbageToAllInstances();
//     },
//     inputContext: [INPUT_CONTEXT.DEBUG],
// };