/**
 * 测试
 */
import LinkListQueen from './LinkListQueen';
class Main {
    constructor() {
        this.showContent('LinkListQueen');
        const linkListQueen = new LinkListQueen();
        for (let i = 1; i <= 5; i++) {
            linkListQueen.enqueen(i);
            console.info(linkListQueen.toString());
        }

        for (let i = 0; i < 5; i++) {
            console.info(linkListQueen.toString());
            linkListQueen.dequeen();
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
