import { Bubble } from "@/ts/_interface/game/bubble"


const red: Bubble = {
    type: 0,
    wallbounce: false,
    tint: "#ff0000"
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