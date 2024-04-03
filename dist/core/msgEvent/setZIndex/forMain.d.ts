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
    readonly emitEventType: EmitEventType;
    private min;
    private max;
    get minZIndex(): number;
    get maxZIndex(): number;
    set maxZIndex(max: number);
    set minZIndex(min: number);
    addMaxLayer(): void;
    addMinLayer(): void;
    collect(data: ZIndexNodeEmtData): void;
}
