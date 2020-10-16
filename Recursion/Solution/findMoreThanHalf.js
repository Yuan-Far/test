function findMoreThanHalf(arr) {
  let map = new Map()
  if (arr instanceof Array && arr.length > 0) {
    if (arr.length === 1) {
      return arr[0]
    }
    arr.forEach(item => {
      const times = map.get(item)
      if (!times) {
        map.set(item, 1)
      } else {
        map.set(item, times + 1)
      }
    })
    for (let key of map.keys()) {
      if (map.get(key) > arr.length / 2) {
        return key
      } else {
        return -1
      }
    }
  } else {
    return -1
  }
}

const arr = [1, 2, 3, 4, 5, 4, 4, 4]

console.log(findMoreThanHalf(arr))
