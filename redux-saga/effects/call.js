// 1. 提供一个call函数, 用于产生call effect
// 2. 处理call effect

import { createEffect, effectTypes } from '../effectHelper';
import { isPromise } from 'is-promise';

export function call(fn, ...args) {
    // fn可能是一个函数, 也可能是一个数组. 
    // 如果是数组, 数组第二项是一个函数, 第一项表示这个函数绑定的this指向
    // this指向
    let context = null,
        func = fn;
    if (Array.isArray(fn)) {
        context = fn[0];
        func = fn[1];
    }

    return createEffect(effectTypes.CALL, {
        context,
        fn: func,
        args,
    });
}

// call指令的作用就是调用一个函数
export function runCallEffect(env, effect, next) {
    const { context, fn, args } = effect.payload;
    // 调用函数, 得到返回结果
    const result = fn.call(context, ...args);
    if (isPromise(result)) {
        result.then(v => next(v))
            .catch(err => next(null, err));
    } else {
        next(result);
    }
}
