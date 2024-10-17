import { PAGE } from '../_constant/pages';
import { setPage } from '../page/pageManager';
import { AnimationSequence } from './animationSequence';
import { AnimationConfig } from '../_interface/animationConfig';
import { useSoundStore } from '@/stores/soundStore';

export function transitionPageBackwardsAnimation(transitionToPage: PAGE) {
  useSoundStore().playSound('menu_back');
  const animations: AnimationConfig[] = [
    {
      selector: '.sidebar',
      className: 'transitionPageBackwards-sideBar-slideOutToLeft',
      duration: 400,
    },
    {
      selector: '.sidebar',
      addProperty: true,
      propertyName: 'margin-left',
      value: '-150px',
    },
    {
      selector: '.pageContainer',
      className: 'transitionPageBackwards-pageContainer-slideOutFromLeft',
      duration: 150,
      onEnd: () => {
        setPage(transitionToPage);
      },
    },
    {
      selector: '.sidebar',
      removeProperty: true,
      propertyName: 'margin-left',
    },
    {
      selector: '.pageWrapper',
      className: 'transitionPageBackwards-pageWrapper-slideInFromLeft',
      duration: 150,
    },
  ];

  const animationSequence = new AnimationSequence(animations);
  animationSequence.play();
}
