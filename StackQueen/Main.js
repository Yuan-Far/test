/**
 * 测试
 */
import NewStack from './Stack';
import IQueen from './Queen';
import LoopQueen from './LoopQueen';
class Main {
    constructor() {
        // this.showHeader('Stack');
        // let ms = new NewStack(10);
        // for (let i = 1; i <= 10; i++) {
        //     ms.pushStack(i);
        //     console.log(ms.toString());
        // }

        // console.log(ms.peakStack());
        // this.showContent(ms.peakStack());

        // while (!ms.isEmpty()) {
        //     console.log(ms.toString());
        //     ms.popStack();
        // }
        // this.showHeader('Queen');
        // let iQueen = new IQueen();
        // for (let i = 1; i <= 10; i++) {
        //     iQueen.enqueen(i);
        //     console.info(iQueen.toString());
        // }
        // console.info(iQueen.getFront());
        // this.showContent(iQueen.getFront());
        // while (!iQueen.isEmpty()) {
        //     console.info(iQueen.dequeen());
        //     iQueen.toString();
        // }
        this.showHeader('LoopQueen');
        let loopQueen = new LoopQueen();
        for (let i = 1; i <= 10; i ++) {
            loopQueen.enqueen(i);
            console.info(loopQueen.toString());
        }
        console.info(loopQueen.getFront());
        this.showContent(looQueen.getFront());
        while(!loopQueen.isEmpty) {
            console.info(loopQueen.dequeen);
            loopQueen.toString();
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
