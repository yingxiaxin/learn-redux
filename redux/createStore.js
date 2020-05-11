import ActionTypes from './utils/actionTypes';
import { isPlainObject } from './utils/isPlainObject';

/**
 * 实现createStore功能
 * @param {function} reducer reducer函数
 * @param {*} defaultState 默认的状态值
 */
export default function createStore(reducer, defaultState, enhanced) {
    // 表示applyMiddleware返回的函数
    if (typeof defaultState === 'function') {
        enhanced = defaultState;
        defaultState = undefined;
    }
    if (typeof enhanced === 'function') {
        // 进入applyMiddleware的处理逻辑
        return enhanced(createStore)(reducer, defaultState);
    }

    let currentReducer = reducer;             // 当前的reducer
    let currentState = defaultState;          // 当前仓库中的状态

    const listeners = [];                     // 记录所有的监听器

    function dispatch(action) {
        // 验证action
        if (!isPlainObject(action)) {
            throw new TypeError("action must be a plain object");
        }
        // 验证action的type属性是否存在
        if (action.type === undefined) {
            throw new TypeError("action must have a 'type' property");
        }

        // 进行状态更新
        currentState = currentReducer(currentState, action);

        // 触发监听器
        for (const listener of listeners) {
            listener();
        }
    }

    function getState() {
        return currentState;
    }

    function subscribe(listener) {
        listeners.push(listener);

        let isremove = false;
        return function () {
            if (isremove) {
                return;
            }
            // 将listener从数组中移除
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
            isremove = true;
        }
    }

    // 创建仓库时, 需要分发一个特殊的action. 完成状态的初始化
    dispatch({
        type: ActionTypes.INIT()
    });

    return {
        dispatch,
        getState,
        subscribe,
    }
}