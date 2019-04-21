/**
 * @desc Stack LIFO --> 先进后出 --> 1,2,3(3,2,1)
 * 数组在加入限制后的结果（pop && push）
 */
import NewArray from '../Array/Array-#1/NewArray';

export default class NewStack {
    constructor(capacity = 10) {
        this.arr = new NewArray(capacity);
    }

    isEmpty() {
        return this.arr.isEmpty();
    }

    stackSize() {
        return this.arr.getSize();
    }

    stackCapacity() {
        return this.arr.getCapacity();
    }

    pushStack(val) {
        this.arr.push(val);
    }

    popStack() {
        return this.arr.pop();
    }

    peakStack() {
        return this.arr.getLast();
    }

    toString() {
        let arrInfo = `Stack: size-->${this.stackSize()}, capacity-->${this.stackCapacity()} \n`;
        arrInfo += `data = first  [`;
        for (var i = 0; i < this.arr.size - 1; i++) {
           arrInfo += `${this.arr.arr[i]}, `;
        }
        if (!this.isEmpty()) {
           arrInfo += `${this.arr.arr[this.arr.size - 1]}`;
        }
        arrInfo += `]  last`;

        document.body.innerHTML += `${arrInfo}<br />`
        return arrInfo;
    }
}
