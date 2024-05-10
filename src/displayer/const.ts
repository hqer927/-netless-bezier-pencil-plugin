import { SpeechBalloonPlacement } from "../plugin/types";

export declare type Margin = {
    readonly top: number;
    readonly bottom: number;
    readonly left: number;
    readonly right: number;
};

export const BarPadding: Margin = Object.freeze({
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
});

export const BarMargin: Margin = Object.freeze({
    top: 12,
    bottom: 24,
    left: 12,
    right: 12,
});

export const FontSizeList: readonly number[] = Object.freeze([
    12, 14, 18, 24, 36, 48, 64, 80, 144, 288,
]);

export const SpeechBalloonPlacements:SpeechBalloonPlacement[] = [
    "top", "topLeft", "topRight", 
    "bottom", "bottomLeft", "bottomRight", 
    "left", "leftTop", "leftBottom", 
    "right", "rightTop", "rightBottom"
];