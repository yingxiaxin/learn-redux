export default function compose(...funcs) {
    // 如果没有函数要组合, 则返回的函数原封不动的返回参数
    if (funcs.length === 0) {
        return args => args;
    } else if (funcs.length === 1) {
        return funcs[0];
    } else {
        return funcs.reduce((a, b) => (...args) => a(b(...args)));
    }
}