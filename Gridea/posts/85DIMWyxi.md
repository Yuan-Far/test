---
title: 'React源码系列3---Render阶段'
date: 2020-10-06 18:50:58
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> `Fiber节点`如何被创建？
> 如何构建一棵`Fiber树`？

<!-- more -->

# render 流程
`render阶段`开始于`performSyncWorkOnRoot`或者`performConcurrentWorkOnRoot`的方法调用。具体的调用方法取决与是同步还是异步的

> performSyncWorkOnRoot:
``` javascript
// performSyncWorkOnRoot同步调用会执行这个方法
function workLoopSync() {
    while(workInProgress !== null) {
        // do something
        performUnitOfWork(workInProgress)
    }
}
```
``` javascript
//performConcurrentWorkOnRoot异步调用执行
function workLoopConcurrent() {
    while(workInProgress !== null && !shouldYield()) {
        performUnitOfWork(workInProgress)
    }
}
```

* 同步调用和异步调用的区别在于是否调用`shouldYield()`，用于判断当前关键帧是否还有剩余时间；如果当前浏览器帧没有剩余时间的话,`shouldYield`则会中止循环过程，直到浏览器有剩余时间
* `workInProgress`代表当前已经创建的`workInProgress Fiber`
* `preformUnitOfWork`方法会创建下一个`Fiber节点`并赋值给`wornInProgress`，并将`workInProgress`与已经创建的`Fiber 节点`连接起来构成`Fiber 树`
* `Fiber Reconciler`来自于`Stack Reconciler`，通过遍历的方式实现可以中断的递归
*  [workLoopConcurrent](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1599)调用的主要方法就是[performUnitOfWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1606), `performUnitOfWork`也因此分为两个阶段

## '递'
* 从`rootFiber`开始，向下，深度优先遍历（栈结构）。为遍历到的每一个`Fiber 节点`调用[beginWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3058)
* [beginWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3058)会根据传入的`Fiber 节点`创建一个`子Fiber节点`，并将这两个节点链接起来
* 当遍历到子节点的时候就会进行到`归`的阶段
## '归'
* 在这一阶段会调用[completeWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L652)来处理`Fiber节点`
* 当某个`Fiber节点`执行完`completeWork`，如果存在其`兄弟节点`（`fiber.sibling !== null`）,将会进入`兄弟Fiber`的‘递’阶段
* **递****归**的过程会交错执行，一直到**归**到最终的`rootFiber`。最后，`render阶段`结束

### Example：
使用上一节用到的`FunctionComponent`：
``` javascript
function App() {
    return (
        <div>
            hello
            <span>React</span>
        </div>
    )
}
```
`Fiber树`结构如下：
![](https://qingwu-aby.github.io//post-images/1602065787452.png)
`render阶段`执行过程：
> 1. rootFiber        beginWork
> 2. App Fiber       beginWork
> 3. div Fiber        beginWork
> 4. "Hello" Fiber  beginWork
> 5. "Hello" Fiber  completeWork
> 6. span Fiber     beginWork
> ~~7. "React" Fiber beginWork // React会优化单一文本节点，所以并不会出现~~
> ~~8. "React" Fiber completeWork~~
> 9. span Fiber     completeWork
> 10. div Fiber      completeWork
> 11. App Fiber     completeWork
> 12. rootFiber     completeWork

**performUnitOfWork递归写法：**
``` javascript
function performUnitOfWork(fiber)  {
    // beginWork()
    if (fiber.child) {
        performUnitOfWork(fiber.child)
    }
    // completeWork
    if (fiber.sibling) {
        performUnitOfWork(fiber.sibling)
    }
}
```

# beginWork
> `beginWork`的工作是传入当前的`fiber 节点`，创建`子Fiber节点`
``` javascript
function beginWork(
    current: Fiber | null, // 
    workInProgress: Fiber,
    renderLanes: Lanes
): Fiber | null {
    // do something
}
```
参数：
* current:  当前组件对应的`Fiber`节点在上一次更新时候的 `Fiber`----`workInProgress.alternate`
* workInProgress: 当前组件对应的`Fiber节点`
* renderLanes： 优先级

> 在[双缓存机制](https://qingwu-aby.github.io/post/BlZ715Y5q/#%E5%8F%8C%E7%BC%93%E5%AD%98fiber%E6%A0%91)这一块有提到，组件`mount`的时候，因为是在首屏渲染，此时页面并没有挂载DOM，是不存在当前组件对应的`Fiber 节点`在上次更新时的`Fiber 节点`的，也就是说，在`mount`的时候`current === null`

> **current === null**来判断组件当前是在`mount`还是`update`

基于组件所处的不同状态（`mount`和`update`），`beginWork`可以分为两个部分：
* `mount`时： 除`fiberRootNode`之外，`current === null`。会根据`fiber.tag`的不同，创建不同的`子Fiber节点`
* `update`时：如果`current`存在，在满足条件的时候可以复用`current`节点，克隆`current.child`作为`workInProgress.child` ,而不需要新建一个`workInProgress.child`

``` javascript
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {

  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderLanes,
    );
  } else {
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...省略
    case LazyComponent: 
      // ...省略
    case FunctionComponent: 
      // ...省略
    case ClassComponent: 
      // ...省略
    case HostRoot:
      // ...省略
    case HostComponent:
      // ...省略
    case HostText:
      // ...省略
    // ...省略其他类型
  }
}
```

## update
在`update`的时候可以直接复用前一次更新的`子Fiber`，不需要新建`子Fiber`的情况,即`didReceiveUpdate === false`
``` javascript
if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        // 省略处理
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }
```
1. 当`oldProps === newProps && workInProgress.type === current.type`,也就是在`type`和`props`不变的情况下
2. `!includesSomeLane(renderLanes, updateLanes)`,当前的`Fiber节点`优先级较低的时候

## mount
当不满足优化的路径的时候，就会去新建`子Fiber`
根据`fiber.tag`的不同，进入不同类型的`Fiber`去创建逻辑
``` javascript
// mount时：根据tag不同，创建不同的Fiber节点
switch (workInProgress.tag) {
  case IndeterminateComponent: 
    // ...省略
  case LazyComponent: 
    // ...省略
  case FunctionComponent: 
    // ...省略
    return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      )
  case ClassComponent: 
    // ...省略
    return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      )
  case HostRoot:
    // ...省略
  case HostComponent:
    return updateHostComponent(current, workInProgress, renderLanes);
  case HostText:
    // ...省略
  case SuspenseComponent:
     // ...省略 
  case HostPortal:
    // ...省略
  case ForwardRef: 
    // ...省略
  case Fragment:
    // ...省略
  case Mode:
    // ...省略
  case Profiler:
    // ...省略
  case ContextProvider:
    // ...省略
  case ContextConsumer:
    // ...省略
  // ...省略其他类型
}
```
> `React`组件类型[TagType](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactWorkTags.js#L10)

对于常见的组件类型： `FunctionComponent`/`ClassComponent`/`HostComponent`,他们分别调用了`updateFunctionComponent`/`updateClassComponent`/`updateHostComponent`,根据源码找到最终调用了[reconcileChildren](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L233)


## reconcilerChilren
作为`Reconciler`模块的核心方法：
* 对于`mount`的组件，他会创建一个新的`子Fiber节点`
* 对于`update`的组件，他会将当前组件与该组件上次更新时对应时`Fiber 节点`比较（**diff算法**），将比较的结果生成新的`Fiber节点`

``` javascript
function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes,
) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```
> `mountChildFibers`和`reconcileChildFibers`都调用了同一个方法[ChildReconciler](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactChildFiber.new.js#L1405)，唯一不同的一点是`reconcileChildFibers`会为生成的`Fiber节点`带上`flags`属性，而`mountChildFibers`不会
> 最终他会生成新的`子Fiber节点`赋值给`workInProgress.child`，作为本次`beginWork`的返回值`return workInProgress.child`，并作为下次`preformUnitOfWork`下次执行的`workInProgress = next`传参

## flags
* 因为**Renderer阶段**是在内存中进行的，当工作结束之后会通知`Renderer`需要执行的DOM操作；
* 需要执行的操作类型就是`flags`

> [ReactFiberFlags](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberFlags.js)

## beginWork流程图：
![](https://qingwu-aby.github.io//post-images/1602074983811.png)

# completeWork
> 组件执行`beginWork`之后会创建`子Fiber节点`，节点上面可能存在`flags`属性 
> [completeWork](https://github.com/facebook/react/blob/4ead6b53057ee6c6129a6d2f6e264232130b1fce/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L800)

和`beginWork`类似，`completeWork`也是根据不同的类型`fiber.tag`处理不同的逻辑
``` javascript
function completeWork(
    current: Fiber | null,
    workInProgress: Fiber,
    renderLanes: Lanes
): Fiber | null {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case IndeterminateComponent:
        case LazyComponent:
        case SimpleMemoComponent:
        case FunctionComponent:
        case ForwardRef:
        case Fragment:
        case Mode:
        case Profiler:
        case ContextConsumer:
        case MemoComponent:
        return null;
        case ClassComponent: {
        // ...省略
        return null;
        }
        case HostRoot: {
        // ...省略
        updateHostContainer(workInProgress);
        return null;
        }
        case HostComponent: {
        // ...省略
        return null;
        }
    }
// ...省略
}
```
* 首先看一下与页面`DOM`渲染相关的`Fiber节点`----`HostComponent`

## HostComponet

与上面所说的`beginWork`类似的是，我们同样根据`current === null` 判断当前页面是`mount`还是`update`，同时需要注意的是在`update`的时候`Fiber节点`是否存在对应的`DOM节点`，即`workInProgress.stateNode !== null`

``` javascript
case HostComponent: {
    popHostContext(workInProgress)
    const rootContainerInstance = getRootHostContainer()
    const type = workInPropgress.type

    if (current !== null && workInProgress.stateNode !== null) {
        // update,---> ## update
    } else {
        // mount
    }
    return null
}
```

## update

当`update`的时候，`Fiber节点`已经存在对应的`DOM节点`，不需要生成`DOM`；主要工作在于处理`props`: **事件回调**，**style**， **children**...

``` javascript
if (current !== null && workInProgress.stateNode !== null) {
    //update
    updateHostComponent(
        current,
        workInProgress,
        type,
        newProps,
        rootContainerInstance
    )
}
```
> [updateHostComponent](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L242)方法定义

``` javascript
 const updatePayload = prepareUpdate(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
      currentHostContext,
    );
    // TODO: Type this specific to this type of component.
    workInProgress.updateQueue = (updatePayload: any);
```
在[updateHostComponent](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L242)内部`props`处理完了之后，会赋值给`workInProgress.updateQueue = (updatePayload: any)`,并在最终`commit阶段`进行渲染

## mount

在`mount`的时候主要逻辑：
* 为`Fiber节点`生成对应的`DOM节点`
* 将`子节点`插入生成的`DOM节点`中
* 处理`props`

``` javascript

const currentHostContext = getHostContext();
// 为fiber创建对应DOM节点
const instance = createInstance(
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress,
  );
// 将子孙DOM节点插入刚生成的DOM节点中
appendAllChildren(instance, workInProgress, false, false);
// DOM节点赋值给fiber.stateNode
workInProgress.stateNode = instance;

// 与update逻辑中的updateHostComponent类似的处理props的过程
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
  )
) {
  markUpdate(workInProgress);
}
```

> `mount`时只会在`rootFiber`存在`PlaceMent``flags`；
> 因为`completeWork`是处于`归`阶段调用的方法，每次调用`appendAllChildren`的时候，都会将已经生成的`子DOM节点`插入到当前的已经生成的`DOM节点下`。当**归**阶段执行到`rootFiber`时，我们已经可以得到一个构建好的`DOM树`

# 流程结束

至此，render阶段全部工作完成。在performSyncWorkOnRoot函数中fiberRootNode被传递给commitRoot方法，开启commit阶段工作流程。[commitRoot](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1049)
``` javascript
commitRoot(root)
```
# complete 流程图

![](https://qingwu-aby.github.io//post-images/1602148486898.png)





