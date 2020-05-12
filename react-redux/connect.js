/**
 * 返回的高阶组件是类组件
 */

import React from 'react';
import ctx from './ctx';
import { bindActionCreators } from 'redux';


export default function (mapStateToProps, mapDispatchToProps) {
    /**
     * 返回一个高阶组件
     */
    return function (Comp) {

        // 对于Temp组件, 只有它需要的数据发生变化时才重新渲染
        class Temp extends React.PureComponent {
            static contextType = ctx;

            constructor(props, context) {
                super(props, context);
                this.store = this.context;

                if (mapStateToProps) {
                    this.state = mapStateToProps(this.store.getState());
                    // 监听仓库中的数据变化, 得到一个取消监听的函数
                    this.unlisten = this.store.subscribe(() => {
                        this.setState(mapStateToProps(this.store.getState()));
                    });
                }

                if (mapDispatchToProps) {
                    this.handlers = this.getEventHandler();
                }
            }

            // 得到需要传递的时间处理属性
            getEventHandler() {
                if (typeof mapDispatchToProps === 'function') {
                    return mapDispatchToProps(this.store.dispatch);
                } else if (typeof mapDispatchToProps === 'object') {
                    return bindActionCreators(mapDispatchToProps, this.store.dispatch);
                }
            }

            componentWillUnmount() {
                this.unlisten && this.unlisten();
            }

            render() {
                return <Comp {...this.state} {...this.handlers} {...this.props}/>
            }
        }
        // 高阶组件返回的组件名称和传入的组件名称一致
        Temp.displayName = Comp.displayName || Comp.name;
        return Temp;
    }
}