/**
 * 测试
 */
import NewStack from './Stack';
class Main {
    constructor() {
        console.info('----init Stack && Queen----');
        let ms = new NewStack(10);
        for (let i = 1; i <= 10; i++) {
            ms.pushStack(i);
            console.log(ms.toString());
        }

        console.log(ms.peakStack());
        this.showContent(ms.peakStack());

        while (!ms.isEmpty()) {
            console.log(ms.toString());
            ms.popStack();
        }
    }

    showContent(content) {
        document.body.innerHTML += `${content}\n\n`;
    }
}

window.onload = function() {
    new Main();
}
