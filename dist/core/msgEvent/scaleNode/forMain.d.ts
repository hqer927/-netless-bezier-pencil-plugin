import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IRectType, IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
import type { Direction } from "re-resizable/lib/resizer";
export type ScaleNodeEmtData = {
    workIds: IworkId[];
    workState: EvevtWorkState;
    box: IRectType;
    viewId: string;
    dir?: Direction;
    reverseY?: boolean;
    reverseX?: boolean;
};
export declare class ScaleNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: ScaleNodeEmtData;
    readonly emitEventType: EmitEventType;
    private targetBox;
    private targetText;
    private cacheTextInfo;
    private setTextStyle;
    collect(data: ScaleNodeEmtData, isSync?: boolean): Promise<void>;
}
