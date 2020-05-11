import runSaga from './runSaga';
import { Channel } from './Channel';

/**
 * 创建saga中间件的函数
 */
export default function () {
    return function sagaMiddleware(store) {

        // run函数放在这个位置, 是因为saga需要用到仓库的dispatch和getState
        // 不写到参数为action的那层函数里， 是因为那个函数每次触发action都会执行
        // 不写到参数为next的那层函数里， 是因为saga也不会再次用到next了

        // env是全局的环境
        const env = {
            store,
            channel: new Channel(),         // 全局唯一的订阅频道
        };
        sagaMiddleware.run = runSaga.bind(null, env);

        return function (next) {
            return function(action) {
                // 直接交给下一个中间件处理
                const result = next(action);
                // 触发订阅的函数执行
                env.channel.put(action.type, action);
                return result;
            }
        }
    }
}