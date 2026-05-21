import { defineStore } from "pinia";

export const useDebugStore = defineStore('debug', {
    actions: {
        killPlayer(userName: string): void {
            //todo
        },
        addMonkeyPlayer(): void {
            //todo
        },
        refreshLayout(): void {
            //todo
        },
        playAnimation(): void {
            //todo
        },
        queueGarbage(): void {
            //todo
        },
    }
}



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