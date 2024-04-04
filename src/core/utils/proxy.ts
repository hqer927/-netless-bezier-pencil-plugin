/* eslint-disable @typescript-eslint/no-unused-vars */
import { EDataType } from "../enum";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type InterceptorsType<T,K> = {
    get(key:T):K;
    set(key: T, value: K): void;
    delete(key:T): void;
    clear():void;
    size():number;
}
export class ProxyMap<T,K>{
    static proxyToRaw = new WeakMap();
    static interceptors = {
        entries(...arg: any[]){
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.entries(...arg);
        },
        forEach(...arg: any[]){
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.forEach(...arg);
        },
        size(){
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.size;
        },
        get(key:unknown) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.get(key);
        },
        set(key:unknown, value:unknown) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.set(key, value);
        },
        delete(key:unknown, _dataType?:EDataType){
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.delete(key);
        },
        clear(){
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.clear();
        }
    };
    createProxy(map: Map<T,K>) {
        const proxy = new Proxy(map, {
            get(target, key, receiver) {
                // eslint-disable-next-line no-prototype-builtins
                const _target = ProxyMap.interceptors.hasOwnProperty(key) ? ProxyMap.interceptors : target;
                return Reflect.get(_target, key, receiver);
            }
        });
        ProxyMap.proxyToRaw.set(proxy, map);
        return proxy;
    }
}
