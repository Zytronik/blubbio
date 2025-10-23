import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { bubbleTexture } from '@/ts/pixi/allTextures';
import { defineStore } from 'pinia';
import { Container, Sprite } from 'pixi.js';

export const useSpriteStore = defineStore('sprite', () => {
    function getBubbleSprite(): Container {
        const container = new Container();
        const sprite = new Sprite(bubbleTexture.texture);
        container.addChild(sprite);
        return container;
    }
    return { getBubbleSprite };
}); 
