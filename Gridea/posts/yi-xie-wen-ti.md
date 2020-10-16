---
title: '一些问题'
date: 2020-05-22 18:13:19
tags: [一些问题]
published: true
hideInList: false
feature: 
isTop: false
---

### 关于非受控组件在异步操作中变更defaultValue信息的解决方案
>> 可以增加一个key值


### 正则:
>> 手机号：`/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/`

> fontSize会导致div所占实际区块变大（在inspector中无法找到，但是实际中是会覆盖掉其他div）



### 代码执行顺序：
> `macrotasks: setTimeout, setInterval, setImmediate, I/O, UI rendering`

> `microtasks: process.nextTick, Promises, Object.observe(废弃), MutationObserver`


> 同步代码——>microTask——>macroTask
>> eg: `https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/`

> iOS问题   
>> `text-decoration-line: line-through;` -> `text-decoration: line-through;`


### 列表中的两种组件，排版出错
>> `vertical-align: top;`

### React-Router

> 嵌套路由中次级路由无法生效， 确认一级路由与次级路由的衔接是否使用了`exact={true}`


### 页面中的请求数据处理

> 1. 判断是否需要这个请求的条件，如果某个条件不满足，则不会去请求，如果满足发起请求
> 2. 返回数据校验，防止数据出现`undefined`和`{}`, 的时候页面出现`TypeError`
> 3. 组件处理: 不满足条件的时候禁止渲染该组件

**解决方法**

> 在最外层使用统一的数据处理方法，确保进入组件中的数据是自己想要的，同时在最外层的处理方法中对数据的可用性进行兜底判别，如果是`null` || `undefined`，进行兜底处理，返回一个空对象`{}`,否则对数据进行处理

### `function`参数的边界值处理

> 对于函数传递的参数，在函数内部一定要进行处理，边界值`0`, `null`, `undefined`等，防止极端情况下出错

### iOS下fixed失效问题

> iOS上面使用`fixed`布局在唤起键盘的时候`fixed`布局的组件会失效。
> 解决方法： 对外层`div`设置
```
position: absolute;
width: 100%;
left: 0;
right: 0;
top: 0;
bottom: 0;
font-size: 0;
overflow-y: scroll;
-webkit-overflow-scrolling: touch;/* 解决ios滑动不流畅问题 */
```
> 让元素在内层`div`中滚动(不采用这种方式，页面是在`body`中滚动)

### canvas 失真

> 原因： 多发生在手机端，因为像素密度不一致导致失真

```
const getPixelRatio = function(context) {
    const backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};
```

### ReactDOM -> findDOMNode

> `findDOMNode(this).ownerDocument` 获取当前节点的HTML根节点


###　js数组（new Array）是稀疏数组，无法map

> `Array.apply(null, Array(n)).map(() => null)` // 初始化一个长度为N的数组并且赋值为null

**apply** 会将生成的稀疏数组展开并传给上面`Array`构造函数

```
Array(n) === [,,...,,]; // 只有长度
Array(null, ... , null)
```

> 上面的构造等于`new Array(n).fill(null)`

### `React.PureComponent`和`this.forceUpdate()`

> `React.PureComponent` 的 `shouldComponentUpdate()` 只会对对象进行浅对比。如果对象包含复杂的数据结构，它可能会因深层的数据不一致而产生错误的否定判断(表现为对象深层的数据已改变视图却没有更新)。当你期望只拥有简单的`props`和`state`时，才去继承 `PureComponent` ，或者在你知道深层的数据结构已经发生改变时使用 `forceUpate()` 。或者，考虑使用 不可变对象 来促进嵌套数据的快速比较！


### `Windows` `git`大小写不敏感

> `git config core.ignorecase false`
### 关于结构赋值与`null`的问题
``` javascript

const obj = {
    a: null,
    b: undefined,
}

const {
    a = [], b = {}
} = obj;
console.log(a, b);
```
> `node-sass`安装问题

>> 需要安装`python`和`c++`编译环境
>> `npm install --global --production windows-build-tools`

### 滚动条

> 
``` css
div::-webkit-scrollbar {
  /* 这里的宽是指竖向滚动条的宽，高是指横向滚动条的高*/      
  width: 16px;      
  height: 16px;      
  background: pink;    
}
div::-webkit-scrollbar-thumb {      
  border-radius: 10px;      
  background: 
  linear-gradient(red,orange);    
}
```

> 使用“&&”运算符的时候，如果两边的操作数有一个不是布尔类型，那么返回值不一定是布尔类型
  1. 有一个是`null`， 则返回`null`
  2. 有一个是`undefined`，则返回`undefined`
  3. 第一个是对象，则返回第二个，为true，则返回第二个，为false，则返回false  

> offsetWidth/offsetHeight
>> CSS width 属性值 + 左右 padding + 左右 border + 垂直滚动条宽度 = offsetWidth
>> CSS height 属性值 + 上下 padding + 上下 border + 水平滚动条高度 = offsetHeight

** 这里列出需要关注的重点：**

> * offsetWidth/offsetHeight 是只读属性，手动赋值虽不会报错，但也不会生效。所以，也就不能通过这两个属性动态的修改元素的宽高。
> * offsetWidth/offsetHeight 返回值总是整数，而不是精确的浮点数，四舍五入取整数。
若元素 display: none，那么 offsetWidth/offsetHeight 为 0。
> * offsetHeight 的值不包括伪元素的高度，例如 :before 和 :after。
若元素内部包含未清除浮动的子元素，那么将不包含这些浮动元素的宽高。


# React区分组件类型
> React的组件可以分为`ClassComponent`、`FunctionComponent`
> `ClassComponent`对应的`Element type`是`当前Class`自身，`FunctionComponent`对应的`Element type`是函数组件自身

``` javascript
AppClass instanceof Function === true
AppFunc instanceOf === true
```
> 通过引用类型是无法区分当前组件的`type`的
> 可以通过调用`ClassComponent`原型链的`isReactComponent`属性判断是否是`classComponent`

``` javascript
ClassComponent.prototype.isReactComponent = {}
```

# base64算法

> 使用`4字节`替换`3字节`,文件大小会增长**1.33**