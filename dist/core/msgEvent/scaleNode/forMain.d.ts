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
};
export declare class ScaleNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    private undoTickerId?;
    private targetBox;
    private targetText;
    private cacheTextInfo;
    collect(data: ScaleNodeEmtData): Promise<void>;
}
