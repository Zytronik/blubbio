import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function renderArrowUpdate(instance: GameInstance): void {
  const arrow = instance.gameSprites.arrow;
  const arrowContainer = instance.gameContainers.arrowContainer;
  const gridBackground = instance.gameContainers.gridBackground;
  const arrowPrecisionCoords = instance.playGrid.launcherPrecisionPosition;
  const precisionWidth = instance.playGrid.precisionWidth;
  const precisionHeight = instance.playGrid.precisionHeight;

  const currentBubbleSprite = instance.gameSprites.currentBubble;
  const currentBubble = instance.currentBubble;

  const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
  const bubbleWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
  const bubbleHeight = bubbleWidth;

  const arrowAspectRatio = arrow.height / arrow.width;


  const animation: PixiAnimation = {
    startMS: 0,
    endMS: Infinity,
    onStart: function (): void {
      arrowContainer.x = (arrowPrecisionCoords.x / precisionWidth) * gridBackground.width;
      arrowContainer.y = (arrowPrecisionCoords.y / precisionHeight) * gridBackground.height;

      currentBubbleSprite.x = bubbleHeight / 2;
      currentBubbleSprite.y = 0;
    },
    renderFrame: function (currentTime: number): void {
      arrowContainer.angle = instance.angle;
      if (currentBubbleSprite) {
        currentBubbleSprite.visible = true;
        currentBubbleSprite.tint = currentBubble.tint;
      }

    },
    onEnd: function (): void {
      // console.log('end');
    },
  };
  animation.onStart();
  instance.instanceAnimations.push(animation);
}
