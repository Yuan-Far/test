---
title: 'React源码系列1---React15和16的差别'
date: 2020-09-23 20:16:23
tags: []
published: true
hideInList: false
feature: 
isTop: false
---

React不同版本源码的差异
<!-- more -->

**React的理念**
> 速度快，响应自然

# React的架构
## React15

- Reconciler——找出发生变化的组件
- Renderer——渲染发生变化的组件
### Reconciler

> `React`中会通过`this.setState`,`this.forceUpdate`,`ReactDom.render`等方法更新组件
> - 调用函数组件、class组件的`render`方法，将返回的JSX转换为虚拟DOM
> - 将虚拟DOM与上次的进行比较
> - 找出本次发生更新的虚拟DOM
> - 通知**Renderer**将变化的虚拟DOM渲染到页面上
### Renderer

> 每次更新发生的时候，**Renderer**接收到**Reconciler**的通知，将变化的组件渲染到当前的宿主环境
### React15的缺陷

**无法支持同步更新**
**递归的去更新会导致某写情况下页面的渲染结果不一致**

> 在`Reconciler`中，`update`的组件会调用`updateComponent`,`mount`的组件会调用`mountComponent`，这两个方法都是递归执行的
>
> JS是一门单线程的语言，他的`GUI渲染线程`和`JS主线程`是互斥的，也就是说在页面执行我们的js代码的时候是不能够去渲染和绘制页面的，在我们渲染每一帧页面的时候：
```
JS代码执行-------样式布局-------样式绘制
```
> - 当JS代码执行的时间超过每一帧的时长的时候，页面上就无法反映出本次渲染的结果
> - 同时，对于`React`来说，因为递归执行的原因，所以会导致页面一旦开始更新就无法终止；如果我们页面的层级变得很深，就会导致递归更新的时间过长，页面无法渲染
> - **Scheduler**和**Reconciler**是交替渲染的

## React16
> `React16`的架构有三层：
> - Schduler（调度器）——调度人物的优先级，高优先级任务优先进入**Reconciler**
> - Reconciler（协调器）——找出变化的组件（`Fiber`架构？）
> - Renderer（渲染器）——将变化的组件渲染到页面上
>> 其中**Scheduler**和**Reconciler**是平台无关的

### Scheduler（调度器）
> 我们以浏览器每一帧是否有剩余时间作为任务中断的标准，需要有一种机制通知我们浏览器什么时候有剩余时间----`requestIdleCallback`
> `React`实现了`requestIdleCallback`的polyfill---**Scheduler**；除了在浏览器空闲时间触发回调，还提供了多种调度优先级

### Reconciler（协调器）
> 在`React15`中，**Reconciler**是递归处理虚拟DOM的
> `React16`中更新的过程从递归变成了可以终中断的循环过程，每一次循环都回去调用`shouleYield`判断当前是否有剩余时间
``` javascript
function workLoopConcurrent() {
    while(workInProgress !== null && !shouldYield()) {
        workInProgress = performUnitOfWork(workInProgress)
    }
}
```
> 关于`React15`中的因为一些特殊原因导致中断更新的时候DOM渲染不完全的问题
>
> 在`React16`中，**Reconciler**和**Renderer**不是交替工作的。当**Scheduler**将任务交给**Reconciler**的时候，**Reconciler**会为变化的虚拟DOM搭上增/删/更新的标记
>> 其他的[标记](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)
> 因为整个**Scheduler**和**Reconciler**的过程都是在内存中进行的。只有当组件都完成在**Reconciler**的工作，才会统一交给**Renderer**

### Renderer（渲染器）

> **Renderer**根据**Reconciler**为虚拟DOM的打上的标记，同步执行对应的DOM操作。
> **Scheduler**和**Reconciler**中的步骤随时会因为，有更高优先级的任务进来，或者当前帧没有剩余时间而中断。因为 **Scheduler**和**Reconciler**中的工作都是在内存中进行的，并不会更新页面，所以即使这个里面出现反复中断，也不会影响用户的体验（看见部分DOM更新不完全）














