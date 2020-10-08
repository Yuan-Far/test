---
title: 'React源码系列2----React Fiber'
date: 2020-10-02 18:15:29
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> React Fiber架构
**Scheduler-Reconciler-Renderer**

<!-- more -->

# Fiber 架构
## 代数效应
> `代数效应`用于将`副作用`从`函数`中分离，保持函数的纯粹性

### 代数效应在React中的应用
> `For example`--->`Hooks`;对于`useState`,`useReducer`,`useRef`，我们不需要关注`FunctionComponent`的`state`在`Hook`中如何保存
``` javascript
function App() {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(count => count + 1)
    }
    return (
        <button onClick={handleClick}>{count}</button>
    )
}
```

### 代数效应与Generator
> 从`React15`到`React16`**Reconciler**的架构从`同步更新`变更到了`可中断的异步更新`
> `异步可中断更新`：更新的执行过程中随时可能会被中断（浏览器时间分片用尽或者更高优先级的任务插队），当可以继续执行的时候恢复之前执行的中间状态
> `Generator`实现异步可中断更新
### 代数效应与Fiber

> `React Fiber`: 类似于`协程`
> - `React`内部的一套状态更新机制。支持不同的`优先级`，可以更新和恢复，并且在恢复之后可以服用之前的`中间状态`
> - 其中每个任务更新单元为`React Element`对应的`Fiber`节点---**虚拟DOM**

## Fiber的实现原理
> `Fiber`之前的架构导致的问题： `Reconciler`采用递归的方式去更新虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归就会占用线程大量的时间和资源，造成页面卡顿
> `React16`将`递归的无法中断的更新`重构为`异步的可中断更新`，由此产生了新的`Fiber`架构

### What is Fiber
> - 作为架构来说，`React15`的`Reconciler`采用递归的方式去执行，数据保存在**递归调用栈**中---`Stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`----`Fiber Reconciler`
>  - 作为静态数据结构来说，每一个`Fiber节点`对应一个`React Element`，保存了该组件的类型（class\FunctionComponent\HostComponent）、对应的DOM节点信息
>  - 作为动态的工作单元来说，每一个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作等（增加\删除\更新...）

### Fiber的结构
> [Fiber节点定义](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)
<!-- more -->

``` javascript
function FiberNode (
    tag: WorkTag,
    pendingProps: mixed,
    key: null | string,
    mode: TypeOfMode
) {
    // 作为静态数据结构的属性
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.statNode = null;

    // 用于链接其他Fiber节点形成Fiber树
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    // 作为动态的动作单元的属性
    this.penfingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQuene = null;
    this.memoizedState = null;
    this.dependencies = null;

    this.mode = mode;

    this.effectTag = NoEffect;
    this.nextEffect = null;

    this.firstEffect = null;
    this.lastEffect = null;

    //调度优先级
    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    //指向该fiber在另一次更新时候对应的fiber，双缓存的时候链接current Fiber和workInProgress Fiber
    this.alternate = null;
<!-- more -->

<!-- more -->

}
```

### Fiber作为架构
> 每一个Fiber节点都有对应的`React  Element`,多个`Fiber节点`应该如何链接成树？
``` javascript
// 指向父级Fiber节点； 指节点执行完completeWork之后会返回的下一个节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟节点
this.sibling = null;
```
如下示例：
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
对应的`Fiber树`结构：
![](https://qingwu-aby.github.io//post-images/1602065772823.png)
>> `return`指节点执行完`completeWork`之后会返回的下一个节点，子节点及其兄弟节点在完成工作之后会返回其父级节点

### 作为静态的数据结构
`Fiber`作为静态的数据结构，保存了组件的相关信息：
``` javascript
// Fiber对应的组件类型，FunctionComponent/Class/HostComponent...
this.tag = tag;
// key属性
this.key = key;
// 当FunctionComponent使用React.memo包裹的时候type不一样
this.elemenType = null;
// 对于FunctionComponent,指函数本身
// 对于ClassComponent，指class,
// 对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber反应的真实DOM节点
this.stateNode = null; 
```
### 作为动态的工作单元
作为动态的工作单元，`Fiber`保存了本次更新相关的信息
``` javascript
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

## Fiber的工作原理
- `Fiber节点`构成`Fiber树`，`Fiber树`对应`DOM树`
- 直接在内存中构建并直接替换的技术--->双缓存
- 双缓存技术----`Fiber树`的构建与替换-->对应着`DOM树`的构建与更新
### 双缓存Fiber树
在`React`中最多存在**两棵**`Fiber树`。
- 当前屏幕上显示内容对应的`Fiber树`称为`Current Fiber树`
- 正在内存中构建的`Fiber树`，称为`workInProgress Fiber树`

`current Fiber树`中的`Fiber节点`称为`current Fiber`；同理`workInProgress Fiber树`中的`Fiber节点`称为`workInProgress Fiber`，他们之间通过上文讲过的`alternate`链接

``` javascript
currentFiber.alternate === workInProgressFiber;
workInProgress.alternate === currentFiber;
```
- `React`应用的根节点通过`current`指针在不同的`Fiber树`的`rootFiber`之间切换来实现`Fiber树`的切换。
- 当`workInProgress Fiber树`构建完成交付给`Renderer`渲染页面上之后，应用的根节点的`current`指针指向`workInProgress Fiber树`，此时`workInProgress Fiber树`变更为`current Fiber 树`
- 每一次的状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的交换，完成DOM更新。以下为`mount`和`update`时的构建与替换流程

### mount
example：
``` javascript
function App() {
    const [count, setCount] = useState(0)
    return (
        <p onClick={() => setCount(count + 1)}>{count}</p>
    )
}
ReactDOM.render(<App />, document.getElementById('root'))
``` 
1. * 首次执行`ReactDOM.render`会创建`fiberRootNode`（源码里面的`fiberRoot`）和`rootFiber`；其中`fiberNodeRoot`是整个应用根节点，`rootFiber`是`<App />`所在组件树的根节点
    * 区分`fiberRootNode`和`rootFiber`的原因在与，在应用中可以多次调用`ReactDOM.render`渲染不同的组件树，他们拥有不同的`rootFiber`。但是整个应用的根节点只有一个，就是`fiberRootNode`
    * `fiberRootNode`的`current`会指向当前页面上已经渲染内容对应的`Fiber树`----`current Fiber 树`
![](https://qingwu-aby.github.io//post-images/1601972147860.png)
``` javascript
fiberRootNode.current = rootFiber
```

> 由于是首屏渲染，此时页面还没有挂载任何`DOM`，所以`fiberRootNode.current`指向的`rootFiber`没有任何`子Fiber节点`（`current Fiber树为空`）

2. * 进入`render阶段`，根据组件返回的`JSX`在内存中依次创建`Fiber` 节点并链接在一起构建`Fiber树`，这个时候被称为`workInProgress Fiber树`
   * 在构建`workInProgress Fiber树`时会尝试复用`current Fiber树`中已经存在的`Fiber 节点`内的属性，在**首屏渲染**的时候只有`rootFiber`存在对应的`current Fiber`（`rootFiber.alternate`）

Fiber render阶段：
![](https://qingwu-aby.github.io//post-images/1601979189296.png)

3. * 上图所示的已经构建完成的`workInProgress Fiber树`在`commit阶段`渲染到页面
   * 此时页面中DOM被重新渲染,`current`指针指向`workInProgress Fiber树`，使其成为`Current Fiber树`
  ![](https://qingwu-aby.github.io//post-images/1601979443787.png)

### update

1. * 我们点击`p标签`的时候会触发`onclick`。改变状态值，这个操作会开启一次新的`render阶段`并构建一个新的`workInProgress Fiber树`
图示如下：
![](https://qingwu-aby.github.io//post-images/1601979728492.png)
   * 与`mount`的时候一样，`workInProgress Fiber`的创建可以复用`current fiber树`对应的节点数据
  **这个决定是否使用的过程就是diff算法**

2. * `workInProgress Fiber 树`在`render阶段`完成构建之后进入`commit阶段`渲染到页面上。在渲染完毕之后，当前的`workInProgress Fiber树`变更为`current Fiber树`

![](https://qingwu-aby.github.io//post-images/1601979993153.png)

> `Fiber树`的构建和替换的过程会伴随着`DOM`的更新

# React的Scheduler-Reconciler-Renderer架构体系
 * `Reconciler`工作的阶段被称作`render`阶段。因为在该阶段调用组件的`render`方法
 * `Renderer`阶段被称为`commit阶段`《类似于`git commit`》，`commit阶段`会把`render`提交的信息渲染在页面上
 * `render`与`commit`阶段的统称为`work`，也就是`React`的工作流程，如果任务处于`Scheduler`内部进行调度，不是`work`

# JSX与Fiber节点
* `JSX`是一种描述当前组件数据类型的数据结构，不包含**schedule**、**reconcile**、**render**所需要的相关信息
    * 组件在更新中的`优先级`
    * 组件的`state`
    * 组件被打上用于**Reconciler**的标记
* 在组件`mount`的时候，`Reconciler`根据 `JSX`描述的组件内容生成对应的`Fiber节点`
* 在组件`update`的时候，`Reconciler`将`JSX`与`Fiber节点`保存的数据进行对比，生成组件对应的`Fiber节点`，并根据对应的结果给`Fiber节点`打上标记














