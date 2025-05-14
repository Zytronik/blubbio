export interface PixiAnimation {
    startMS: number,
    endMS: number,
    onStart: () => void,
    renderFrame: (currentTime: number) => void,
    onEnd: () => void,
}