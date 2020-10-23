---
title: '异常监控与其捕获'
date: 2020-10-14 18:01:06
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> `window.onerror`,`addEventListener('error')`,什么时候用哪一种呢？
<!-- more -->
# 页面生命周期
1. `DOMContentLoaded`--浏览器已经加载完`DOM`，但是外部资源未加载；此时`DOM`已经就绪，此时查找`DOM`节点，初始化请求
2. `load`--浏览器完成页面加载；此时资源已经加载完成，可以获取CSS，图片等外部资源信息
3. `beforeunload/unload`--用户即将离开页面；`beforeunload`:用户正在离开，此时可以检查页面上诸如表单之类的是否要保存用于提示；`unload`：此时可以发送数据
# 脚本异常
# 请求异常
# 代码逻辑异常
# `source-map`解析
# 网络切换异常
``` javascript
    window.addEventListener('offline', this.eventHandle);
    window.addEventListener('online', this.eventHandle);
```
# 页面`visibility`
# 日志合并上报
## 合并数据上报
> 在`unload`或者`beforeunload`的时候发送同步请求
``` javascript
window.addEveneListener('unload', logData, false)

function logData() {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/log', false)
    xhr.send(data)
}
```
同步发送`xhr`请求的时候会导致页面在跳转的时候出现延迟
异步会导致页面的请求无法正常发送。用户代理提前跳转

`navigator.sendBecon(url, data)`

1. 非阻塞`POST`请求
2. 返回值`true`or`false`

## 资源隔离
业务代码和上报的域名隔离





