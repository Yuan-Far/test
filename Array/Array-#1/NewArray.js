import ARRAY_ERROR from './utils/ErrorConstants';
/**
 * @author Yuan
 * @description 复写数组
 * @class NewArray
 */
export default class NewArray {
    // 构造默认的数组大小
    constructor(capacity = 10) {
        // this.arr = Array.apply(null, Array(capacity)).map(_ => null);
        this.arr = new Array(capacity);
        this.size = 0;
    }

    // 获取当前数组大小
    getSize() {
        return this.size;
    }
    // 获取数组容量
    getCapacity() {
        return this.arr.length;
    }
    // 数组判空
    isEmpty() {
        return this.size === 0;
    }
    /**
     * @desc 插入元素
     *
     * @param {*} index 需要插入的索引
     * @param {*} val 需要插入的元素
     * @memberof NewArray
     */
    insert(index, val) {
        // 判满
        if (this.size === this.getCapacity()) {
            throw new Error(ARRAY_ERROR.ARRAY_CAPACOTY_ERROR);
        }
        // index是否符合要求
        if (index < 0 || index > this.size) {
            throw new Error(ARRAY_ERROR.INSERT_INDEX_ERROR);
        }

        for (let i = this.size - 1; i >= index; i--) {
            this.arr[i + 1] = this.arr[i]
        }

        this.arr[index] = val
        this.size++;
    }
    // 前方插入
    unshift(val) {
        this.insert(0, val);
    }
    // 后方插入
    push(val) {
        this.insert(this.size, val);
    }
    // 添加元素
    add(val) {
         // 判满
         if (this.size === this.getCapacity()) {
            throw new Error(ARRAY_ERROR.ARRAY_CAPACOTY_ERROR);
        }
        this.arr[this.size] = val;
        this.size++;
    }
    /**
     * @desc 获取指定位置元素
     *
     * @param {*} index
     * @returns 返回该索引对应的元素
     * @memberof NewArray
     */
    get(index) {
        if (index < 0 || index > this.size) {
            throw new Error(ARRAY_ERROR.GET_ERROR);
        }
        return this.arr[index];
    }
    /**
     * @desc 重置某个索引的元素
     *
     * @param {*} index
     * @param {*} val
     * @memberof NewArray
     */
    set(index, val) {
        if (index < 0 || index > this.size) {
            throw new Error(ARRAY_ERROR.SET_ERROR);
        }
        this.arr[index] = val;
    }
    /**
     *
     * @desc 包含元素
     * @param {*} val 传入元素
     * @returns 如果arr中包含该元素，则返回true
     * @memberof NewArray
     */
    include(val) {
        for (let i = 0; i < this.size; i++) {
            if (val === this.arr[i]) {
                return true;
            }
        }
        return false;
    }
    /**
     *
     * @desc 查找元素
     * @param {*} val 传入元素
     * @returns 如果包含该元素，则返回元素的索引，否则返回-1(仅返回第一个匹配的位置)
     * @memberof NewArray
     */
    find(val) {
        for (let i = 0; i < this.size; i++) {
            if (val === this.arr[i]) {
                return i;
            }
        }
        return -1;
    }
    /**
     * @desc 批量查找数组中的相同元素
     *
     * @param {*} val
     * @returns 元素在数组中的位置所组成的数组
     * @memberof NewArray
     */
    findAll(val) {
        const newArray = new NewArray(this.size);
        for (let i = 0; i < this.size; i++) {
            if (this.arr[i] === val) {
                newArray.push(i);
            }
        }
        return newArray;
    }
    /**
     * @desc 删除索引元素
     * @todo 被删除元素会以undefined填充
     * @param {*} index 传入需要删除的索引
     * @returns 返回被删除的元素
     * @memberof NewArray
     */
    remove(index) {
        if (index < 0 || index > this.size) {
            throw new Error(ARRAY_ERROR.DELETE_INDEX);
        }
        const element = this.arr[index];
        for (let i = this.size - 1; i >= index; i--) {
            this.arr[i] = this.arr[i + 1];
        }
        // 最后一位置空
        this.arr[this.size - 1] = undefined;
        this.size --;
        return element;
    }
    // 删除数组中第一个元素
    shift() {
        return this.remove(0)
    }
    // 删除数组中最后一个元素
    pop() {
        return this.remove(this.size - 1)
    }
    /**
     * @desc 根据元素删除
     * @returns 返回被删除的元素
     * @param {*} val
     * @memberof NewArray
     */
    removeElement(val) {
        const index = this.find(val);
        if (index !== -1) {
            this.remove(index);
        }
    }
    removeAllElement(val) {
        // const indexArr = this.findAll(val);
        let index = this.find(val);
        while (index !== -1) {
            this.remove(index);
            // 循环找下一个符合条件的元素
            index = this.find(val);
        }
    }
    /**
     * @desc 获取数组信息
     *
     * @returns 返回数组信息
     * @memberof NewArray
     */
    toString() {
        let arrInfo = `Array: size-->${this.getSize()}, capacity-->${this.getCapacity()} \n`;
        arrInfo += `data = [`
            for (let i = 0; i < this.size - 1; i++) {
                arrInfo += `${this.arr[i]},`;
            }
        `]`;
        arrInfo += `${this.arr[this.size - 1]}]`;
        document.body.innerHTML += `${arrInfo}<br />`
        return arrInfo;
    }
}
