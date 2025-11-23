import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';
import { useAnimationStore } from '@/stores/animationStore';
import { Text } from 'pixi.js';
import { defaultFont } from '../pixi/data/allFonts';

export function statsAnimation(instance: GameInstance): void {
    const statsContainer = instance.gameSubContainers.statsContainer;
    const timerLabel = new Text({
        text: "TIME",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 12,
            fill: 'black',
        },
    });
    const timerText = new Text({
        text: "00:00.00",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 16,
            fill: 'black',
        },
    });
    const bpsLabel = new Text({
        text: "BPS",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 12,
            fill: 'black',
        },
    });
    const bpsText = new Text({
        text: "2.00/S",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 16,
            fill: 'black',
        },
    });

    const apmLabel = new Text({
        text: "APM",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 12,
            fill: 'black',
        },
    });
    const apmText = new Text({
        text: "420.69/M",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 16,
            fill: 'black',
        },
    });

    const statOffset = 15;
    const labelOffset = 2;

    function placeStat(label: Text, value: Text, bottomY: number, containerWidth: number) {
        value.y = bottomY - value.height;
        value.x = containerWidth - value.width;

        label.y = value.y - label.height - labelOffset;
        label.x = containerWidth - label.width;

        return label.y; // gibt die neue obere Grenze zurück
    }

    const animation: PixiAnimation = {
        name: 'statsAnimation',
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            statsContainer.addChild(bpsLabel, bpsText, apmLabel, apmText, timerLabel, timerText);

            let y = statsContainer.height;

            y = placeStat(timerLabel, timerText, y, statsContainer.width) - statOffset;
            y = placeStat(bpsLabel, bpsText, y, statsContainer.width) - statOffset;
            y = placeStat(apmLabel, apmText, y, statsContainer.width);
        },

        renderFrame: function (): void {
            // console.log('render frame');
        },
        onEnd: function (): void {
            // console.log('end');
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    useAnimationStore().playInstanceAnimation(animation, instance);
}
