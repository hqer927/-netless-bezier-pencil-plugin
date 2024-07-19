import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { ElayerType } from "../../enum";
export type ZIndexNodeEmtData = {
    workIds: IworkId[];
    layer: ElayerType;
    viewId: string;
};
export declare class ZIndexNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType;
    private zIndexMap;
    clearZIndex(viewId: string): void;
    getMinZIndex(viewId: string): number;
    getMaxZIndex(viewId: string): number;
    setMaxZIndex(max: number, viewId: string): void;
    setMinZIndex(min: number, viewId: string): void;
    addMaxLayer(viewId: string): void;
    addMinLayer(viewId: string): void;
    correct(data: Array<[string, number]>): Array<[string, number]>;
    collect(data: ZIndexNodeEmtData): void;
}
