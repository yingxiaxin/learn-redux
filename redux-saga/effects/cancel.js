import { createEffect, effectTypes } from "../effectHelper";

export function cancel(task) {
    return createEffect(effectTypes.CANCEL, {
        task,
    });
}

export function runCancelEffect(env, effect, next) {
    // cancel中的next指向的是它对应的任务的next
    effect.payload.task.cancel();
    // 此处的next是当前任务的next, 需要调用next下一步
    next();
}