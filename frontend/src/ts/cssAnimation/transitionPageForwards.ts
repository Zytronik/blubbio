import { setPage } from '../page/pageManager';
import { useSoundStore } from '@/stores/soundStore';
import { PAGE } from '../_enum/page';
import gsap from 'gsap';

export function transitionPageForwardsAnimation(transitionToPage: PAGE) {
  useSoundStore().playSound('menu_front');

  const tl = gsap.timeline();
  tl.to('.pageWrapper', { duration: 0.15, x: '-100vw' });
  tl.call(() => {
    setPage(transitionToPage);
  });
  tl.set('.pageWrapper', { x: '0vw' });
  tl.set('.sidebarWrapper', { marginLeft: '-150px' });
  tl.set('.pageContainer', { x: '100vw' });
  tl.to('.pageContainer', { duration: 0.15, x: '0vw' });
  tl.fromTo(
    '.sidebarWrapper',
    { marginLeft: '-150px' },
    { duration: 0.4, marginLeft: '0px' },
  );
}
