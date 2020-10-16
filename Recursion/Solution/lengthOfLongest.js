/**
 * @param {string} s
 * @return {number}
 * @desc 暴力循环，时间复杂度为O(n^2),空间复杂度为O(n)
 */
// const lengthOfLongestSubstring = function(s) {
//   let maxLength = 0
//   let temporaryArr = []
//   if (typeof s === 'string' && s.length > 0) {
//     for (let i = 0; i< s.length; i++) {
//       let index = temporaryArr.indexOf(s[i])
//       if(index !== -1) {
//         temporaryArr.splice(0, index + 1);
//       }
//       temporaryArr.push(s.charAt(i))
//       maxLength = Math.max(temporaryArr.length, maxLength)
//     }
//     return maxLength
//   } else {
//     return maxLength
//   }
// };

const lengthOfLongestSubstring = function(s) {
  let map = new Map()
  let maxLength = 0
  if (typeof s === 'string' && s.length > 0) {
    for (let i = 0, j = 0; j < s.length; j++) {
      if (map.has(s[j])) {
        i = Math.max(map.get(s[j]) + 1, i)
      }
      maxLength = Math.max(maxLength, j - i + 1)
      map.set(s[j], j)
    }
    return maxLength
  } else {
    return maxLength
  }
}

const s = "dvdf"

console.log(lengthOfLongestSubstring(s))
