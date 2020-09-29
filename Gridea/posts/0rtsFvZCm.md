---
title: '秋天里的React--1'
date: 2020-09-20 16:27:10
tags: [React]
published: false
hideInList: false
feature: 
isTop: false
---

[toc]

<!-- 迫于无奈特意开了这个系列，遵照网上的一些资源加上自己的理解去深入的学习一下React -->


----

# 准备工作

1. 我们需要知道什么是虚拟DOM
2. 如何生成虚拟DOM

## 什么是虚拟DOM
> 我们都知道浏览器渲染一个页面是首先生成一棵DOM树，然后再渲染`css`,`js`；据此可知道，我们的虚拟DOM树实际上就是一个个具有固定格式的`js`对象
> ``` javascript
>  const treeObj = {
>   tag: 'div',
>   attrs: {
>       'className': 'test-class_title'
>   },
>   children: [
>       {
>           key: 'p',
>           attrs: {
>               className: 'test-class-children_title'
>           }
>           children: [
>               ...
>           ]
>       }
>   ]
> }
> ```
> 如上所述，通过这个一个简单的对象就能渲染出一个真实的DOM，其中`p`标签实际上是`div`的一个子元素，真实节点描述如下：
> ``` javascript
> <div className='test-class_title'>
>   <p className='test-class-children_title'></p>
> </div>
> ```

## 如何生成一棵`DOM`树
> 这一切的基准点都是从`Babel`的
>  1. 首先需要把代码抽象成一棵抽象语法树（`AST`）
>  2. 然后去解析
>  3. 生成浏览器可识别的代码（`js`） 
**这里以`React`代码举一个例子:**
> ``` javascript
> class App extends React.Component {
>   render() {
>       return <div>div</div>
>   }
> }
> ```
> 这段代码最终会被编译成：[Babel](https://www.babeljs.cn/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAECCAO9oFMAeAXZA7AJjASsmMOgHQDCA9gLbyVbboDeAUAJABO2OyHAFAEpW0EdC7oArhyzQAPDgCWANwB8ipbID06lS1HQAviyMsgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact&prettier=false&targets=&version=7.5.5&externalPlugins=)
> ``` javascript
> ...
> _createClass(App, [{
>   key: 'render',
>   value: function render() {
>       return React.createElement('div', null, 'div')
>   }
> }])
> ... // 省略
> ```
> 从这里我们可以看出来`return <div>div</div>`经过解析以及`babel`的转换之后变成了`return React.createElement('div', null, 'div')`
> 
### 如何转换
> 由上文可知，代码最终被转换为`React.createElement()`这种方式，可以在全局挂载一个`React`对象，将`createElement`挂载在`React`下面
> ``` javascript
> const React = {}
> React.createElement = function(tag, attrs, ...children) {
>   return {
>       tag,
>       attrs,
>       children
>   }
> }
> export default React
> ```

