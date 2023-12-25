import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type RotateNodeEmtData = {
    workIds: IworkId[];
    angle: number;
    workState: EvevtWorkState;
};
export declare class RotateNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: RotateNodeEmtData): void;
}
