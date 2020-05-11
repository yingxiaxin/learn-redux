import compose from './compose';

/**
 * 注册中间件函数
 * @param  {...any} middlewares 所有中间件
 */
export default function (...middlewares) {
    // 返回的函数接收创建仓库的方法
    return function (createStore) {
        // 再次返回的函数接收reducer和defaultState实际创建仓库
        return function (reducer, defaultState) {
            // 创建仓库
            const store = createStore(reducer, defaultState);
            // dispatch赋值为这个函数的目的是, 让开发者在dispatch完成替换前不要调用
            let dispatch = () => {
                throw new Error("目前还不能使用dispatch");
            };

            // 给dispatch赋值, 替换dispatch
            // 根据中间件数组, 得到一个dispatch创建函数的数组
            const simpleStore = {
                getState: store.getState,

                // 不能使用下面被注释的这种写法, 这种写法的dispatch指向最原始的store的dispatch
                // dispatch: store.dispatch,
                // 而且也不能如下面注释这样写, 这样写的话会一直指向抛出错误的那个函数
                // dispatch: dispatch,
                dispatch: (...args) => dispatch(...args),
            };
            const dispatchProducers = middlewares.map(mid => mid(simpleStore));
            const dispatchProducer = compose(...dispatchProducers);
            dispatch = dispatchProducer(store.dispatch);

            return {
                ...store,
                dispatch,
            }
        }
    }
}