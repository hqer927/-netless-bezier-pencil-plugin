import { Group, Scene } from "spritejs";
import { BaseNodeMapItem, IRectType } from "../types";
export declare class VNodeManager {
    viewId: string;
    scene: Scene;
    scenePath?: string;
    drawLayer?: Group;
    fullLayer?: Group;
    curNodeMap: Map<string, BaseNodeMapItem>;
    targetNodeMap: Map<string, BaseNodeMapItem>[];
    constructor(viewId: string, scene: Scene);
    init(fullLayer: Group, drawLayer?: Group): void;
    get(name: string): BaseNodeMapItem | undefined;
    hasRenderNodes(): boolean;
    has(name: string): void;
    setInfo(name: string, info: Partial<BaseNodeMapItem>): void;
    delete(name: string): void;
    clear(): void;
    getRectIntersectRange(rect: IRectType): {
        rectRange: IRectType | undefined;
        nodeRange: Map<string, BaseNodeMapItem>;
    };
    getNodeRectFormShape(name: string, value: BaseNodeMapItem): IRectType | undefined;
    updateNodesRect(): void;
    combineIntersectRect(rect: IRectType): IRectType;
    setTarget(): number;
    getLastTarget(): Map<string, BaseNodeMapItem>;
    deleteLastTarget(): void;
    getTarget(i: number): Map<string, BaseNodeMapItem>;
    deleteTarget(i: number): void;
}
