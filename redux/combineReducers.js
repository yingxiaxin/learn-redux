import { isPlainObject } from './utils/isPlainObject';
import actionTypes from './utils/actionTypes';


export default function (reducers) {
    // 1. 验证输入参数
    validateReducers(reducers);

    // 返回的是一个reducer函数
    return function (state = {}, action) {
        const newState = {};
        for (const key in reducers) {
            if (reducers.hasOwnProperty(key)) {
                const reducer = reducers[key];
                newState[key] = reducer(state[key], action);
            }
        }
        return newState;
    }
}


function validateReducers(reducers) {
    if (typeof reducers !== 'object') {
        throw new TypeError("parameter of combineReducers must be an object");
    }
    if (!isPlainObject(reducers)) {
        throw new TypeError("parameter of combineReducers must be a plain object");
    }
    // 验证reducer的返回结果是不是undefined
    // 派发两个特殊的action, 目的就是要确保每个reducer函数, 在switch判断匹配不到的时候, 会原封不动的返回原来的状态
    // 即确保每个reducer函数写了switch代码段的default处理情况.
    // 因为这两个action的type值很特殊, 一般的reducer肯定不会匹配上, 肯定会进入到switch的default处理分支.
    // 而每个reducer都有默认的state值, 如果验证传入的参数是undefined, 那么会使用默认值, 不应该返回undefined
    for (const key in reducers) {
        if (reducers.hasOwnProperty(key)) {
            const reducer = reducers[key];
            // 传递特殊type值
            // reducer有默认值, 本次调用传入undefined参数, 就会使用默认值
            let state = reducer(undefined, { type: actionTypes.INIT() });
            if (state === undefined) {
                throw new TypeError("reducers must not return undefined");
            }
            state = reducer(undefined, { type: actionTypes.UNKNOWN() });
            if (state === undefined) {
                throw new TypeError("reducers must not return undefined");
            }
        }
    }
}