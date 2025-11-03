export interface PixiAnimation {
    name: string,
    startMS: number,
    endMS: number,
    onStart: () => void,
    renderFrame: (currentTime: number) => void,
    onEnd: () => void,
    onCancel: () => void,
}