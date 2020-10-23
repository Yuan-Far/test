
const min = (a, b) => a > b ? b : a
// /**
//  * 
//  * @param {*} coins 
//  * @param {*} amount 变量 也就是数组索引
//  */
// const coinChange = (coins, amount) => {
//   const dp = new Array(amount + 1).fill(amount + 1) // 当amount === i的时候，至少需要dp[i]枚硬币
//   // 初始值
//   dp[0] = 0
//   // 遍历所有状态]
//   for(let i = 0; i < dp.length; i++) {
//     // 所有选择的最小值
//     for(let key in coins) {
//       if (i - coins[key] < 0) {
//         continue
//       }
//       dp[i] = min(dp[i], 1 + dp[i - coins[key]])
//     }
//   }
//   console.log(dp)
//   return (dp[amount] === amount + 1) ? -1 : dp[amount]
// }

const arr = [1, 2, 5]

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
console.log('----', coinChange(arr, 11))


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
