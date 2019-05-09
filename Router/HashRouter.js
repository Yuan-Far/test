/**
 * @desc 路由hash实现
 * 将路由和对应的回调记录下来，
 * 在hashChange的时候获取当前路径并执行回调
 */

export default class HashRouter {
    constructor() {
        this.isBack= false;
        this.router = {};
        this.currentUrl = '';
        this.hashStack = []; // 保存历史信息栈
        window.addEventListener('load', () => this.render());
        // 路由处理方法，主要是监听hashchange事件
        window.addEventListener('hashchange', () => this.render());
    }

    static init() {
        window.Router = new HashRouter();
    }

    // 注册路由和回调
    route(path, callback) {
        console.log(path);
        this.route[path] = callback || function() {};
    }

    // 路由入栈，记录当前hash，执行对应回调
    render() {
        if (this.isBack) {
            this.isBack = false;
            return;
        }
        this.currentUrl = window.location.hash.slice(1) || '/';
        this.hashStack.push(this.currentUrl);
        this.route[this.currentUrl]();
    }

    back() {
        this.isBack = true;
        this.hashStack.pop(); // 出栈
        const stackLength = this.back.hashStack.length;
        if (stackLength <= 0) {
            return;
        }
        const prev = this.hashStack(stackLength - 1);
        location.hash = `#${prev}`;
        this.currentUrl = prev;
        this.route[prev]();
    }
}
