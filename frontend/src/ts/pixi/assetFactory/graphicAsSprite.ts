import { Graphics, Renderer, RenderTexture, Sprite } from "pixi.js"

export function circleGraphicsAsSprite(graphic: Graphics, renderer: Renderer): Sprite {
    const w = graphic.width;
    const h = graphic.height;
    graphic.x = w/2;
    graphic.y = h/2;
    const renderTexture = RenderTexture.create({ width: w, height: h });
    renderer.render(graphic, { renderTexture });
    return new Sprite(renderTexture);
}