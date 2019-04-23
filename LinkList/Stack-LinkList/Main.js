/**
 * 测试
 */
import LinkListStack from './LinkListStack';
class Main {
    constructor() {
        this.showHeader('LinkListStack');
        let linkListStack = new LinkListStack();
        for (let i = 1; i <= 5; i++) {
            linkListStack.push(i);
            console.log(linkListStack.toString());
        }
        console.log(linkListStack.peakStack());
        for (let i = 0; i < 5; i++) {
            console.log(linkListStack.toString());
            linkListStack.pop();
        }
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
