/* eslint-disable @typescript-eslint/no-explicit-any */
import { compress, decompress, compressToUint8Array, decompressFromUint8Array } from 'lz-string';

export function transformToNormalData(str: string) {
    return JSON.parse(decompress(str));  
}
export function transformToSerializableData(data: unknown): string {
    return compress(JSON.stringify(data));
}
export function normalDataToUint8Array(data: unknown): Uint8Array {
    return compressToUint8Array(JSON.stringify(data));
}
export function uint8ArrayToNormalData(data: Uint8Array): unknown {
    return JSON.parse(decompressFromUint8Array(data)); 
}
export const plainObjectKeys = Object.keys as <T>(
    o: T
  ) => Array<Extract<keyof T, string>>;

// export function isEqual(a: any, b: any): boolean {
//     if (a === b) return true;
//     if (Array.isArray(a)) return a.every((x, i) => isEqual(x, b[i]));
//     for (const value in Object.values(a)) {
        
//     }
//     // return false;
// }