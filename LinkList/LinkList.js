class LinkListNode {
    constructor(element = null, next = null) {
        this.element = element;
        this.next = next;
    }

    toString() {
        return this.element.toString();
    }
}

/**
 * @desc 增删改查的时间复杂度O{n}，因为都对整个链表进行了遍历
 *
 * @export
 * @class LinkList
 */
export default class LinkList {
    constructor() {
        this.dummyHead = new LinkListNode(null, null);
        this.size = 0;
    }

    getSize() {
        return this.size;
    }

    isEmpty() {
        return this.size === 0;
    }
    /**
     *
     * @memberof LinkList 添加头节点
     */
    addHeadNode(element) {
        // const linkListNode = new LinkListNode(element, null);
        // linkListNode.next = this.head;
        // this.head = linkListNode;
        // this.size++;
        this.insertNode(0, element);
    }

    /**
     * @desc 通过循环让prev不断切换，最终指向目标节点的前一个节点
     * 使用虚拟头节点，这个节点不存储任何信息，不介入链表中的操作，仅仅充当链表的head
     * 插入过程中始终为node.next = dummyHead.next;dummyHead.next = node; 
     * @param {*} index 插入的位置
     * @param {*} element 插入的元素
     * @memberof LinkList 插入新的节点
     */
    insertNode(index, element) {
        if (index < 0 || index > this.size) {
            throw new Error('out of index');
        }
        let prev = this.dummyHead;
        for (let i = 0; i < index; i++) {
            prev = prev.next;
        }
        const linkListNode = new LinkListNode(element, null);
        linkListNode.next = prev.next;
        prev.next = linkListNode;
        this.size++; 
    }

    /**
     *
     * @desc 插入链表尾部
     * @param {*} element
     * @memberof LinkList
     */
    innsertLast(element) {
        this.insertNode(this.size, element);
    }

    /**
     *
     * @desc 获取当前索引值的元素
     * @param {*} index 索引值
     * @returns 当前元素
     * @memberof LinkList
     */
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('out of index');
        }
        let node = this.dummyHead.next; // 当前头节点（dummyHead并不是实际的节点）
        for (let i = 0; i < index; i++) {
            node = node.next;
        }

        return node.element
    }

    getFirst() {
        return this.get(0);
    }

    getLast() {
        return this.get(this.size - 1);
    }

    /**
     *
     * @desc 修改节点
     * @param {*} index
     * @param {*} element
     * @memberof LinkList
     */
    set(index, element) {
        if (index < 0 || index > this.size) {
            throw new Error('out of index');
        }
        // 第一个真实节点
        let node = this.dummyHead.next;
        for(let i = 0; i < index; i++) {
            node = node.index;
        }
        node.element = element;
    }

    /**
     *
     * @desc 判定元素是否在链表中
     * @param {*} element
     * @returns {boolean}
     * @memberof LinkList
     */
    include(element) {
        let node = this.dummyHead.next;
        for (;node.next !== null;) {
            if (node.element === element) {
                return true;
            }
            node = node.next;
        }
        return false;
    }

    remove(index) {
        if (index < 0 || index > this.size) {
            throw new Error('out of index');
        }
        let prev = this.dummyHead;
        for (let i = 0; i < index; i++) {
            prev = prev.next;
        }
        let delNode = prev.next;
        prev.next = delNode.next;
        let element = delNode.element;
        delNode = null;
        this.size--;
        return element;
    }

    removeFirst() {
        return this.remove(0);
    }

    removeLast() {
        return this.remove(this.size - 1);
    }
    reserve(list) {
        // if (list === null || list.next === null) return list
        let prev = null
        console.log(list)
        let curr = list
        while (curr) {
          const temp = curr.next
          curr.next = prev
          prev = curr
          curr = temp
        }
        return prev
      }

    toString() {
        let linkInfo = `----LinkList:---- <br /> size: ${this.getSize()} <br />`;
        linkInfo += `head [`;
        let node = this.dummyHead.next;
        // for (;node.next !== null;) {
        //     console.log('aaaaaaaaaaaaaaaaaa', node.element);
        //     linkInfo += `${node.element}->`;
        //     node = node.next;
        // }
        const a = [2, 4, 3]
        for (let i = 0; i < a.length; i++) {
            this.insertNode(i, a[i]);
            // console.log(linkList.toString());
        }
        this.reserve(node)
        console.log('-=-=', this.reserve(node))
        while(node.next !== null) {
            linkInfo += `${node.element}->`;
            node = node.next;
        }
        linkInfo += `${node.element}->NULL] tail`;
        document.body.innerHTML = `${linkInfo}<br />`;

        return linkInfo;
    }
}
