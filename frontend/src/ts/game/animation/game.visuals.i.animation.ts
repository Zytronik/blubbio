export interface GameAnimation {
    duration: number,
    animationStart: number,
    play: (time: number) => void,
}