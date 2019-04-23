import LinkList from './LinkList';
export default class LinkListStack {
    constructor() {
        this.linkList = new LinkList();
    }
    getSize() {
        return this.linkList.getSize();
    }
    isEmpty() {
        return this.linkList.isEmpty();
    }
    push(element) {
        this.linkList.addHeadNode(element);
    }
    pop() {
        this.linkList.removeFirst();
    }
    peakStack() {
        return this.linkList.getFirst();
    }
    toString() {
        let arrInfo = `LinkedListStack: size = ${this.getSize()}，\n`;
        arrInfo += `data = stack top [`;
        let node = this.linkList.dummyHead.next;
        for (var i = 1; i < this.getSize(); i++) {
            arrInfo += `${node.element},`;
            node = node.next;
        }
        if (!this.isEmpty()) {
            arrInfo += `${node.element}`;
        }
        arrInfo += ']';

        // 在页面上展示
        document.body.innerHTML += `${arrInfo}<br /><br /> `;

        return arrInfo;
    }
}
