import { useSoundStore } from '@/stores/soundStore';
import { usePageStore } from '@/stores/pageStore';
import gsap from 'gsap';
import { nextTick } from 'vue';

export function openCommunityOverlay() {
  useSoundStore().playSound('menu_front');
  usePageStore().showCommunityOverlay();

  nextTick(() => {
    const tl = gsap.timeline();
    tl.fromTo('.community', { y: '100vh' }, { duration: 0.15, y: '0vh' });
  });
}
