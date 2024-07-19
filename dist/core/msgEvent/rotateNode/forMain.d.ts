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
    protected lastEmtData?: RotateNodeEmtData;
    readonly emitEventType: EmitEventType;
    private cacheOriginRotate;
    collect(data: RotateNodeEmtData, isSync?: boolean): void;
}
