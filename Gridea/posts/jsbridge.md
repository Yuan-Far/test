---
title: 'JSBridge'
date: 2019-09-29 12:06:38
tags: []
published: false
hideInList: false
feature: 
---
<!--以Android为例-->

# `WebView`
## 在`Android`中的定义
* `BPWebBridge`: 定义方法
    > 暴露给`bridge`的方法
    > 定义`handler`在子线程调用完成之后，触发`UI`线程的渲染
* `BPWebUIRouter`: 定义调用模块
    > 设置前端调用的命令字以及前端调用原生的业务逻辑
    > 定义参数类型

## 在前端的定义
* 从前端全局暴露的`WebViewJavascriptBridge`属性入手，这个属性中包含了四个对象：
  ``` javascript
  window.WebViewJavascriptBridge = {
        callHandler: callHandler,
        hasHandler: hasHandler,// 可删除
        // ——new api——————————————————————————————————————————
        registerHandler: registerHandler,
        hasRegisteredHandler: hasRegisteredHandler
        // ————————————————————————————————————————————————
    };
  ```

  参照客户端代码和前端的一些定义方法
  ``` java
  @JavascriptInterface
    public boolean hasHandler(final String cmd) {
        // todo
    }

    @JavascriptInterface
    public void send(final String cmd, String data, final String callback) {
        // todo
    }
  ```
  可以看到客户端通过注解（`JavascriptInterface`）将`send`和`hasHandler`方法与前端进行了关联，这个时候前端通过调用`hasHandler`实际上是走到了原生的调用方法，前端的定义是无效的。
  也就是说通过`window.WebViewJavascriptBridge.xxx`的方式向外部暴露的属性全部都是在前端所定义的。
* 接下来分析一下看一下`window.bridge`中定义的方法
``` java 
private static final String BRIDGE_RESULT_BACK_TEMPLATE =
            "javascript: window.bridge.onReceive(\'%1$s\', \'%2$s\');";

private static final String BRIDGE_CALL_TEMPLATE =
            "javascript: window.bridge.call(\'%1$s\', \'%2$s\', \'%3$s\');";

```
可以看到`onRecieve`和`call`方法是通过客户端内部封装的方法注入到`js`里面的，同时定义了传入的参数个数

## `callHandler`调用过程

![](/post-images/1570613811174.png)
上面的图展示了从前端到客户端的调用过程，
* 前端通过`callHandler`方法调用了`window.bridge.send`方法<FE>
* `window.bridge.send`通过触发`BPWebUIRouter.handleCmd`触发命令字的调用<BPWebBridge>
* `BPWebUIRouter.handleCmd`方法调用示例`showToast(bridge, data, callback);`可以看出来实际上传入的是一个`bridge`,而这个`bridge`就是上文中的`BPWebViewBridge`
``` java
private static void showToast(BPWebBridge bridge, JSONObject data, String callback) {
        String msg = data.optString(KEY_MSG, "");
        if (TextUtils.isEmpty(msg)) {
            return;
        }
        BBToastManager.getInstance().show(msg);
        bridge.sendResultBack(callback, new BPBaseWebResult(RESULT_CODE.RESULT_SUCCESS));
    }
```
* 以`showToast`方法的调用为示例进行分析，可以看到在`BPWebUIRouter`中最终的调用还是到了`BPWebviewBridge`中，最终调用的方法就是`sendResultBack`
* 在`sendResultBack`中通过`webview.loadUrl`进行了拦截
``` java
public void sendResultBack(final String callback, final BPBaseWebResult result) {
        Handler webViewHandler = webView.getHandler();
        if (webViewHandler != null) {
            webViewHandler.post(() -> {
                String js =
                        String.format(BRIDGE_RESULT_BACK_TEMPLATE, callback, result.toDataString());
                BBAppLogger.i("send result back: %1$s", js);
                webView.loadUrl(js);
            });
        }
    }
```
通过上文可以知道`BRIDGE_RESULT_BACK_TEMPLATE`是一个注入的对象--->`window.bridge.onReceive`,接下来回到`onReceive`方法，看看它做了什么
* 在`onReceive`中主要通过是否传递`callbackId`，来判断是`js`调用客户端，或者是客户端调用`js`
``` javascript
window.bridge.onReceive = function (callbackId, result) {
			var resultObj = {};
			try {
				resultObj = JSON.parse(result);
			} catch (ex) {}

			/**
			 * 1，如果是客户端的回调，会带上 callbackId
			 * 2，如果是客户端的主动调用，callbackId传''空串，resultObj会存在handlerName标识，由JS来处理handler的调用
			 */
			if (callbackId) {
				callbacks[callbackId](resultObj);
				delete callbacks[callbackId];
			} else if (resultObj.handlerName) {
				var handler = messageHandlers[resultObj.handlerName];
				if (typeof handler === 'undefined') return;

				for (var i = 0; i < handler.length; i++) {
					try {
						delete resultObj.handlerName;
						handler[i](resultObj);
					} catch (exception) {
						if (typeof console != 'undefined') {
							console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", resultObj, exception);
						}
					}
				}
			}
		};
```
## `regristerHandler` 调用流程
<!--以onSelectContact为例-->
* 先给出调用示例图
![](/post-images/1570620158840.png)
可以看出一共涉及了三个流程：
* 在客户端中注册`EventBus`
``` java
  EventBus.getInstance().register(EventConst.MERCHANT_OAUTH.OAUTH_VERIFY, mOnOAuthVerifiedResult);
```
* 在前端注册一个方法
``` java
onSelectContact: registerHandlerWrapper('onSelectContact'),
```
* `EventBus`去监听这个方法
``` java
registerActivityForResultCallback(BPNavigationHelper.REQUEST_CHOOSE_CONTACT, (resultCode, data) -> {
            if (resultCode == RESULT_OK) {
                String number = data.getStringExtra(
                        BPPickPhoneContactView.KEY_CONTACT_NUMBER);
                String name = data.getStringExtra(BPPickPhoneContactView.KEY_CONTACT_NAME);
                mBridge.callHandler(new BPGetContactsInfoWebCall(BPWebUIRouter.RESULT_CODE.RESULT_SUCCESS, BPWebUIRouter.CALL_H5_HANDLE_NAME.HANDLER_NAME_ON_SELECT_CONTACTS, name, number).toDataString());
```
* 调用`BPWebBridge``callHandler`
``` java
public void callHandler(String data) {
        Handler webViewHandler = webView.getHandler();
        if (webViewHandler != null) {
            webViewHandler.post(() -> {
                String js =
                        String.format(BRIDGE_RESULT_BACK_TEMPLATE, "", data);
                BBAppLogger.i("send result back: %1$s", js);
                webView.loadUrl(js);
            });
        }
    }
```
* 后续的调用（`oReceive`）,看上面的代码

