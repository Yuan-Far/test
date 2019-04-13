import { ARRAY_ERROR } from './utils/ErrorConstants';
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
    
    /**
     *
     * @returns 数组大小 --> 数组的容量（非实际的大小）
     * @memberof NewArray
     */
    getCapacity() {
        return this.arr.length;
    }
    
    /**
     * @desc 数组判空
     *
     * @returns {Boolean}
     * @memberof NewArray
     */
    isEmpty() {
        return this.size === 0;
    }
    
    /**
     * @desc 数组扩容，仅容量{capacity}；与数组的实际大小无关
     *
     * @param {*} capacity
     * @memberof NewArray
     */
    resize(capacity) {
        let newArray = new Array(capacity);
        for (let i = 0; i < this.size; i++) {
            // 将旧的数组放入新的数组中
            newArray[i] = this.arr[i];
        }
        this.arr = newArray;
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
            // throw new Error(ARRAY_ERROR.ARRAY_CAPACITY_ERROR);
            this.resize(this.size * 2);
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
        // 判满 && 扩容
        if (this.size === this.getCapacity()) {
            this.resize(this.size * 2);
            // throw new Error(ARRAY_ERROR.ARRAY_CAPACITY_ERROR);
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
        if (index < 0 || index >= this.size) {
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
        console.log('rmove', index, this.size);
        if (index < 0 || index >= this.size) {
            throw new Error(ARRAY_ERROR.DELETE_INDEX);
        }
        const element = this.arr[index];
        // index后面的元素覆盖前面的元素
        for (let i = index; i < this.size - 1; i++) {
            this.arr[i] = this.arr[i + 1];
        }
        this.size --;
        // 最后一位置空
        this.arr[this.size] = null;
        // 缩容
        if (
            Math.floor(this.getCapacity() / 4) === this.size &&
            Math.floor(this.getCapacity() / 2 !== 0)
        ) {
            this.resize(Math.floor(this.getCapacity() / 2));
        }
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
