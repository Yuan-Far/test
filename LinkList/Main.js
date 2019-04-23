/**
 * 测试
 */
import LinkList from './LinkList';
class Main {
    constructor() {
        this.showHeader('LinkList');
        let linkList = new LinkList();
        for (let i = 1; i <= 5; i++) {
            linkList.addHeadNode(i);
            console.log(linkList.toString());
        }
        linkList.insertNode(2, 8888);
        linkList.remove(3)
        console.info(linkList.toString());
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
