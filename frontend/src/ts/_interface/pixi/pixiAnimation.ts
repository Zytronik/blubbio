export interface PixiAnimation {
    context: string,
    name: string,
    startMS: number,
    endMS: number,
    onStart: () => void,
    renderFrame: (currentTime: number) => void,
    onEnd: () => void,
    cleanUp: () => void,
}