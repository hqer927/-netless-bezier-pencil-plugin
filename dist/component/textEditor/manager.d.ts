import { TextEditorInfo, TextOptions } from "./types";
import { BaseSubWorkModuleProps } from "../../plugin/types";
import { ICameraOpt, IWorkerMessage } from "../../core";
import type EventEmitter2 from "eventemitter2";
import { BaseTeachingAidsManager } from "../../plugin/baseTeachingAidsManager";
export interface TextEditorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    undoTickerId?: number;
    /** 通过view组建中更新文本 */
    updateForViewEdited(activeId?: string, info?: TextEditorInfo): void;
    /** 过滤文本编辑器 */
    filterEditor(viewId: string): Map<string, TextEditorInfo>;
    /** 通过点计算获焦的文本 */
    computeTextActive(point: [number, number], viewId: string): void;
    /** 校验是否删除空文本或事失焦 */
    checkEmptyTextBlur(): void;
    /** 激活文本编辑组件 */
    active(workId: string): void;
    /** 不激活文本编辑组件 */
    unActive(): void;
    /** 创建文本来源于main */
    createTextForMasterController(params: TextEditorInfo & {
        workId: string;
        x: number;
        y: number;
        opt: TextOptions;
        viewId: string;
    }, undoTickerId?: number): void;
    /** 修改文本来源于main */
    updateTextForMasterController(params: Partial<TextEditorInfo> & {
        workId: string;
        viewId: string;
        canWorker: boolean;
        canSync: boolean;
    }, undoTickerId?: number): void;
    /** 修改文本来并等到新数据 */
    updateTextControllerWithEffectAsync(params: Partial<TextEditorInfo> & {
        workId: string;
        viewId: string;
        canWorker: boolean;
        canSync: boolean;
    }, undoTickerId?: number): Promise<TextEditorInfo | undefined>;
    /** 修改文本来源于worker */
    updateTextForWorker(params: Partial<TextEditorInfo> & {
        workId: string;
        viewId: string;
        canWorker: boolean;
        canSync: boolean;
    }, undoTickerId?: number): void;
    /** 编辑文本 */
    /** 获取组建信息 */
    get(workId: string): TextEditorInfo | undefined;
    /** 删除组件 */
    delete(workId: string, canSync?: boolean, canWorker?: boolean): void;
    /** 批量删除组件 */
    deleteBatch(workIds: string[], canSync?: boolean, canWorker?: boolean): void;
    /** 清空指定view下文本 */
    clear(viewId: string, justLocal?: boolean): void;
    /** 销毁 */
    destory(): void;
    /** 监听服务端数据变动 */
    onServiceDerive(data: IWorkerMessage): void;
    /** 监听camera变化 */
    onCameraChange(cameraOpt: ICameraOpt, viewId: string): void;
}
export declare class TextEditorManagerImpl implements TextEditorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    undoTickerId?: number;
    private proxyMap;
    private taskqueue;
    constructor(props: BaseSubWorkModuleProps);
    get collector(): import("../../collector").Collector | undefined;
    filterEditor(viewId: string): Map<string, TextEditorInfo>;
    get interceptors(): {
        set: (workId: string, info: TextEditorInfo) => true | undefined;
        delete: (workId: string) => true | undefined;
        clear(): boolean;
    };
    computeTextActive(point: [number, number], viewId: string): void;
    checkEmptyTextBlur(): void;
    onCameraChange(cameraOpt: ICameraOpt, viewId: string): void;
    onServiceDerive(data: IWorkerMessage): void;
    updateForViewEdited(activeId: string, info: TextEditorInfo): void;
    active(workId: string): void;
    unActive(): void;
    createTextForMasterController(params: TextEditorInfo & {
        workId: string;
        viewId: string;
    }, undoTickerId?: number): void;
    updateTextForMasterController(params: Partial<TextEditorInfo> & {
        workId: string;
        viewId: string;
        canWorker: boolean;
        canSync: boolean;
    }, undoTickerId?: number): void;
    updateTextControllerWithEffectAsync(params: Partial<TextEditorInfo> & {
        workId: string;
        viewId: string;
        canWorker: boolean;
        canSync: boolean;
    }, undoTickerId?: number): Promise<TextEditorInfo | undefined>;
    updateTextForWorker(params: TextEditorInfo & {
        workId: string;
        viewId: string;
        canWorker: boolean;
        canSync: boolean;
    }, undoTickerId?: number): void;
    get(workId: string): TextEditorInfo | undefined;
    delete(workId: string, canSync?: boolean, canWorker?: boolean): void;
    deleteBatch(workIds: string[], canSync?: boolean | undefined, canWorker?: boolean | undefined): void;
    clear(viewId: string, justLocal?: boolean): void;
    destory(): void;
    private getMaxZIndex;
}
