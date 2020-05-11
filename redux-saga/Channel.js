
/**
 * 订阅频道
 */
export class Channel {
    listeners = {};

    /**
     * 添加一个订阅者
     * @param {*} prop 属性名, 即action.type
     * @param {*} func 订阅函数
     */
    take(prop, func) {
        if (this.listeners[prop]) {
            this.listeners[prop].push(func);
        } else {
            this.listeners[prop] = [func];
        }
    }

    /**
     * 触发监听函数
     * @param {*} prop 触发的属性名
     * @param {...any} args 额外的参数
     */
    put(prop, ...args) {
        if (this.listeners[prop]) {
            const funcs = this.listeners[prop];

            // 要先删除订阅, 再运行函数
            // 因为运行函数的过程中, 可能又会take添加订阅
            // 如果先运行再删除, 可能会导致后边添加的订阅函数还没运行就被删除了

            // 删除订阅
            delete this.listeners[prop];

            // 运行订阅函数
            funcs.forEach(fn => {
                fn(...args);
            });

        }
    }
}