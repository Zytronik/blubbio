import { NETWORK_COMMAND } from '@/ts/_enum/networkCommand';
import { useSocketStore } from './socketStore';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { GameCommandRequestDto } from '@/ts/_dto/game-command-request.dto';
import { GameCommandResponseDto } from '@/ts/_dto/game-command-response.dto';

export const useMultiplayerStore = defineStore('multiplayer', () => {
    function notifyEnemies(networkCommand: NETWORK_COMMAND): void {
        const socketStore = useSocketStore();

        if (!socketStore.webSocket) {
            console.error('WebSocket not initialized!');
            return;
        }

        const dto: GameCommandRequestDto = {
            command: networkCommand,
        };

        socketStore.webSocket.emit('gameCommand', dto);
    }

    function listenToOtherPlayers(): void {
        const socketStore = useSocketStore();
        const webSocket = socketStore.webSocket;

        if (!webSocket) {
            console.error('WebSocket not initialized!');
            return;
        }

        webSocket.on(
            'gameCommand',
            (dto: GameCommandResponseDto) => {
                console.log(
                    'Received game command:',
                    dto.command,
                    'from',
                    dto.username,
                );

                if (dto.command === NETWORK_COMMAND.SHOOT) {
                    useGameStore().pressedShoot(dto.username);
                }
            },
        );
    }

    return {
        notifyEnemies,
        listenToOtherPlayers,
    };
});