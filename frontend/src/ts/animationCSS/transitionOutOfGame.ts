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

    const tl = gsap.timeline();

    tl.to('.pageWrapper', { duration: 0.15, x: '100vw' });

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
        showTopAndBottomBars();

        if (gameMode === GAME_MODE.SPRINT) {
            setPage(PAGE.sprintPage);
        } else if (gameMode === GAME_MODE.MULTI_PLAYER) {
            setPage(PAGE.roomPage);
        }

        gsap.fromTo(overlay, { opacity: 1 }, { duration: 1, opacity: 0, delay: 0.5 });
        setTimeout(() => {
            useContainerStore().hideGame();
            main.removeChild(overlay);
        }, 1500);
    });
}
