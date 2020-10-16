/**
 * @param {number[]} nums
 * @return {number[][]}
 */

var threeSum = function(nums) {
  if (nums && nums.length >= 3) {
    let temporaryArr = []
    let second
    let last
    nums.sort((a, b) => a - b)
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > 0) { // 排序之后第一个数大于0直接break
        break
      }
      if (i > 0 && nums[i] === nums[i - 1]) continue
      second = i + 1
      last = nums.length - 1
      while (second < last) {
        const sum = nums[i] + nums[second] + nums[last]
        if (!sum) {
          temporaryArr.push([nums[i], nums[second], nums[last]])
          while (second < last && nums[second] === nums[second + 1]) second++
          while (second < last && nums[last] === nums[last - 1]) last--
          second++
          last--
        } else if (sum > 0) {
          last--
        } else if (sum < 0) {
          second++
        }
      }
    }
    return temporaryArr
  } else {
    return []
  }
};

const nums = [-2, 0, 0, 2, 2]
// console.log(nums.sort((a, b) => a - b))
console.log(threeSum(nums))
