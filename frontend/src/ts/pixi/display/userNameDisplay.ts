import { PixiAnimation } from '../../_interface/pixi/pixiAnimation';
import { GameInstance } from '../../_interface/game/gameInstance';
import { Text } from 'pixi.js';
import { defaultFont } from '../data/allFonts';

export function getUsernameDisplay(instance: GameInstance): PixiAnimation {
    const nameContainer = instance.gameSubContainers.nameContainer;
    const nameText = new Text({
        text: instance.playerName,
        style: {
            fontFamily: defaultFont.name,
            fontSize: 16,
            fill: 'black',
        },
    });

    const display: PixiAnimation = {
        name: instance.playerName + '-username',
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            nameContainer.addChild(nameText);
            nameText.x = nameContainer.width / 2 - nameText.width / 2;
            nameText.y = nameContainer.height / 2 - nameText.height / 2;
        },
        renderFrame: function (): void {
            // console.log('render frame');
        },
        onEnd: function (): void {
            // console.log('end');
        },
        onCancel: function (): void {
            nameText.destroy();
        },
    };
    return display
}
