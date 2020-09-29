---
title: '动态规划2---凑零钱'
date: 2020-06-18 18:18:18
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> 决策过程
```
// base case
dp[0][0]... = base
    // 状态转移过程
    for(状态1 in 状态1所有值) {
        for (状态2 in 状态2所有值) {
            ...
            dp[状态1][状态2]... = 最值(选择1， 选择2， ...)
        }
    }
```

1. 自顶向下分析
   ``` javascript
   /**
     * @description 自顶向下分析
     * @param {*} coins 
     * @param {*} amount 
     */

    const coinChange = (coins, amount) => {
    const memo = []
    function dp(n) {
        if (memo[n]) return memo[n]
        if (n === 0) return 0
        if (n < 0) return -1
        let res = amount + 1
        for (let coin in coins) {
            // 获得子问题
        const sub = dp(n - coins[coin])
        if (sub === -1) continue
        res = min(res, 1 + sub)
        }
        memo[n] = res
        return res !== amount + 1 ? memo[n] : -1
    }
    return dp(amount)
    }

    console.log('----', coinChange(arr, 11))

   ```
2.  自底向上分析
   ``` javascript
   var coinChange = function(coins, amount) {
    const min = (a, b) => a > b ? b : a
    const dp = new Array(amount + 1).fill(amount + 1)
    // define init value
    dp[0] = 0
    // 状态转移
    for(let i = 0; i< dp.length; i++) {
        for(let coin in coins) {
            if (i - coins[coin]) continue
            dp[i] = min(dp[i], 1 + dp[i - coins[coin]])
        }
    }
    return (dp[amount] === amount + 1) ? -1 : dp[amount]
    };
   ```