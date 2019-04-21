/**
 * @desc 循环队列
 */
export default class LoopQueen {
    constructor(capacity = 10) {
        this.arr = new Array(capacity);
        this.front = this.tail = 0;
        this.size = 0;
    }
    /**
     * @desc 数组扩缩容
     * @params {number} 新的数组容量
     */
    resize(capacity) {
        const newArr = new Array(capacity);
        for (let i = 0; i < this.size; i++) {
            // 防止索引越界出现假溢出
            // 循环队列， 索引控制判断条件
            const index = (this.front + i) % this.getQueenCapacity();
            newArr[i] = this.arr[index];
        }

        this.arr = newArr;
        this.front = 0;
        this.tail = this.size;
    }
    /**
     * @desc 循环队列入队操作
     * @param {*} val 入队元素
     */
    enqueen(val) {
        // 队列判满
        if ((this.tail + 1) % this.getQueenCapacity() === this.front) {
            this.resize(Math.floor(this.getQueenCapacity() * 2));
        }
        this.arr[this.tail] = val;
        // 尾节点指针后移一位
        this.tail = (this.tail + 1) % this.getQueenCapacity();
        this.size ++;
    }
    /**
     * @desc 循环队列出队
     * @return {*} 出队元素
     */
    dequeen() {
        if (this.isEmpty()) {
            throw new Error('This queen is empty');
        }
        const val = this.arr[this.front];
        this.arr[this.front] = null;
        this.front = (this.front + 1) % this.getQueenCapacity();
        this.size --;

        if (this.size === Math.floor(this.getQueenCapacity() / 4)) {
            this.resize(Math.floor(this.getQueenCapacity() / 2));
        }
        return val;
    }
    /**
     * @desc 循环队列判空
     * @return {boolean}
     */
    isEmpty() {
        return this.front === this.tail;
    }
    getQueenSize() {
        return this.size;
    }
    getQueenCapacity() {
        return this.arr.length;
    }
    getFront() {
        if (this.isEmpty()) {
            throw new Error('this queen is empty');
        }
        return this.arr[this.front];
    }
    toString() {
        let arrInfo = `LoopQueen: size-->${this.getQueenSize()} \n, capacity-->${this.getQueenCapacity()} \n`;
        arrInfo += `data = front  [`;
        for (let i = 0; i < this.size - 1; i++) {
            arrInfo += `${this.arr[i]}, `;
        }
        if (!this.isEmpty()) {
            arrInfo += `${this.arr[this.size - 1]}`;
        }
        arrInfo += `]  tail`;

        document.body.innerHTML += `${arrInfo}<br />`
        return arrInfo;
    }
}
