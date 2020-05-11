
function createThunkMiddleware(extra) {
    // 返回一个thunk中间件

    return store => next => action => {
        if (typeof action === 'function') {
            return action(store.dispatch, store.getState, extra);
        } else {
            return next(action);
        }
    }
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;