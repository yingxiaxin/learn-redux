
export default function (actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return getAutoDispatchActonCreator(actionCreators, dispatch);
    } else if (typeof actionCreators === 'object') {
        const result = {};
        for (const key in actionCreators) {
            if (actionCreators.hasOwnProperty(key)) {
                const actionCreator = actionCreators[key];
                // 只有当传入的这个对象的属性值是个函数的时候, 才进行增强
                // 否则什么都不做
                if (typeof actionCreator === 'function') {
                    result[key] = getAutoDispatchActonCreator(actionCreator, dispatch);
                }
            }
        }
        return result;
    } else {
        throw new TypeError("actionCreators must be an object or function");
    }
}

/**
 * 得到一个自动分发的action创建函数
 * @param {*} actionCreator 
 * @param {*} dispatch 
 */
function getAutoDispatchActonCreator(actionCreator, dispatch) {
    return function (...args) {
        const action = actionCreator(...args)
        dispatch(action);
    }
}