/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Node, Path } from "spritejs";
import { BaseNodeMapItem } from "../types";

export const isSealedGroup = (group: Group | Path | Node ) => {
	if (group.tagName === 'GROUP') {
        const sy = Object.getOwnPropertySymbols(group).find(s=>s.toString() === ('Symbol(sealed)'));
        if (sy && (group as any)[sy]) {
            return true;
        }
    }
    return false
}

export const isRenderNode = (param:Pick<BaseNodeMapItem,'isHid'>) => {
	return !param.isHid
}