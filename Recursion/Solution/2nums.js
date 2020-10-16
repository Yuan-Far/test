/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const map = new Map()
  if (nums instanceof Array && nums.length >= 2) {
    for (let i = 0; i < nums.length; i++) {
      const key = target - nums[i]
      if (map.has(key)) {
        return [map.get(key), i]
      }
      map.set(nums[i], i)
    }
  } else {
    return []
  }
};

const nums = [2, 7, 11, 15]
const target = 9

console.log(twoSum(nums, target))
