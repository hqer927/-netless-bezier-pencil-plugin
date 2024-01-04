import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type TranslateNodeEmtData = {
    workIds: IworkId[];
    position: {
        x: number;
        y: number;
    };
    workState: EvevtWorkState;
};
export declare class TranslateNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    private oldRect;
    collect(data: TranslateNodeEmtData): void;
}
