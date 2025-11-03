import { hideTopAndBottomBars, setPage } from '../page/pageManager';
import { useSoundStore } from '@/stores/soundStore';
import gsap from 'gsap';
import { PAGE } from '../_enum/page';
import { useGameStore } from '@/stores/gameStore';

export function transitionIntoGame() {
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

        gsap.fromTo(overlay, { opacity: 1 }, { duration: 1, opacity: 0, delay: 0.5 });
        setTimeout(() => {
            main.removeChild(overlay);
            gameStore.startGame();
            console.log('transition end');
        }, 1500);
    });
}
