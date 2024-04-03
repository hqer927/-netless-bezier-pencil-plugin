import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type ScaleNodeEmtData = {
    workIds: IworkId[];
    workState: EvevtWorkState;
    box: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    viewId: string;
};
export declare class ScaleNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    private undoTickerId?;
    collect(data: ScaleNodeEmtData): void;
}
