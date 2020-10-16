var inorder = (root) => {
  let list = []
  let stack = []
  let node = root

  while (node || stack.length) {
    while (node) {
      stack.push(node) // current node --> stack
      node = node.left // push left
    }
    node = stack.pop() // pop stack
    list.push(node.val)
    node = node.right // currentNode ===> stack
  }
  return list
}
