import { createEffect, effectTypes } from './../effectHelper';
import runSaga from './../runSaga';

export function fork(generatorFunc, ...args) {
    return createEffect(effectTypes.FORK, {
        fn: generatorFunc,
        args: args,
    });
}

export function runForkEffect(env, effect, next) {
    // 启动一个新的任务
    const task = runSaga(env, effect.payload.fn, ...effect.payload.args);
    // 马上调用next, 即意味着 不会阻塞当前任务
    next(task);
}