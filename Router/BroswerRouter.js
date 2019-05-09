/**
 * @desc history路由实现
 * @param {go(n)} 路由跳转 0：刷新页面
 * @param {back} 路由后退 === history.go(-1)
 * @param {forward} 路由前进 === history.go(1)
 * @param {pushState} 添加一条路由历史记录（不可跨域） 新建！！！！！！！
 * @param {replaceState} 替换路由历史记录 替换~~~~~~~~
 * @event {popState} 路由记录发生改变的时候触发该事件
 */

export default class BrowserRouter {
    constructor(path) {
        this.routes = {};
        history.replaceState({ path }, null, path); // 进入时状态
        this.routes[path] && this.routes[path]();
        window.addEventListener('popstate', e => {
            console.log(e)
            const path = e.state && e.state.path;
            this.routes[path] && this.routes[path]();
        });
    }

    static init() {
        window.Router = new BrowserRouter(location.pathname);
    }

    route(path, callback) {
        this.routes[path] = callback || function () {};
    }

    go(path) {
        history.pushState({ path }, null, path);
        this.routes[path] && this.routes[path]();
    }
}

