import { Task } from './Task';
import isGenerator from 'is-generator';
import isPromise from 'is-promise';
import { isEffect } from './effectHelper';
import runEffect from './runEffect';

/**
 * 开启一个新任务
 * @param {*} evn 环境数据, 被saga执行期共享的数据
 * @param {function} generatorFunc 生成器函数
 * @param {*} args 生成器函数的参数
 */
export default function (env, generatorFunc, ...args) {
    const iterator = generatorFunc(...args);
    if (isGenerator(iterator)) {
        // 不断调用next, 直到迭代结束
        return proc(env, iterator);
    } else {

    }
}

/**
 * 执行一个generator(iterotor)
 */
export function proc(env, iterotor) {

    // 回调函数对象
    const cbObj = {
        callback: null,
    };

    // 要调用一次启动任务
    next();

    /**
     * 迭代控制函数
     * @param {*} nextValue 正常调用iterator.next时传递的值
     * @param {*} err 错误对象
     * @param {*} isOver 是否结束
     */
    function next(nextValue, err, isOver) {
        // 情况1: 调用iterator.next(value)
        // 情况2: 调用iterator.throw(err)
        // 情况3: 调用iterator.return()
        let result;
        if (err) {
            result = iterator.throw(err);
        } else if (isOver) {
            result = iterator.return();

            // 调用一个回调函数, 通知task任务结束
            cbObj.callback && cbObj.callback();
        } else {
            result = iterator.next(nextValue);
        }

        const { value, done } = result;
        if (done) {
            // 迭代结束
            cbObj.callback && cbObj.callback();
            return;
        }

        // 没有结束, 那么要对value进行判断
        if (isEffect(value)) {
            // 情况1: 是一个effect对象
            runEffect(env, value, next);
        } else if (isPromise(value)) {
            // 情况2: value是一个promise
            value.then(r => next(r))
                .catch(err => next(null, err));
        } else {
            // 情况3: 其他
            // 直接进行下一步
            next(value);
        }
    }

    return new Task(next, cbObj);
}