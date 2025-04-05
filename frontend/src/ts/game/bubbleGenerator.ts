import { Bubble } from "../_interface/game/bubble";

function getBubbleBag(): Bubble[] {
    // const bagSize = gameInstance.gameSettings.bubbleBagSize;
    const bag: Bubble[] = [];
    // const leftOverBubbles = [...allBubbles];
    // while (bag.length < bagSize) {
    //     if (leftOverBubbles.length === 0) {
    //         leftOverBubbles.push(...allBubbles);
    //     }
    //     const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.bubbleSeed);
    //     gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
    //     bag.push(leftOverBubbles.splice(randomIndex, 1)[0]);
    // }
    return bag;
}

const red: Bubble = {
    type: 0,
    wallbounce: false,
    tint: "#FF0000"
}
const orange: Bubble = {
    type: 1,
    wallbounce: false,
    tint: "#ffa600"
}
const yellow: Bubble = {
    type: 2,
    wallbounce: false,
    tint: "#ffff00"
}
const green: Bubble = {
    type: 3,
    wallbounce: false,
    tint: "#00ff00"
}
const cyan: Bubble = {
    type: 4,
    wallbounce: false,
    tint: "#00ffff"
}
const purple: Bubble = {
    type: 5,
    wallbounce: false,
    tint: "#0000ff"
}
const white: Bubble = {
    type: 6,
    wallbounce: false,
    tint: "#ff00ff"
}
export const allBubbles: Bubble[] = [
    red,
    orange,
    yellow,
    green,
    cyan,
    purple,
    white,
]

/*
Color Themes:

https://coolors.co/530e58-455ba6-a2ea6f-f6cd29-ea5151-fff3fe-6adaca
https://ivomynttinen.com/content/3-blog/20150928-ios-design-guidelines/ios-color-theme.jpg

*/