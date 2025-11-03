export function getLerpT(startMS: number, endMS: number, currentMS: number): number {
    const duration = endMS - startMS;
    const progress = currentMS - startMS;
    return progress / duration;
}
