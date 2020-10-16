// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"LinkList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LinkListNode =
/*#__PURE__*/
function () {
  function LinkListNode() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, LinkListNode);

    this.element = element;
    this.next = next;
  }

  _createClass(LinkListNode, [{
    key: "toString",
    value: function toString() {
      return this.element.toString();
    }
  }]);

  return LinkListNode;
}();
/**
 * @desc 增删改查的时间复杂度O{n}，因为都对整个链表进行了遍历
 *
 * @export
 * @class LinkList
 */


var LinkList =
/*#__PURE__*/
function () {
  function LinkList() {
    _classCallCheck(this, LinkList);

    this.dummyHead = new LinkListNode(null, null);
    this.size = 0;
  }

  _createClass(LinkList, [{
    key: "getSize",
    value: function getSize() {
      return this.size;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.size === 0;
    }
    /**
     *
     * @memberof LinkList 添加头节点
     */

  }, {
    key: "addHeadNode",
    value: function addHeadNode(element) {
      // const linkListNode = new LinkListNode(element, null);
      // linkListNode.next = this.head;
      // this.head = linkListNode;
      // this.size++;
      this.insertNode(0, element);
    }
    /**
     * @desc 通过循环让prev不断切换，最终指向目标节点的前一个节点
     * 使用虚拟头节点，这个节点不存储任何信息，不介入链表中的操作，仅仅充当链表的head
     * 插入过程中始终为node.next = dummyHead.next;dummyHead.next = node; 
     * @param {*} index 插入的位置
     * @param {*} element 插入的元素
     * @memberof LinkList 插入新的节点
     */

  }, {
    key: "insertNode",
    value: function insertNode(index, element) {
      if (index < 0 || index > this.size) {
        throw new Error('out of index');
      }

      var prev = this.dummyHead;

      for (var i = 0; i < index; i++) {
        prev = prev.next;
      }

      var linkListNode = new LinkListNode(element, null);
      linkListNode.next = prev.next;
      prev.next = linkListNode;
      this.size++;
    }
    /**
     *
     * @desc 插入链表尾部
     * @param {*} element
     * @memberof LinkList
     */

  }, {
    key: "innsertLast",
    value: function innsertLast(element) {
      this.insertNode(this.size, element);
    }
    /**
     *
     * @desc 获取当前索引值的元素
     * @param {*} index 索引值
     * @returns 当前元素
     * @memberof LinkList
     */

  }, {
    key: "get",
    value: function get(index) {
      if (index < 0 || index >= this.size) {
        throw new Error('out of index');
      }

      var node = this.dummyHead.next; // 当前头节点（dummyHead并不是实际的节点）

      for (var i = 0; i < index; i++) {
        node = node.next;
      }

      return node.element;
    }
  }, {
    key: "getFirst",
    value: function getFirst() {
      return this.get(0);
    }
  }, {
    key: "getLast",
    value: function getLast() {
      return this.get(this.size - 1);
    }
    /**
     *
     * @desc 修改节点
     * @param {*} index
     * @param {*} element
     * @memberof LinkList
     */

  }, {
    key: "set",
    value: function set(index, element) {
      if (index < 0 || index > this.size) {
        throw new Error('out of index');
      } // 第一个真实节点


      var node = this.dummyHead.next;

      for (var i = 0; i < index; i++) {
        node = node.index;
      }

      node.element = element;
    }
    /**
     *
     * @desc 判定元素是否在链表中
     * @param {*} element
     * @returns {boolean}
     * @memberof LinkList
     */

  }, {
    key: "include",
    value: function include(element) {
      var node = this.dummyHead.next;

      for (; node.next !== null;) {
        if (node.element === element) {
          return true;
        }

        node = node.next;
      }

      return false;
    }
  }, {
    key: "remove",
    value: function remove(index) {
      if (index < 0 || index > this.size) {
        throw new Error('out of index');
      }

      var prev = this.dummyHead;

      for (var i = 0; i < index; i++) {
        prev = prev.next;
      }

      var delNode = prev.next;
      prev.next = delNode.next;
      var element = delNode.element;
      delNode = null;
      this.size--;
      return element;
    }
  }, {
    key: "removeFirst",
    value: function removeFirst() {
      return this.remove(0);
    }
  }, {
    key: "removeLast",
    value: function removeLast() {
      return this.remove(this.size - 1);
    }
  }, {
    key: "reserve",
    value: function reserve(list) {
      // if (list === null || list.next === null) return list
      var prev = null;
      console.log(list);
      var curr = list;

      while (curr) {
        var temp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = temp;
      }

      return prev;
    }
  }, {
    key: "toString",
    value: function toString() {
      var linkInfo = "----LinkList:---- <br /> size: ".concat(this.getSize(), " <br />");
      linkInfo += "head [";
      var node = this.dummyHead.next; // for (;node.next !== null;) {
      //     console.log('aaaaaaaaaaaaaaaaaa', node.element);
      //     linkInfo += `${node.element}->`;
      //     node = node.next;
      // }

      var a = [2, 4, 3];

      for (var i = 0; i < a.length; i++) {
        this.insertNode(i, a[i]); // console.log(linkList.toString());
      }

      this.reserve(node);
      console.log('-=-=', this.reserve(node));

      while (node.next !== null) {
        linkInfo += "".concat(node.element, "->");
        node = node.next;
      }

      linkInfo += "".concat(node.element, "->NULL] tail");
      document.body.innerHTML = "".concat(linkInfo, "<br />");
      return linkInfo;
    }
  }]);

  return LinkList;
}();

exports.default = LinkList;
},{}],"Main.js":[function(require,module,exports) {
"use strict";

var _LinkList = _interopRequireDefault(require("./LinkList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Main =
/*#__PURE__*/
function () {
  function Main() {
    _classCallCheck(this, Main);

    this.showHeader('LinkList');
    var linkList = new _LinkList.default(); // let linkList2 = new LinkList();

    var a = [2, 4, 3]; // const b = [5, 6, 4]
    // a.map(item => {
    //     linkList1.addHeadNode(item)
    // })
    // b.map(item => {
    //     linkList2.addHeadNode(item)
    // })

    for (var i = 0; i < a.length; i++) {
      linkList.insertNode(i, a[i]); // console.log(linkList.toString());
    } // 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
    // linkList.insertNode(0, 2);
    // linkList.remove(3)
    // this.showContent(linkList.toString())
    // this.reserve(linkList)
    // console.log(linkList.next)


    this.showContent(linkList.toString()); // this.showContent(linkList2.toString())
    // console.info(linkList.toString());
  }

  _createClass(Main, [{
    key: "reserve",
    value: function reserve(list) {
      var curr = list;
      var prev = null;

      while (curr) {
        var temp = curr.next;
        curr = prev;
        prev = temp;
      }

      return prev;
    }
  }, {
    key: "showContent",
    value: function showContent(content) {
      document.body.innerHTML += "".concat(content, "\n\n");
    }
  }, {
    key: "showHeader",
    value: function showHeader(title) {
      console.info("--------------------".concat(title, "----------------------"));
      document.body.innerHTML += "".concat(title, " <br />");
    }
  }]);

  return Main;
}();

window.onload = function () {
  new Main();
};
},{"./LinkList":"LinkList.js"}],"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62452" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","Main.js"], null)
//# sourceMappingURL=/Main.edc4ea10.js.map