---
title: '曝光和点击'
date: 2019-09-23 11:04:37
tags: [埋点]
published: true
hideInList: false
feature: 
isTop: false
---
<!--以React为示例-->
# 前端埋点问题

## 曝光
* 场景分布
    > 页面中的元素出现在当前的视窗之中

* 实现思路
>  * 针对于SPA页面的特性，对于页面的整体曝光（单个路由的PV）
``` javascript
componentDidMount() {
    Logger.trackingRecord(TRACKING.PV);
}
```
> * 对于页面中某个元素的曝光
    1. 在这个场景中，我们可以对页面中的曝光逻辑进行拆分![](https://qingwu-aby.github.io//post-images/1569726066873.png)
        如上图所示，在这个场景中需要曝光的元素在一个视口中能够全部展示出来，我们可以在一个组件中将这个元素的所有埋点全部曝光出来
        <!-- 凑个字数 -->
``` javascript
    renderHeader() {
        <Impr trackingInfo={TRACKING.HEADER}>
            <div className='header'>Header</div>
        </Impr>
    }
    renderContent() {
        <Impr trackingInfo={TRACKING.CONTENT}>
            <div className='content'>Content</div>
        </Impr>
    }   
    renderButton() {
        <Impr trackingInfo={TRACKING.BUTTON}>
            <div className='button'>Button</div>
        </Impr>
    }
    render() {
        return (
            <React.Fragment>
        {
            renderHeader()
            renderContent()
            renderButton()
        }
        <React.Fragemnt>
        )
    }
```
``` javascript
class Impr extends React.Component {
    comsponentDidMount() {
        Logger.trackingRecord(this.props.imprTracking)
    }
    render() {
        return this.props.children;
    }
}
```
        这是一个最简单的场景应用，如果页面上有大量的元素存在，并且相当一部分不在当前的视口中的时候，这种做法会对曝光的数据带来不可控（你不知道元素是否已经被用户看到了）。
    2. 这个时候就可以引入新的方式`Intersection-observe`：
        因为可见性的本质是目标元素与当前视口出现的交叉区域。文档[IntersectionOberver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
        ![](https://qingwu-aby.github.io//post-images/1569744502847.jpg)
        如图所示我们只需要上报已经出现在视口中的元素就可以了，下方不在当前视口中的元素将不会曝光，每个元素在都会被observe，在监听事件结束之后将会销毁确保曝光逻辑只会出现一次
``` javascript
class Impr extends React.Component {
    registeryImprComponent() {
        new IntersectionObserver(this.callback, params)
    }
    callback() {
        // 设置交叉阈值（触发打点上报逻辑） 以及曝光时间
    }
}
```
    3. 当然也可以监听`scroll`事件，通过计算目标元素`element.getBoundingClientRect()`获取元素与容器之间的距离，但是这种情况会频繁触发`scroll`导致严重的性能问题  

## 点击
* 场景分布
    > * 点击某个元素
    > * 触发原生操作

* 实现思路
> * 元素点击
    1. 点击事件
        * 通过侵入型事件来触发上报操作
  ``` javascript
  jumpToNext() {
      // 其他逻辑
      Logger.trackingRecord(TRACKING.CLICK)
  }
  ```

        * 通过方法装饰器来触发

``` javascript
    @Logger.trackingRecord(TRACKING.CLICK)
    jumpToNext() {
        // 其他    
    }
```
    1. 监听原生返回
        * 装饰器触发
        * 设置`BaseComponet`，组件通过继承父类的方法或者通过实现的方式来完成上报操作

``` javascript
class BaseComponent extends React.Component {
    componentDidMount() {
        this.props.history.listen((location, action) => {
            //action === POP
            // Logger.trackingRecord(this.getBaseParams());
        })
    }
    getBaseParams() {
        // 方法在这定义
    }
}
class Page extends BaseComponent {
    componentDidMount() {
        super.componentDidMount()
        // todo
    }
    getBaseParams() {
        // you can set trackingParams
    }
}
```

## visibility
> 场景分布

    > 应用中视窗元素被隐藏（后台运行）