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
    viewId: string;
};
export declare class TranslateNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: TranslateNodeEmtData;
    readonly emitEventType: EmitEventType;
    private undoTickerId?;
    private cachePosition;
    collect(data: TranslateNodeEmtData, isSync?: boolean): void;
}
