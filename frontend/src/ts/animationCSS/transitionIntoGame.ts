import { setFullScreenGameView, setPage } from '../page/pageManager';
import { useSoundStore } from '@/stores/soundStore';
import gsap from 'gsap';
import { PAGE } from '../_enum/page';

export function transitionIntoGame() {
  useSoundStore().playSound('menu_front');

  const tl = gsap.timeline();

  tl.to('.pageWrapper', { duration: 0.15, x: '-100vw' });

  tl.call(() => {
    setPage(PAGE.gamePage);
    setFullScreenGameView();
  });

  tl.set('.pageWrapper', { x: '0vw' });

  tl.call(() => {
    const main = document.querySelector('main') as HTMLElement;
    const overlay = document.createElement('div');
    overlay.classList.add('gameTransitionOverlay');
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background:black;
    opacity:1;
    z-index:9999;
  `;
    main.appendChild(overlay);

    gsap.fromTo(overlay, { opacity: 1 }, { duration: 1, opacity: 0, delay: 0.5 });
    setTimeout(() => {
      main.removeChild(overlay);
    }, 1500);
  });

}
