/**
 * 测试
 */
import LinkList from './LinkList';
class Main {
    constructor() {
        this.showHeader('LinkList');
        let linkList = new LinkList();
        // let linkList2 = new LinkList();
        const a = [2, 4, 3]
        // const b = [5, 6, 4]
        // a.map(item => {
        //     linkList1.addHeadNode(item)
        // })
        // b.map(item => {
        //     linkList2.addHeadNode(item)
        // })
        for (let i = 0; i < a.length; i++) {
            linkList.insertNode(i, a[i]);
            // console.log(linkList.toString());
        }
        // 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
        // linkList.insertNode(0, 2);
        // linkList.remove(3)
        // this.showContent(linkList.toString())
        // this.reserve(linkList)
        // console.log(linkList.next)
        this.showContent(linkList.toString())
        // this.showContent(linkList2.toString())
        // console.info(linkList.toString());
    }

    reserve(list) {
        let curr = list
        let prev = null
        while (curr) {
            let temp = curr.next
            curr = prev
            prev = temp
        }
        return prev
    }

    showContent(content) {
        document.body.innerHTML += `${content}\n\n`;
    }

    showHeader(title) {
        console.info(`--------------------${title}----------------------`);
        document.body.innerHTML += `${title} <br />`
    }
}

window.onload = function() {
    new Main();
}
