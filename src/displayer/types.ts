export type Color = [number, number, number];

export type TextareaFormat = {
    color: Color;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    lineThrough: boolean;
};

export type FloatBarNode = (x: number, y: number, w: number, h: number,
    screenWidth: number, screenHeight: number) => React.ReactNode;

export type FloatBarButton = {
    readonly w: number;
    readonly h: number;
    readonly node: FloatBarNode;
};

export type ShowFloatBarMsgValue = {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    opcity?: number;
};