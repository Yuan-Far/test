/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var addTwoNumbers = function(l1, l2) {
  const reserve = list => {
    let prev = null
    let curr = list
    while (curr) {
      let temp = curr.next
      curr.next = prev
      prev = curr
      curr = temp
    }
    
    return prev
  }

  const linkList1 = reserve(l1)
  const linkList2 = reserve(l2)
  
  const sum = list => {
    let n = 1
    let sum = 0
    while (list) {
      sum += n * list.val
      list = list.next
      n = n * 10
    }
    return sum
  }

  return sum(linkList1) + sum(linkList2)
}


// console.log(addTwoNumbers(l1, l2))