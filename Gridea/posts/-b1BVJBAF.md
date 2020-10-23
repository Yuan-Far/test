---
title: '页面可视化'
date: 2020-10-20 17:34:01
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> 大量同质化代码的处理
<!-- more -->

> 页面的基础信息统一放在`store`中去处理
``` javascript
const initialState = {
    cur: '',            //当前选中组件的guid
    total: 0,           //组件总数
    count: 0,           //组件已加载个数，用于判断初次加载是否完毕
    componentPool: {
        guid: '',
        type: '',
        // ...
        flags: delete | add | update
    },  //所有组件（包含容器组件）的组件实例，key为guid
    error: {
        guid: [],       //错误组件的guid[]
        message: []     //以及对应的错误信息
    }
};
```

### 编辑器页面获取组件：
1. 自上而下的进行数据包的分发
2. 组件实例化，根据`rawContent`将上次编辑的数据进行还原

### 前端编辑完成之后交付给后端需要两种数据结构：
1. `rawContent`: 原始的json结构--用于在编辑页面的数据快速恢复【`JSON.parse(rawContent)`】
2. `renderTreeContent`: 面向ToC的数据页面--页面上经过计算完成的数据【`convet(rawContent)`】

### 编辑数据是否更新
1. 校验`rawContent`和上一次保存之后的数据是否发生了变化
2. 页面复制的时候为每一个组件的`guid`重新赋值
3. 将组件的信息放在 `localStorage`中

### 数据保存
1. 在页面编辑栏发生`更新`/`删除`/`添加`/操作的时候对该组件增加`flags`
2. 在进行保存的时候直接保存对应的`store`中的数据结构（此时需要移除`flags`为删除状态的操作）
3. ** `撤销`操作**：维护一个`past`数组，初始状态为`[]`，以及预设中间状态`preset`,这次操作在组件实例化完成之后进行，`preset`为组件实例化之后的对象
   *  所有的组件操作都会触发一个`action`，当触发`action`的时候去调用这个`reducer`
   * 每次新增或者更改的时候保存上一次页面状态，放入数组之中
   * 此时维护的`past`数组是当前页面上所有的未保存的状态
   * 触发`undo`的时候，`preset`状态更新为`past[past.length - 1]`,同时增加回撤`future`数组

``` javascript
// init 
case TYPES.TOOLS.UNDO:
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    return {
        past: newPast,
        present: previous,
        future: [present, ...future]
    };
case TYPES.TOOLS.REDO:
    const next = future[0];
    const newFuture = future.slice(1);
    return {
        past: [...past, present],
        present: next,
        future: newFuture
    };
case TYPES.COMPONENT.COMPONENTS_INSTANTIATION_END: //加载完毕后开始计算redo undo
    return {
        past: [],
        present: reducer(present, action),
        future: []
    }
default:
    //将其他 action 委托给原始的 reducer 处理
    const newPresent = reducer(present, action);
    if (present === newPresent) {
        return state;
    }
    return {
        past: [...past, present],
        present: newPresent,
        future: []
    };
```

## 组件原始数据结构
``` javascript
[
    {
        gid: '',
        name: '',
        ename: '',
        props: {}
        flags: {},
        version: '',
        position: '', //当前位置
    },
    {},
]
```