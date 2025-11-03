import { GameSettings } from "@/ts/_interface/game/gameSettings";
import { LayoutProperties } from "@/ts/_interface/pixi/layoutProperties";
import { Container } from "pixi.js";

export function calculateLayoutProperties(asdf1: Container, adsf2: Container, settings: GameSettings): LayoutProperties {
    const calculatedProperties: LayoutProperties = {
        paddingBoardLeft: 0,
        paddingBoardRight: 0,
        paddingBoardTop: 0,
        precisionAspectRatio: 0,
    }
    return calculatedProperties
}