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
})({"Array-#1/utils/ErrorConstants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ARRAY_ERROR = void 0;
var ARRAY_ERROR = {
  'ARRAY_CAPACITY_ERROR': 'ADD_ERROR--Array is full',
  'INSERT_INDEX_ERROR': 'INSERT_INDEX_ERROR--Array out of bounds',
  'GET_ERROR': 'GET_ERROR--Array out of bounds',
  'SET_ERROR': 'SET_ERROR--Array out of bounds'
};
exports.ARRAY_ERROR = ARRAY_ERROR;
},{}],"Array-#1/NewArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ErrorConstants = require("./utils/ErrorConstants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @author Yuan
 * @description 复写数组
 * @class NewArray
 */
var NewArray =
/*#__PURE__*/
function () {
  // 构造默认的数组大小
  function NewArray() {
    var capacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

    _classCallCheck(this, NewArray);

    // this.arr = Array.apply(null, Array(capacity)).map(_ => null);
    this.arr = new Array(capacity);
    this.size = 0;
  } // 获取当前数组大小


  _createClass(NewArray, [{
    key: "getSize",
    value: function getSize() {
      return this.size;
    }
    /**
     *
     * @returns 数组大小 --> 数组的容量（非实际的大小）
     * @memberof NewArray
     */

  }, {
    key: "getCapacity",
    value: function getCapacity() {
      return this.arr.length;
    }
    /**
     * @desc 数组判空
     *
     * @returns {Boolean}
     * @memberof NewArray
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.size === 0;
    }
    /**
     * @desc 数组扩容，仅容量{capacity}；与数组的实际大小无关
     *
     * @param {*} capacity
     * @memberof NewArray
     */

  }, {
    key: "resize",
    value: function resize(capacity) {
      var newArray = new Array(capacity);

      for (var i = 0; i < this.size; i++) {
        // 将旧的数组放入新的数组中
        newArray[i] = this.arr[i];
      }

      this.arr = newArray;
    }
    /**
     * @desc 插入元素
     *
     * @param {*} index 需要插入的索引
     * @param {*} val 需要插入的元素
     * @memberof NewArray
     */

  }, {
    key: "insert",
    value: function insert(index, val) {
      // 判满
      if (this.size === this.getCapacity()) {
        // throw new Error(ARRAY_ERROR.ARRAY_CAPACITY_ERROR);
        this.resize(this.size * 2);
      } // index是否符合要求


      if (index < 0 || index > this.size) {
        throw new Error(_ErrorConstants.ARRAY_ERROR.INSERT_INDEX_ERROR);
      }

      for (var i = this.size - 1; i >= index; i--) {
        this.arr[i + 1] = this.arr[i];
      }

      this.arr[index] = val;
      this.size++;
    } // 前方插入

  }, {
    key: "unshift",
    value: function unshift(val) {
      this.insert(0, val);
    } // 后方插入

  }, {
    key: "push",
    value: function push(val) {
      this.insert(this.size, val);
    } // 添加元素

  }, {
    key: "add",
    value: function add(val) {
      // 判满 && 扩容
      if (this.size === this.getCapacity()) {
        this.resize(this.size * 2); // throw new Error(ARRAY_ERROR.ARRAY_CAPACITY_ERROR);
      }

      this.arr[this.size] = val;
      this.size++;
    }
    /**
     * @desc 获取指定位置元素
     *
     * @param {*} index
     * @returns 返回该索引对应的元素
     * @memberof NewArray
     */

  }, {
    key: "get",
    value: function get(index) {
      if (index < 0 || index > this.size) {
        throw new Error(_ErrorConstants.ARRAY_ERROR.GET_ERROR);
      }

      return this.arr[index];
    }
    /**
     * @desc 重置某个索引的元素
     *
     * @param {*} index
     * @param {*} val
     * @memberof NewArray
     */

  }, {
    key: "set",
    value: function set(index, val) {
      if (index < 0 || index >= this.size) {
        throw new Error(_ErrorConstants.ARRAY_ERROR.SET_ERROR);
      }

      this.arr[index] = val;
    }
    /**
     *
     * @desc 包含元素
     * @param {*} val 传入元素
     * @returns 如果arr中包含该元素，则返回true
     * @memberof NewArray
     */

  }, {
    key: "include",
    value: function include(val) {
      for (var i = 0; i < this.size; i++) {
        if (val === this.arr[i]) {
          return true;
        }
      }

      return false;
    }
    /**
     *
     * @desc 查找元素
     * @param {*} val 传入元素
     * @returns 如果包含该元素，则返回元素的索引，否则返回-1(仅返回第一个匹配的位置)
     * @memberof NewArray
     */

  }, {
    key: "find",
    value: function find(val) {
      for (var i = 0; i < this.size; i++) {
        if (val === this.arr[i]) {
          return i;
        }
      }

      return -1;
    }
    /**
     * @desc 批量查找数组中的相同元素
     *
     * @param {*} val
     * @returns 元素在数组中的位置所组成的数组
     * @memberof NewArray
     */

  }, {
    key: "findAll",
    value: function findAll(val) {
      var newArray = new NewArray(this.size);

      for (var i = 0; i < this.size; i++) {
        if (this.arr[i] === val) {
          newArray.push(i);
        }
      }

      return newArray;
    }
    /**
     * @desc 删除索引元素
     * @todo 被删除元素会以undefined填充
     * @param {*} index 传入需要删除的索引
     * @returns 返回被删除的元素
     * @memberof NewArray
     */

  }, {
    key: "remove",
    value: function remove(index) {
      console.log('rmove', index, this.size);

      if (index < 0 || index >= this.size) {
        throw new Error(_ErrorConstants.ARRAY_ERROR.DELETE_INDEX);
      }

      var element = this.arr[index]; // index后面的元素覆盖前面的元素

      for (var i = index; i < this.size - 1; i++) {
        this.arr[i] = this.arr[i + 1];
      }

      this.size--; // 最后一位置空

      this.arr[this.size] = null; // 缩容

      if (Math.floor(this.getCapacity() / 4) === this.size && Math.floor(this.getCapacity() / 2 !== 0)) {
        this.resize(Math.floor(this.getCapacity() / 2));
      }

      return element;
    } // 删除数组中第一个元素

  }, {
    key: "shift",
    value: function shift() {
      return this.remove(0);
    } // 删除数组中最后一个元素

  }, {
    key: "pop",
    value: function pop() {
      return this.remove(this.size - 1);
    }
    /**
     * @desc 根据元素删除
     * @returns 返回被删除的元素
     * @param {*} val
     * @memberof NewArray
     */

  }, {
    key: "removeElement",
    value: function removeElement(val) {
      var index = this.find(val);

      if (index !== -1) {
        this.remove(index);
      }
    }
  }, {
    key: "removeAllElement",
    value: function removeAllElement(val) {
      // const indexArr = this.findAll(val);
      var index = this.find(val);

      while (index !== -1) {
        this.remove(index); // 循环找下一个符合条件的元素

        index = this.find(val);
      }
    }
    /**
     * @desc 获取数组信息
     *
     * @returns 返回数组信息
     * @memberof NewArray
     */

  }, {
    key: "toString",
    value: function toString() {
      var arrInfo = "Array: size-->".concat(this.getSize(), ", capacity-->").concat(this.getCapacity(), " \n");
      arrInfo += "data = [";

      for (var i = 0; i < this.size - 1; i++) {
        arrInfo += "".concat(this.arr[i], ",");
      }

      "]";
      arrInfo += "".concat(this.arr[this.size - 1], "]");
      document.body.innerHTML += "".concat(arrInfo, "<br />");
      return arrInfo;
    }
  }]);

  return NewArray;
}();

exports.default = NewArray;
},{"./utils/ErrorConstants":"Array-#1/utils/ErrorConstants.js"}],"Main.js":[function(require,module,exports) {
"use strict";

var _NewArray = _interopRequireDefault(require("./Array-#1/NewArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Main =
/*#__PURE__*/
function () {
  function Main() {
    _classCallCheck(this, Main);

    console.info('----init Array----');
    var arr = new _NewArray.default(10);

    for (var i = 0; i < 10; i++) {
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

  _createClass(Main, [{
    key: "showContent",
    value: function showContent(content) {
      document.body.innerHTML += "".concat(content, "<br />");
    }
  }]);

  return Main;
}();

window.onload = function () {
  new Main();
};
},{"./Array-#1/NewArray":"Array-#1/NewArray.js"}],"C:/Users/白泽/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58303" + '/');

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
},{}]},{},["C:/Users/白泽/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","Main.js"], null)
//# sourceMappingURL=/Main.edc4ea10.js.map