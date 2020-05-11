import { effectTypes } from './effectHelper';
import { runCallEffect } from './effects/call';
import { runPutEffect } from './effects/put';
import { runSelectEffect } from './effects/select';
import { runTakeEffect } from './effects/take';
import { runForkEffect } from './effects/fork';
import { runCancelEffect } from './effects/cancel';
import { runAllEffect } from './effects/all';

// 该模块主要用于处理一个effect对象

/**
 * 处理一个effect对象, 根据不同的effect.type值, 做不同的处理
 * @param {*} env 全局的环境对象
 * @param {*} effect effect对象
 * @param {*} next 下一个处理
 */
export default function (env, effect, next) {
    switch (effect.type) {
        case effectTypes.CALL: {
            runCallEffect(env, effect, next);
            break;
        }
        case effectTypes.PUT: {
            runPutEffect(env, effect, next);
            break;
        }
        case effectTypes.SELECT: {
            runSelectEffect(env, effect, next);
            break;
        }
        case effectTypes.TAKE: {
            runTakeEffect(env, effect, next);
            break;
        }
        case effectTypes.FORK: {
            runForkEffect(env, effect, next);
            break;
        }
        case effectTypes.CANCEL: {
            runCancelEffect(env, effect, next);
            break;
        }
        case effectTypes.ALL: {
            runAllEffect(env, effect, next);
            break;
        }
        default: {
            throw new Error("类型无效");
        }
    }
}