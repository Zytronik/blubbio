import { usePixiStore } from "@/stores/pixiStore";
import { Graphics, RenderTexture, Sprite } from "pixi.js"

export function circleGraphicsAsSprite(graphic: Graphics): Sprite {
    const w = graphic.width;
    const h = graphic.height;
    graphic.x = w/2;
    graphic.y = h/2;
    const renderTexture = RenderTexture.create({ width: w, height: h });
    usePixiStore().getPixiApp().renderer.render(graphic, { renderTexture });
    return new Sprite(renderTexture);
}