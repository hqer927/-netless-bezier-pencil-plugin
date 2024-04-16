import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { FontStyleType, FontWeightType } from "../../../component/textEditor";
export type SetFontEmtData = {
    workIds: IworkId[];
    bold?: FontWeightType;
    underline?: boolean;
    lineThrough?: boolean;
    italic?: FontStyleType;
    fontSize?: number;
    viewId: string;
};
export declare class SetFontStyleMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    private setTextStyle;
    collect(data: SetFontEmtData): void;
}
