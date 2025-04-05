import { Field } from "../_interface/game/field";
import { GameInstance } from "../_interface/game/gameInstance";
import { Row } from "../_interface/game/row";
import { PixiAnimation } from "../_interface/pixiAnimation";

export function bubbleShotAnimation(instance: GameInstance): void {
    const now = performance.now()
    const travelTime = instance.handlingSettings.bubbleTravelDurationMS;
    const animation: PixiAnimation = {
        startMS: now,
        endMS: now + travelTime,
        onStart: function (): void {
            console.log("start");
        },
        renderFrame: function (currentTime: number): void {
            const rows: Row[] = instance.playGrid.rows;
            rows.forEach(row => {
                const fields: Field[] = row.fields;
                fields.forEach(field => {
                    if (field.bubble) {

                    }
                });
            });
        },
        onEnd: function (): void {
            console.log("end");
        }
    }
    instance.instanceAnimations.push(animation);
}