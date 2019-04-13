import NewArray from './Array-#1/NewArray';

class Main {
    constructor() {
        console.info('----init Array----');
        const arr = new NewArray(10);
        for (let i = 0; i < 10; i++) {
            arr.add(i);
        }
        console.info('----create Array----\n', arr.toString());
        arr.insert(5, 99999);
        console.info('----insert----\n', arr.toString());
        arr.unshift(-1);
        console.info('----unshift----\n', arr.toString());
        arr.push(88888);
        console.info('----push----\n', arr.toString());
        arr.remove(9);
        console.info('----remove----\n', arr.toString());
        arr.set(9, 8888);
        console.info('----get----\n', arr.get(9));
        this.showContent(arr.get(9));
    }

    showContent (content) {
        document.body.innerHTML += `${content}<br />`
    }
}

window.onload = function () {
    new Main();
}
