---
title: 'react的一些小问题'
date: 2020-12-15 16:05:52
tags: []
published: false
hideInList: false
feature: 
isTop: false
---
`ref`在挂载的时候传入`DOM`结构，写在的时候传入`null`
`ref.current`可以更改

`React`中对`Div`的监听需要使用`onScrollCapture`

> 状态变化较为复杂的时候可以使用`useRef`来保存页面中的状态