import { useSoundStore } from '@/stores/soundStore';
import { usePageStore } from '@/stores/pageStore';
import gsap from 'gsap';

export function closeCommunityOverlay() {
  useSoundStore().playSound('menu_back');

  const tl = gsap.timeline();
  tl.fromTo('.community', { y: '0vh' }, { duration: 0.15, y: '100vh' });
  tl.call(() => {
    usePageStore().hideCommunityOverlay();
  });
}
