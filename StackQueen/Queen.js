import NewArray from '../Array/Array-#1/NewArray';
export default class IQueen {
    constructor(capacity = 10) {
        this.arr = new NewArray(capacity);
    }
    /**
     * @desc 队列入队
     * @param {*} val 入队参数
     */
    enqueen(val) {
        this.arr.push(val);
    }
    /**
     * @desc 队列出队
     * @return 返回出队元素
     */
    dequeen() {
        return this.arr.shift();
    }

    /**
     * @desc 队列判空
     * @return {boolean} 是否为空
     */
    isEmpty() {
        return this.arr.isEmpty();
    }
    /**
     * @desc 队列长度
     * @return 返回队列长度
     */
    getSize() {
        return this.arr.getSize();
    }
    /**
     * @desc　队列容量
     * @return 返回队列容量
     */
    queenCapacity() {
        return this.arr.getCapacity();
    }
    /**
     * @desc 查看队首元素
     * @return 返回队首元素
     */
    getFront() {
        return this.arr.getFirst();
    }
    /**
     * @desc 辅助展示方法 
     */
    toString() {
        let arrInfo = `Queen: size-->${this.getSize()} \n, capacity-->${this.queenCapacity()} \n`;
        arrInfo += `data = front  [`;
        for (var i = 0; i < this.arr.size - 1; i++) {
           arrInfo += `${this.arr.arr[i]}, `;
        }
        if (!this.isEmpty()) {
           arrInfo += `${this.arr.arr[this.arr.size - 1]}`;
        }
        arrInfo += `]  tail`;

        document.body.innerHTML += `${arrInfo}<br />`
        return arrInfo;
    }
}
