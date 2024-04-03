import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
export type DeleteNodeEmtData = {
    workIds: IworkId[];
    viewId: string;
};
export declare class DeleteNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: DeleteNodeEmtData): void;
}
