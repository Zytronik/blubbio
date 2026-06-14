import { GraphicsContext } from 'pixi.js';

export let cursorGraphicFrames: GraphicsContext[] = [];

export function buildFrames(): void {
    const TOTAL_FRAMES = 12;
    const handLength = 600;
    const baseWidth = 35;

    function mapValue(val: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return start2 + (stop2 - start2) * ((val - start1) / (stop1 - start1));
    }

    for (let f = 0; f < TOTAL_FRAMES; f++) {
        const context = new GraphicsContext();

        let progress = f / TOTAL_FRAMES;
        let currentOffset = progress * Math.PI * 2;


        for (let i = 0; i < 2; i++) {
            let scaleX = i === 1 ? -1 : 1;
            context.moveTo(0, 0);

            let step = 1;
            for (let y = 0; y >= -handLength; y -= step) {
                let taper = mapValue(y, 0, -handLength, 1, 0);
                let frequency = 0.04;
                let wave = Math.sin(y * -frequency - currentOffset * 2);

                let ridgeWidth = baseWidth * taper;
                let x = ridgeWidth + wave * 12 * taper;

                context.lineTo(x * scaleX, y);
            }
            context.lineTo(0, -handLength);
            for (let y = -handLength; y <= 0; y += step) {
                context.lineTo(0, y);
            }
            context.lineTo(0, 0);
        }
        
        context.fill(0x282c34);
        context.stroke({ width: 3, color: 0xd4af37, join: 'round' });

        cursorGraphicFrames.push(context);
    }
}
