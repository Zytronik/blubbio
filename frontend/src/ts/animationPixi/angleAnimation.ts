import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function renderAngleUpdate(instance: GameInstance): void {
  const arrow = instance.gameSprites.arrow;
  const gridBackground = instance.gameContainers.gridBackground;
  const arrowPrecisionCoords = instance.playGrid.launcherPrecisionPosition;
  const precisionWidth = instance.playGrid.precisionWidth;
  const precisionHeight = instance.playGrid.precisionHeight;

  const animation: PixiAnimation = {
    startMS: 0,
    endMS: Infinity,
    onStart: function (): void {
      arrow.x = (arrowPrecisionCoords.x / precisionWidth) * gridBackground.width;
      arrow.y = (arrowPrecisionCoords.y / precisionHeight) * gridBackground.height;
    },
    renderFrame: function (currentTime: number): void {
      arrow.angle = instance.angle;
    },
    onEnd: function (): void {
      // console.log('end');
    },
  };
  animation.onStart();
  instance.instanceAnimations.push(animation);
}
