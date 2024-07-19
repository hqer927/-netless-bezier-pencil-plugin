import { EmitEventType } from "../../../plugin/types";
import type { Point } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { ICameraOpt, IworkId } from "../../types";
import { BaseCollectorReducerAction } from "../../../collector/types";
export type CopyNodeEmtData = {
    workIds: IworkId[];
    viewId: string;
};
export declare class CopyNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType;
    collect(data: CopyNodeEmtData): void;
    copyText(param: {
        viewId: string;
        store: BaseCollectorReducerAction;
    }): {
        bgCenter?: [number, number];
        textCenter?: [number, number];
    } | undefined;
    pasteText(param: {
        viewId: string;
        scenePath: string;
        key: string;
        store: BaseCollectorReducerAction;
        bgCenter?: [number, number];
        textCenter?: [number, number];
        undoTickerId?: number;
    }): void;
    copySelector(param: {
        viewId: string;
        store: BaseCollectorReducerAction;
    }): {
        copyStores: Map<string, BaseCollectorReducerAction>;
        copyCoordInfo: {
            offset: Point;
            cameraOpt: Pick<ICameraOpt, 'centerX' | 'centerY' | 'scale'>;
        };
    } | undefined;
    pasteSelector(param: {
        viewId: string;
        scenePath: string;
        copyStores: Map<string, BaseCollectorReducerAction>;
        copyCoordInfo: {
            offset: Point;
            cameraOpt: Pick<ICameraOpt, 'centerX' | 'centerY' | 'scale'>;
        };
        undoTickerId?: number;
    }): void;
}
