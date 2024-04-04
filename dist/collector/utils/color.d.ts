/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @param   Number  r       红色色值
 * @param   Number  g       绿色色值
 * @param   Number  b       蓝色色值
 * @return  Array           HSL各值数组
 */
export declare function rgbToHsl(r: number, g: number, b: number): number[];
/**
 * HSL颜色值转换为RGB.
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @param   Number  h       色相
 * @param   Number  s       饱和度
 * @param   Number  l       亮度
 * @return  Array           RGB色值数值
 */
export declare function hslToRgb(h: number, s: number, l: number): number[];
export declare function rgbToHex(r: number, g: number, b: number): string;
/** 十六进制转rgba */
export declare function hexToRgba(hex: string, opacity?: number): string;
export declare function rgbToRgba(r: number, g: number, b: number, opacity?: number): string;
export declare function colorRGBA2Hex(color: string): [string, number];
export declare function colorRGBA2Array(color: string): [number, number, number, number];
