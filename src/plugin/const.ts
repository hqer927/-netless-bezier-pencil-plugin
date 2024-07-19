import { ECanvasContextType } from "../core/enum";

declare let __NAME__: string, __VERSION__: string;
export const pkg_version = __VERSION__;
export const pkg_name = __NAME__;

export const Use_WorkSpace = typeof OffscreenCanvas === "function" ? 'worker' : 'mainThread';

if (typeof window !== "undefined") {
  let str = (window as { __netlessUA?: string }).__netlessUA || "";
  str += ` ${pkg_name}@${pkg_version}_${Use_WorkSpace}`;
  (window as { __netlessUA?: string }).__netlessUA = str;
}

export const DefaultAppliancePluginOptions = {
    syncOpt: {
        interval: 200,
    },
    canvasOpt: {
        contextType: ECanvasContextType.Canvas2d
    },
    cdn: {
        subWorkerUrl: "",
        fullWorkerUrl: "",
    },
    cursor:{
        expirationTime: 5000
    },
    bufferSize: {
        full: 20000,
        sub: 1000,
    }
}