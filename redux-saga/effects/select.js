
import { createEffect, effectTypes } from './../effectHelper';

export function select(func) {
    return createEffect(effectTypes.SELECT, {
        fn: func,
    });
}

export function runSelectEffect(env, effect, next) {
    // 得到整个仓库的数据
    let state = env.store.getState();

    if (effect.payload.fn) {
        state = effect.payload.fn(state);
    }
    next(state);
}