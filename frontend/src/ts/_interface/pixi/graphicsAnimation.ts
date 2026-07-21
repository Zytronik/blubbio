import { Graphics, GraphicsContext } from "pixi.js";

export interface GraphicsAnimation {
    duration: number,
    container: Graphics,
    frames: GraphicsContext[],
}


/*
a graphics animation should
be able to be get a frame by t with an animation curve
animation curve is probably something i need anyway (globally)
what do i do with overshooting t? bouncy animation curves can get t>1
where does t come from?
*/