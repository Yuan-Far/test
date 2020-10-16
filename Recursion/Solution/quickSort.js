const swap = (arr, i, j) => {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const partial = (arr, left, right) => {
  const dataMid = arr[Math.floor(Math.random() * (right - left + 1)) + left]
  let i = left
  let j = right
  while (i <= j) {
    while (arr[i] < dataMid) {
      i++
    }
    while (arr[j] > dataMid) {
      j--
    }
    if (i <= j) {
      let temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
      i++
      j--
    }
  }
  return i
}

const quick = (arr, left, right) => {
  let index
  if (left < right) {
    index = partial(arr, left, right) // 获取基准
    if (left < index - 1) {
      quick(arr, left, index - 1)
    }
    if (index < right) {
      quick(arr, index, right)
    }
  } 
}

const quickSort = arr => {
  quick(arr, 0, arr.length - 1)
}


const arr = [1, 3, 2, 5, 4]
quickSort(arr)
console.log(arr)
