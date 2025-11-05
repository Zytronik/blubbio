import { NETWORK_COMMAND } from '@/ts/_enum/networkCommand';
import { useSocketStore } from './socketStore';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';

export const useMultiplayerStore = defineStore('multiplayer', () => {
    function notifyEnemies(networkCommand: NETWORK_COMMAND): void {
        const socketStore = useSocketStore();
        if (socketStore.webSocket) {
            socketStore.webSocket.emit('gameCommand', { command: networkCommand });
        } else {
            console.error('WebSocket not initialized!');
        }
    }
    function listenToOtherPlayers(): void {
        const socketStore = useSocketStore();
        const webSocket = socketStore.webSocket;

        if (!webSocket) {
            console.error('WebSocket not initialized!');
            return;
        }

        webSocket.on('gameCommand', ({ command, username }) => {
            console.log('Received game command:', command, 'from', username);
            if (command === NETWORK_COMMAND.SHOOT) {
                useGameStore().pressedShoot(username);
            }
        });
    }
    return { notifyEnemies, listenToOtherPlayers };
});
