import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type SetColorNodeEmtData = {
    workIds: IworkId[];
    strokeColor?: string;
    fillColor?: string;
    fontColor?: string;
    fontBgColor?: string;
    workState: EvevtWorkState;
    viewId: string;
};
export declare class SetColorNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType;
    private undoTickerId?;
    private setTextColor;
    collect(data: SetColorNodeEmtData): void;
}
