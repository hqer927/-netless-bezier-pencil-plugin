import { EToolsKey } from "../enum";
export const isSealedGroup = (group) => {
    if (group.tagName === 'GROUP') {
        const sy = Object.getOwnPropertySymbols(group).find(s => s.toString() === ('Symbol(sealed)'));
        if (sy && group[sy]) {
            return true;
        }
    }
    return false;
};
export const isRenderNode = (toolsType) => {
    return toolsType !== EToolsKey.Text;
};
