---
title: '动态规划---1（斐波那契数列说起）·'
date: 2020-06-17 17:47:18
tags: []
published: true
hideInList: false
feature: /post-images/dong-tai-gui-hua-1fei-bo-na-qi-shu-lie-shuo-qi.jpg
isTop: false
---
> 核心问题是枚举
> 寻找最优子结构
> 获得状态转移方程

1. 直接使用递归操作
   ``` javascript
   const fib = n => {
        if (n === 1 || n === 2) return 1
        return fib(n - 1) + fib(n - 2)
    }

    console.log('---FIB___1---', fib(8))
   ```
2. 增加一个备忘录记录已经计算的值，避免重复计算（自顶向下）
   ``` javascript
   /**
     * @desc 给斐波那契数列增加一个中间数组保存已经计算过的元素，
     * @param {中间数组} memo 
     * @param {数列长度} n 
     */
    const enhancer = (memo, n) => {
        if (n === 1 || n === 2) return 1
        if (memo[n]) return memo[n]
        return enhancer(memo, n - 1) + enhancer(memo, n - 2)
    }

    const fib2 = n => {
        const memo = []
        return enhancer(memo, n)
    }

    console.log('----FIB___2----', fib2(8))
   ```
3. 使用自底向上的计算方式，将问题分解，获得最优子结构
   ``` javascript
   /**
     * @desc 使用DP table
     * @param {*} n 
     */
    const fib3 = n => {
    const dp = []
    dp[0] = 0 
    dp[1] = dp[2] = 1
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
    }

    console.log('----FIB___3----', fib3(8))
   ```
4. 优化3，将dptable大小压缩
   ``` javascript
   /**
     * @desc 因为数列的值只和之前的两个状态有关系，在这里保存之前的状态能够节省空间
     * @description 【状态压缩】 将dp-table的大小压缩
     * @param {*} n 
     */
    const fib4 = n => {
    if (n === 1 || n === 2) return 1
    let prev = 1
    let curr = 1
    for (let i = 3; i <= n; i++) {
        const sum = prev + curr
        prev = curr
        curr = sum
    }
    return curr
    }

    console.log('----FIB___4----', fib4(8))
   ```