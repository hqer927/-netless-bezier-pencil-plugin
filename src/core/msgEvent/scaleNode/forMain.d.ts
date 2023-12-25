import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type ScaleNodeEmtData = {
    workIds: IworkId[];
    workState: EvevtWorkState;
    size: {
        width: number;
        height: number;
    };
};
export declare class ScaleNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: ScaleNodeEmtData): void;
}
