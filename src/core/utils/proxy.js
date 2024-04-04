export class ProxyMap {
    createProxy(map) {
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
Object.defineProperty(ProxyMap, "proxyToRaw", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new WeakMap()
});
Object.defineProperty(ProxyMap, "interceptors", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        entries(...arg) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.entries(...arg);
        },
        forEach(...arg) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.forEach(...arg);
        },
        size() {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.size;
        },
        get(key) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.get(key);
        },
        set(key, value) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.set(key, value);
        },
        delete(key, _dataType) {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.delete(key);
        },
        clear() {
            const rawTarget = ProxyMap.proxyToRaw.get(this);
            return rawTarget.clear();
        }
    }
});
