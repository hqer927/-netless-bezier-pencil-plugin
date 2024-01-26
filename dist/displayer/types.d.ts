export type Color = [number, number, number];
export type ShowFloatBarMsgValue = {
    x: number;
    y: number;
    w: number;
    h: number;
    padding?: number;
    color?: string;
    translate?: [number, number];
    opacity?: number;
    nodeColor?: string;
    selectIds?: string[];
    canvasWidth?: number;
    canvasHeight?: number;
};
