import { PixiAnimation } from '../_interface/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function addAngleUpdateAnimation(instance: GameInstance): void {
  const arrow = instance.gameSprites.arrow;
  const animation: PixiAnimation = {
    startMS: 0,
    endMS: Infinity,
    onStart: function (): void {
      // console.log('start');
    },
    renderFrame: function (currentTime: number): void {
      arrow.angle = instance.angle;
    },
    onEnd: function (): void {
      // console.log('end');
    },
  };
  instance.instanceAnimations.push(animation);
}
