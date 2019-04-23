export class ListNode {
    constructor(val = null, next = null) {
        this.val = val;
        this.next = next;
    }

    appendNode(array) {
        let head = null;
        if (this.val === null) {
            head = this;
            head.val = array[0];
            head.next = null;
        } else {
            head = new ListNode(arr[0]);
            head.next = this.next;
            this.next = head;
        }

        for (let i = 1; i < array.length; i++) {
            head.next = new ListNode(array[i]);
            head = head.next;
        }
    }

    toString() {
        let arrInfo = `ListNode: \n`;
        arrInfo += `data = front  [`;
        let node = this;
        while (node.next !== null) {
            arrInfo += `${node.val}->`;
            node = node.next;
        }
        arrInfo += `${node.val}->`;
        arrInfo += 'NULL] tail';

        // 在页面上展示
        document.body.innerHTML += `${arrInfo}<br /><br /> `;

        return arrInfo;
    }
}

export default class Solution203 {
    removeElements(head, val) {
        const removeElements = function (head, val) {
            // 头节点处理
            while(head !== null && head.val === val) {
                head = head.next;
            }
            if (head === null) {
                return false;
            }

            let prev = head;
            while (prev.next !== null) {
                if (prev.next.val === val) {
                    let delNode = prev.next;
                    prev.next = delNode.next;
                    delNode = null;
                } else {
                    prev = prev.next;
                }
            }
            return head;
        }

        return removeElements(head, val);
    }
}