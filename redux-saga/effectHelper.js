// 该模块为创建effect和判断effect做支持

// effect可用类型
export const effectTypes = {
    CALL: 'CALL',
    TAKE: 'TAKE',
    FORK: 'FORK',
    ALL: 'ALL',
    PUT: 'PUT',
    SELECT: 'SELECT',
    FORK:'FORK',
    CANCEL: 'CANCEL',
};

const specialEffectName = "@@redux-saga/IO";

/**
 * 创建effect对象
 * @param {*} type 有效的effect类型
 * @param {*} payload 
 */
export function createEffect(type, payload) {
    // 验证type值
    if (!Object.values(effectTypes).includes(type)) {
        throw new TypeError("这是一个无效的type值");
    }

    return {
        [specialEffectName]: true,
        type,
        payload,
    }
}

export function isEffect(obj) {
    if (typeof obj !== 'function') {
        return false;
    }
    return obj[specialEffectName] === true;
}