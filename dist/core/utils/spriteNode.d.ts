import { Group, Node, Path } from "spritejs";
import { BaseNodeMapItem } from "../types";
export declare const isSealedGroup: (group: Group | Path | Node) => boolean;
export declare const isRenderNode: (param: Pick<BaseNodeMapItem, 'isHid'>) => boolean;
