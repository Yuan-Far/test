// function ListNode(val) {
//   this.val = val
//   this.next = null
// }

/**
 * 
 * @param {*} head 
 * @param {*} n 
 * @desc 使用双指针，间距为n
 */
function lastXNode(head, n) {
  let front = head
  let end = head

  let gap = 0

  while (front.next) {
    if (gap === n) {
      front = front.next
      end = end.next
      continue
    }
    front = front.next
    gap++
  }

  return end
}
