import { hideTopAndBottomBars, setPage } from '../page/pageManager';
import { useSoundStore } from '@/stores/soundStore';
import gsap from 'gsap';
import { PAGE } from '../_enum/page';
import { useGameStore } from '@/stores/gameStore';
import { GAME_MODE } from '../_enum/gameMode';
import { GameSettings } from '../_interface/game/gameSettings';
import { GARBAGE_MESSINESS } from '../_enum/garbageMessiness';
import { useSocketStore } from '@/stores/socketStore';
import { useLobbyStore } from '@/stores/lobbyStore';

export function transitionIntoGame(gameMode: GAME_MODE) {
    useSoundStore().playSound('menu_front');
    const gameStore = useGameStore();
    const main = document.querySelector('main') as HTMLElement;
    const overlay = document.createElement('div');

    const tl = gsap.timeline();

    tl.to('.pageWrapper', { duration: 0.15, x: '-100vw' });

    tl.set('.pageWrapper', { x: '0vw' });

    tl.call(() => {
        overlay.classList.add('gameTransitionOverlay');
        overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background:black;
    opacity: 1;
    z-index:9999;
  `;
        main.appendChild(overlay);

        setPage(PAGE.gamePage);
        hideTopAndBottomBars();
        if (gameMode === GAME_MODE.SPRINT) {
            useGameStore().setupSprint();
        } else if (gameMode === GAME_MODE.MULTI_PLAYER) {
            const gameSettings: GameSettings = {
                gridWidth: 8,
                gridHeight: 15,
                gridExtraHeight: 3,
                minAngle: 12,
                maxAngle: 168,
                queuePreviewSize: 5,
                widthPrecisionUnits: 10000000,
                collisionRangeFactor: 0.8,
                sprintVictoryCondition: 100,
                prefillBoard: true,
                prefillBoardAmount: 0,
                prefillMessiness: GARBAGE_MESSINESS.WORST,
                refillBoard: true,
                refillBoardAtLine: 6,
                refillMessiness: GARBAGE_MESSINESS.WORST,
                bubbleBagSize: 10,
                clearFloatingBubbles: false,
                garbageMaxAtOnce: 3,
                previewBaseDuration: 4000,
                countDownDuration: 1500,
            }

            const lobbyStore = useLobbyStore();

            const otherPlayersUsernames = lobbyStore.currentLobby?.users
                .filter(user => {
                    const socketStore = useSocketStore();
                    return user.socketId !== socketStore.webSocket?.id;
                })
                .map(user => user.username);

            gameStore.setupMultiplayer(gameSettings, otherPlayersUsernames || []);
        }

        gsap.fromTo(overlay, { opacity: 1 }, { duration: 1, opacity: 0, delay: 0.5 });
        setTimeout(() => {
            main.removeChild(overlay);
            gameStore.startGame();
        }, 1500);
    });
}
