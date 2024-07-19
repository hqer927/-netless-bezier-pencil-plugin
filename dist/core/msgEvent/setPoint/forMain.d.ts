import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type SetPointEmtData = {
    workId: IworkId;
    workState: EvevtWorkState;
    pointMap: Map<string, [number, number][]>;
    viewId: string;
};
export declare class SetPointMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType;
    private undoTickerId?;
    collect(data: SetPointEmtData): void;
}
