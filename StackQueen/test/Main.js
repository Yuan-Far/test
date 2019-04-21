import Solution from './Solution';

class Main {
    constructor() {
        this.alterLine('leetcode 20. 有效的括号');
        let s = new Solution();
        this.show(s.isValid('{ [ ( ) ] }'));
        this.show(s.isValid(' [ ( ] ) '));
    }
  
    // 将内容显示在页面上
    show(content) {
        document.body.innerHTML += `${content}<br /><br />`;
    }

    // 展示分割线
    alterLine(title) {
        let line = `--------------------${title}----------------------`;
        console.log(line);
        document.body.innerHTML += `${line}<br /><br />`;
    }
}

window.onload = function() {
    new Main();
}
