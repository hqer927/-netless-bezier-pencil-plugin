import { TextEditorInfo, TextOptions } from "./types";
import { BaseSubWorkModuleProps } from "../../plugin/types";
import { Collector } from "../../collector";
import { ICameraOpt, IWorkerMessage } from "../../core";
import EventEmitter2 from "eventemitter2";
import { BaseTeachingAidsManager } from "../../plugin/baseTeachingAidsManager";
export interface TextEditorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    readonly collector: Collector;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    /** 本地更新文本编辑器 */
    updateForLocalEditor(activeId?: string, info?: TextEditorInfo): void;
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
    createTextForMasterController(params: Partial<TextEditorInfo> & {
        workId: string;
        x: number;
        y: number;
        opt: TextOptions;
        viewId: string;
    }): void;
    /** 修改文本来源于main */
    updateTextForMasterController(params: Partial<TextEditorInfo> & {
        workId: string;
        isDel?: boolean;
        viewId: string;
    }): void;
    /** 修改文本来源于worker */
    updateTextForWorker(params: Partial<TextEditorInfo> & {
        workId: string;
        isDel?: boolean;
        viewId: string;
    }): void;
    /** 编辑文本 */
    /** 获取组建信息 */
    get(workId: string): TextEditorInfo | undefined;
    /** 删除组件 */
    delete(workId: string, canSync?: boolean, canWorker?: boolean): void;
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
    readonly collector: Collector;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    private proxyMap;
    constructor(props: BaseSubWorkModuleProps);
    filterEditor(viewId: string): Map<string, TextEditorInfo>;
    get interceptors(): {
        set: (workId: string, info: TextEditorInfo) => void;
        delete: (workId: string) => void;
        clear(): void;
    };
    computeTextActive(point: [number, number], viewId: string): void;
    checkEmptyTextBlur(): void;
    onCameraChange(cameraOpt: ICameraOpt, viewId: string): void;
    onServiceDerive(data: IWorkerMessage): void;
    updateForLocalEditor(activeId: string, info: TextEditorInfo): void;
    active(workId: string): void;
    unActive(): void;
    createTextForMasterController(params: TextEditorInfo & {
        workId: string;
        viewId: string;
        scenePath: string;
    }): void;
    updateTextForMasterController(params: TextEditorInfo & {
        workId: string;
        viewId: string;
        scenePath: string;
        isDel?: boolean;
    }): void;
    updateTextForWorker(params: TextEditorInfo & {
        workId: string;
        viewId: string;
        scenePath: string;
        isDel?: boolean;
    }): void;
    get(workId: string): TextEditorInfo | undefined;
    delete(workId: string, canSync?: boolean, canWorker?: boolean): void;
    clear(viewId: string, justLocal?: boolean): void;
    destory(): void;
}
