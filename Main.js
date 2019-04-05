import NewArray from './Array-#1/NewArray';

class Main {
    constructor() {
        const arr = new NewArray(20);
        for (let i = 0; i <= 10; i++) {
            arr.add(i);
        }
        console.info('----init----\n', arr.toString());
        arr.insert(5, 99999);
        console.info('----insert----\n', arr.toString());
        arr.unshift(-1);
        console.info('----unshift----\n', arr.toString());
        arr.push(88888);
        console.info('----push----\n', arr.toString());
        arr.set(9, 8888);
        console.log('----get----\n', arr.get(9));
        this.showContent(arr.get(9));
    }

    showContent (content) {
        document.body.innerHTML += `${content}<br />`
    }
}

window.onload = function () {
    new Main();
}
