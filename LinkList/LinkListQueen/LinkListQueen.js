class LinkListNode {
    constructor(element = null, next = null) {
        this.element = element;
        this.next = next;
    }
    toString() {}
}

/**
 * @desc 链表实现队列，此时需要注意链表是否为空的情况
 *
 * @export
 * @class LinkListQueen
 */
export default class LinkListQueen {
    constructor() {
        this.front = this.tail = null;
        this.size = 0;
    }
    /**
     * @desc 入队
     * 当tail不为null，说明队列不为空这时候将tail.next指向下一个节点
     * 同时移动tail指向新的node
     *
     * @param {*} element
     * @memberof LinkListQueen
     */
    enqueen(element) {
        if (this.tail === null) {
            this.tail = new LinkListNode(element, null);
            this.front = this.tail;
        } else {
            let node = new LinkListNode(element, null);
            this.tail.next = node;
            this.tail = node;
        }

        this.size++;
    }
    /**
     * @description 出队操作
     * 需要先判断队列是否为空
     * 然后将front指向下一个节点
     * 同时将当前的front置为null，与元链表断开联系，
     * 再进行链表判空处理，确认队列中所有元素是否全部出队
     *
     * @returns
     * @memberof LinkListQueen
     */
    dequeen() {
        if (this.front === null) {
            throw new Error('this queen is null');
        }
        let delNode = this.front;
        const element = delNode.element;
        this.front = this.front.next;
        delNode = null;
        if (this.front === null) {
            this.tail = null;
        }
        this.size--;
        return element;
    }

    getFront() {
        if (this.front === null) {
            throw new Error('this queen is null');
        }
        return this.front.element;
    }

    getSize() {
        return this.size;
    }

    isEmpty() {
        return this.size === 0;
    }

    toString() {
        let queenInfo = `LinkedListQueen: size = ${this.getSize()}，\n`;
        queenInfo += `data front [`;
        let node = this.front;
        for (let i = 1; i < this.getSize(); i++) {
            queenInfo += `${node.element} -> `;
            node = node.next;
        }
        if (!this.isEmpty()) {
            queenInfo += `${node.element}`;
        }
        queenInfo += `] tail`;
        document.body.innerHTML = `${queenInfo}<br />`;

        return queenInfo;
    }
}
