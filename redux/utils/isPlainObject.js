/**
 * 判断一个对象是否是平面对象
 * @param {*} obj 
 */
export function isPlainObject(obj) {
    if (typeof obj !== 'object') {
        return false;
    }

    return Object.getPrototypeOf(obj) === Object.prototype;
}