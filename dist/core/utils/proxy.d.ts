import { EDataType } from "../enum";
export type InterceptorsType<T, K> = {
    get(key: T): K;
    set(key: T, value: K): void;
    delete(key: T): void;
    clear(): void;
    size(): number;
};
export declare class ProxyMap<T, K> {
    static proxyToRaw: WeakMap<WeakKey, any>;
    static interceptors: {
        entries(...arg: any[]): any;
        forEach(...arg: any[]): any;
        size(): any;
        get(key: unknown): any;
        set(key: unknown, value: unknown): any;
        delete(key: unknown, _dataType?: EDataType): any;
        clear(): any;
    };
    createProxy(map: Map<T, K>): Map<T, K>;
}
