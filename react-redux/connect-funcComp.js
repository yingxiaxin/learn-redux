/**
 * 返回的高阶组件是函数组件
 */

import React, { useContext, useState, useEffect } from 'react';
import ctx from './ctx';
import { bindActionCreators } from 'redux';


/**
 * 浅比较对象
 * @param {*} obj1 
 * @param {*} obj2 
 */
function compare(obj1, obj2) {
    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
            return false
        }
    }
    return true;
}


export default function (mapStateToProps, mapDispatchToProps) {
    /**
     * 返回一个高阶组件
     */
    return function (Comp) {


        function Temp(props) {
            const store = useContext(ctx);
            const [state, setState] = useState(mapStateToProps && mapStateToProps(store.getState()));

            useEffect(() => {
                return store.subscribe(() => {
                    const newState = mapStateToProps && mapStateToProps(store.getState());
                    setState(prevState => {
                        if (compare(prevState, newState)) {
                            return prevState;
                        } else {
                            return newState;
                        }
                    });
                });
            }, [store]);

            // 得到需要传递的时间处理属性
            function getEventHandler() {
                if (typeof mapDispatchToProps === 'function') {
                    return mapDispatchToProps(store.dispatch);
                } else if (typeof mapDispatchToProps === 'object') {
                    return bindActionCreators(mapDispatchToProps, store.dispatch);
                }
            }

            let handlers = {};
            if (mapDispatchToProps) {
                handlers = getEventHandler();
            }

            return <Comp {...state} {...handlers} {...props} />
        }



        // 高阶组件返回的组件名称和传入的组件名称一致
        Temp.displayName = Comp.displayName || Comp.name;
        return Temp;
    }
}