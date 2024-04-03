import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type RotateNodeEmtData = {
    workIds: IworkId[];
    angle: number;
    workState: EvevtWorkState;
    viewId: string;
};
export declare class RotateNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    private undoTickerId?;
    private cacheOriginRotate;
    collect(data: RotateNodeEmtData): void;
}
