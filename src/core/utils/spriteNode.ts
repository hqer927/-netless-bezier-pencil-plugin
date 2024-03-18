/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Node, Path } from "spritejs"
import { EToolsKey } from "../enum";

export const isSealedGroup = (group: Group | Path | Node ) => {
	if (group.tagName === 'GROUP') {
        const sy = Object.getOwnPropertySymbols(group).find(s=>s.toString() === ('Symbol(sealed)'));
        if (sy && (group as any)[sy]) {
            return true;
        }
    }
    return false
}

export const isRenderNode = (toolsType:EToolsKey) => {
	return toolsType !== EToolsKey.Text
}