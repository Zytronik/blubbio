import { showTopAndBottomBars, setPage } from '../page/pageManager';
import { useSoundStore } from '@/stores/soundStore';
import gsap from 'gsap';
import { PAGE } from '../_enum/page';
import { GAME_MODE } from '../_enum/gameMode';
import { useContainerStore } from '@/stores/containerStore';

export function transitionOutOfGame(gameMode: GAME_MODE) {
    useSoundStore().playSound('menu_back');
    const main = document.querySelector('main') as HTMLElement;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background:black;
    opacity: 0;
    z-index:9999;
    `;
    overlay.classList.add('gameTransitionOverlay');
    main.appendChild(overlay);

    const tl = gsap.timeline();

    tl.set(".gameTransitionOverlay", { x: '-100vw', opacity: 1 }, 0);
    tl.to('#pixiCanvas', { duration: 5, x: '100vw' }, 0);
    tl.to(".gameTransitionOverlay", { duration: 5, x: '0' }, 0);
    tl.set('#pixiCanvas', { x: '0vw' });
    tl.call(() => {
        useContainerStore().hideGame();
        showTopAndBottomBars();
        if (gameMode === GAME_MODE.SPRINT) {
            setPage(PAGE.sprintPage);
        } else if (gameMode === GAME_MODE.MULTI_PLAYER) {
            setPage(PAGE.roomPage);
        }
    });
    tl.to(".gameTransitionOverlay", { duration: 0.5, opacity: 0, delay: 0.2 });
    tl.call(() => {
        main.removeChild(overlay);
    });
}
