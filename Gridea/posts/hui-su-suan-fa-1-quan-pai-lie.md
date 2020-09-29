---
title: '回溯算法1--全排列'
date: 2020-06-18 18:41:07
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> 回溯算法实际上是一个决策树的遍历过程

    * 路径： 即已经做出的选择
    * 选择列表：当前可以做出的决策
    * 结束条件： 到达树底的时候，无法作出选择的条件

```
result = []
const backtrack(路径, 选择列表) {
    if 满足结束条件:
        result.add(路径)
        return

    for 选择 in 选择列表:
        做选择
        backtrack(路径, 选择列表)
        撤销选择
}
```