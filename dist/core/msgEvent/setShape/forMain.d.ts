import { EmitEventType, SpeechBalloonPlacement } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EToolsKey } from "../../enum";
export type SetShapeEmtData = {
    workIds: IworkId[];
    viewId: string;
    toolsType: EToolsKey;
    vertices?: number;
    innerVerticeStep?: number;
    innerRatio?: number;
    placement?: SpeechBalloonPlacement;
};
export declare class SetShapeOptMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: SetShapeEmtData): void;
}
