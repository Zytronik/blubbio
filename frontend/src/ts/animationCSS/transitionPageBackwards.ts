import { getBackPage, setPage } from '../page/pageManager';
import { useSoundStore } from '@/stores/soundStore';
import { PAGE } from '../_enum/page';
import gsap from 'gsap';

export function transitionPageBackwardsAnimation(transitionToPage?: PAGE) {
  if (!transitionToPage) {
    const backPage = getBackPage();
    if (!backPage) {
      return;
    }
    transitionToPage = backPage;
  }
  useSoundStore().playSound('menu_back');

  const tl = gsap.timeline();
  tl.to('.sidebarWrapper', { duration: 0.4, marginLeft: '-150px' });
  tl.to('.pageContainer', { duration: 0.15, x: '100vw' });
  tl.set('.pageContainer', { x: '0vw' });
  tl.call(() => {
    setPage(transitionToPage);
  });
  tl.set('.sidebarWrapper', { marginLeft: '0px' });
  tl.set('.pageWrapper', { x: '-100vw' });
  tl.to('.pageWrapper', { duration: 0.15, x: '0vw' });
}
