---
title: 'React源码系列4---commit阶段'
date: 2020-10-06 19:07:50
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> `render阶段`中最后调用的`commitRoot`是`commit阶段`的工作起点。`fiberRootNode`作为传参`commitRoot(root)`
<!-- more -->
# commit
* ~~在`rootFiber.firstEffct`上保存了一条需要执行`副作用`的`Fiber节点`的单向链表`effectList`~~,最近的一次更新中**react官方**使用了`subtreeHasEffects`和`rootHasEffect`获取`副作用`的`Fiber节点`
，这些`Fiber节点`的`updateQueue`中保存了变化的`props`
* 这些`副作用`对应的`DOM操作`会在`commit阶段`执行
* 部分生命周期钩子函数`componentDid***`，`hook`（`useEffect`）需要在`commit阶段`执行

`commit阶段`的主要工作（即`Renderer`的工作流程）：
1. `before mutation`阶段（执行`DOM操作`之前）
2. `mutation`阶段（执行`DOM`操作）
3. `layout`阶段（执行`DOM`操作之后）

> `commitRootImpl`-->[commitRootImpl](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1784)
> 在`before mutation阶段`组件之前以及`layout阶段之后`还涉及到`useEffect`的触发，`优先级`重置，`ref`的绑定/解绑等

## commit流程

### before mutation 之前

`commitRootImpl`方法中一直到`if (subtreeHasEffects || rootHasEffect)`之前，属于`before mutation之前`

``` javascript
do {
    // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
    // means `flushPassiveEffects` will sometimes result in additional
    // passive effects. So we need to keep flushing in a loop until there are
    // no more pending effects.
    // TODO: Might be better if `flushPassiveEffects` did not automatically
    // flush synchronous work at the end, to avoid factoring hazards like this.
    // 触发useEffect回调与其他的同步任务，由于可能会引发新的渲染。所以这里需要遍历到最终没有任务为止
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);
    // root : fiberRootNode
    // root.finishedLanes 指当前应用的rootFiber
  const finishedWork = root.finishedWork;
    // lanes 与优先级相关的变量
  const lanes = root.finishedLanes;

  if (enableSchedulingProfiler) {
    markCommitStarted(lanes);
  }

  if (finishedWork === null) {

    if (enableSchedulingProfiler) {
      markCommitStopped();
    }

    return null;
  }

  // 重置Scheduler绑定的回调
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.
  root.callbackNode = null;

  // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // 重置优先级变量
  markRootFinished(root, remainingLanes);

  // Clear already finished discrete updates in case that a later call of
  // `flushDiscreteUpdates` starts a useless render pass which may cancels
  // a scheduled timeout.
  // 清理已经完成的discrete updates，eg: 鼠标点击触发的更新
  if (rootsWithPendingDiscreteUpdates !== null) {
    if (
      !hasDiscreteLanes(remainingLanes) &&
      rootsWithPendingDiscreteUpdates.has(root)
    ) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }
    // 重置全局变量
  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
    // This indicates that the last root we worked on is not the same one that
    // we're committing now. This most commonly happens when a suspended root
    // times out.
  }
  // Check if there are any effects in the whole tree.
  // TODO: This is left over from the effect list implementation, where we had
  // to check for the existence of `firstEffect` to satsify Flow. I think the
  // only other reason this optimization exists is because it affects profiling.
  // Reconsider whether this is necessary.
  // 判断当前的树上面是否还有副作用的节点
  const subtreeHasEffects =
    (finishedWork.subtreeFlags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;
  const rootHasEffect =
    (finishedWork.flags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;
    if (subtreeHasEffects || rootHasEffect) {

    } else {
        // No effects.
        root.current = finishedWork;
        // Measure these anyway so the flamegraph explicitly shows that there were
        // no effects.
        // TODO: Maybe there's a better way to report this.
        if (enableProfilerTimer) {
            recordCommitTime();
        }
    }
```

> `before mutation之前`的阶段都是在处理变量的赋值，以及状态的重置等操作

### layout 之后
``` javascript
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

// useEffect相关
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
} else {}

// 性能优化相关
if (remainingLanes !== NoLanes) {
  if (enableSchedulerTracing) {
    // ...
  }
} else {
  // ...
}

// 性能优化相关
if (enableSchedulerTracing) {
  if (!rootDidHavePassiveEffects) {
    // ...
  }
}

// ...检测无限循环的同步任务
if (remainingLanes === SyncLane) {
  // ...
} 

// 在离开commitRoot函数前调用，触发一次新的调度，确保任何附加的任务被调度
ensureRootIsScheduled(root, now());

// ...处理未捕获错误及老版本遗留的边界问题
// 执行同步任务，这样同步任务不需要等到下次事件循环再执行
// 比如在 componentDidMount 中执行 setState 创建的更新会在这里被同步执行
// 或useLayoutEffect
flushSyncCallbackQueue();
return null;
```
主要包含三个方面：
1. `useEffect`的相关处理
2. 性能追踪
3. 在`commit`阶段会触发一些生命周期钩子(`componentDid***`)和`hook`（`useLayoutEffect`, `useEffect`）

> 在这些回调方法中可能会触发新的更新，新的更新会开启新的`render-commit`过程，例如：
> 1. 触发点击事件，页面中令一个状态变为`0`
> 2. 在`useLayoutEffect`中设置为随机数
> 3. 页面上渲染的数字不是`0`，而是变成随机数

因为`useEffectLayout`在`layout阶段`同步执行回调，回调中触发状态更新，这个操作会重新调度一个新的任务:--->[flushSyncCallbackQueue](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2114)
``` javascript
// If layout work was scheduled, flush it now.
  flushSyncCallbackQueue();
  ```
  所以看不到页面中的数字先变成`0`

  ## before mutation

`Renderer`工作的阶段被称为`commit阶段`，`commit阶段`分为三个部分
* before mutation（执行`DOM操作前`）
* mutation阶段（执行`DOM`操作）
* layout阶段（执行`DOM`操作之后）
  
  > [before mutation阶段](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1882-L1909)

  ``` javascript
  // 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// 将当前上下文标记为CommitContext，作为commit阶段的标志
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// 处理focus状态
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// beforeMutation阶段的主函数
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;
  ```
这里需要关注主函数`commitBeforeMutationEffects`的作用

### commitBeforeMutationEffects

`commitBeforeMutationEffects` 直接去调度`commitBeforeMutationEffectsImpl`
代码逻辑：
``` javascript
function commitBeforeMutationEffects(firstChild: Fiber) {
  let fiber = firstChild;
  while (fiber !== null) {
    if (fiber.deletions !== null) {
      commitBeforeMutationEffectsDeletions(fiber.deletions);
    }
    if (fiber.child !== null) {
      const primarySubtreeFlags = fiber.subtreeFlags & BeforeMutationMask;
      if (primarySubtreeFlags !== NoFlags) {
        commitBeforeMutationEffects(fiber.child);
      }
    }

   try {
        commitBeforeMutationEffectsImpl(fiber);
      } catch (error) {
        captureCommitPhaseError(fiber, fiber.return, error);
      }
    fiber = fiber.sibling;
  }
}
```
commitBeforeMutationEffectsImpl: 
``` javascript
function commitBeforeMutationEffectsImpl(fiber: Fiber) {
  const current = fiber.alternate;
  const flags = fiber.flags;
// focus相关
  if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
    // Check to see if the focused element was inside of a hidden (Suspense) subtree.
    // TODO: Move this out of the hot path using a dedicated effect tag.
    if (
      fiber.tag === SuspenseComponent &&
      isSuspenseBoundaryBeingHidden(current, fiber) &&
      doesFiberContain(fiber, focusedInstanceHandle)
    ) {
      shouldFireAfterActiveInstanceBlur = true;
      beforeActiveInstanceBlur();
    }
  }
  // 调用getSnapshotBeforeUpdate

  if ((flags & Snapshot) !== NoFlags) {
    setCurrentDebugFiberInDEV(fiber);
    commitBeforeMutationEffectOnFiber(current, fiber);
    resetCurrentDebugFiberInDEV();
  }
 // 调度useEffect
  if ((flags & Passive) !== NoFlags) {
    // If there are passive effects, schedule a callback to flush at
    // the earliest opportunity.
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      scheduleCallback(NormalSchedulerPriority, () => {
        flushPassiveEffects();
        return null;
      });
    }
  }
}
```
整体分为三个部分：
1. 处理`DOM节点`渲染/删除后的`autoFocus`，`blur`逻辑
2. 调用`getSnapshotBeforeUpdate`生命周期钩子
3. 调度`useEffect`

### 调用getSnapshotBeforeUpdate

>  `commitBeforeMutationEffectOnFiber`是`commitBeforeMutationLifeCycles`的别名,
这个方法内部会调用`getSnapshotBeforeUpdate`:
> [commitBeforeMutationLifeCycles方法](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L237)
``` javascript
const snapshot = instance.getSnapshotBeforeUpdate(
    finishedWork.elementType === finishedWork.type
        ? prevProps
        : resolveDefaultProps(finishedWork.type, prevProps),
    prevState,
);
```













