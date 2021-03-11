function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}

!function (global, factory) {
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.Notice = factory());
}(void 0, function () {
    "use strict";

    //初始化消息容器 （总容器）
    var noticeBox = cDom({
        className: 'notice-container'
    });

    //生成消息盒子dom函数
    function cDom(args, children) {
        var el = document.createElement('div');
        for (var key in args) {
            var element = args[key];
            //添加class名
            if (key === 'className') {
                key = 'class';
                el.setAttribute(key, element);
            }
            //_开头代表添加事件监听
            else if (key[0] == '_') {
                el.addEventListener(key.slice(1), element);
            }
        }
        //string （值）
        if (typeof children == 'string') {
            el.innerHTML = children;
        }
        //dom （单个）
        else if (_typeof(children) == 'object' && children.tagName) {
            el.appendChild(children);
        }
        //dom集合 （数组）
        else if (_typeof(children) == 'object' && children.length) {
            for (var i = 0, len = children.length; i < len; i++) {
                var item = children[i];
                el.appendChild(item);
            }
        }
        return el;
    }

    //移除dom节点
    function removeChild(el) {
        el && el.parentNode.removeChild(el);
    }

    //添加css样式
    function css(el, css) {
        for (var key in css) {
            el.style[key] = css[key];
        }

        if (el.getAttribute("style") === "") {
            el.removeAttribute("style");
        }
    }

    //添加class
    function addClass(el, s) {   
        var c = el.className || "";

        if (!hasClass(c, s)) {
            var arr = c.split(/\s+/);
            arr.push(s);
            el.className = arr.join(" ");
        }
    }

    //判断是否有class
    function hasClass(c, s) {
        return c.indexOf(s) > -1 ? !0 : !1;
    }

    //移除class
    function removeClass(el, s) {
        var c = el.className || "";

        if (hasClass(c, s)) {
            var arr = c.split(/\s+/);
            var i = arr.indexOf(s);
            arr.splice(i, 1);
            el.className = arr.join(" ");
        }

        if (el.className === "") {
            el.removeAttribute("class");
        }
    }

    //默认配置
    var defaultOption = {
        title: '', //标题
        dec: '',   //描述
        duration: 2000, //持续事件
        showClose: false //是否显示关闭按钮
    };

    //消息体（入口）
    var myMessage = {
        show: function (option) {
            initOption(option, "notice");
        }
    };

    //初始化配置信息
    function initOption(option, type) {
        var args = {};
        for (var key in defaultOption) {
            args[key] = defaultOption[key];
        }
        args = Object.assign({}, defaultOption, option);
        args.type = type;
        return createNoticeEl(args);
    }

    //创建消息
    function createNoticeEl(args) {
        var type = args.type,
            duration = args.duration,
            title = args.title,
            dec = args.dec,
            showClose = args.showClose || false,
            onComplete = args.complete,
            onClose = args.close;

        var closeable = duration === 0;

        var el = cDom(
            {
                className: 'notice-box',
                _click: function () {
                    onComplete && onComplete();
                }
            },
            [
                cDom(
                    { className: 'notice-inner notice-inner-fadein' },
                    [
                        cDom(
                            { className: 'notice-inner-content' },
                            [
                                cDom(
                                    { className: 'notice-inner-content-title' },
                                    '<div title=\"' + title + '\">' + title + '</div>'
                                ),
                                cDom(
                                    { className: 'notice-inner-content-dec' },
                                    dec
                                )
                            ]
                        ),
                        cDom(
                            {
                                className: 'notice-inner-close',
                                _click: function (e) {
                                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                                    closeNotice(el, onClose);
                                }
                            },
                            '<img src="./images/close.png" />'
                        )
                    ]
                )
            ]
        );

        if (!noticeBox.children.length) {
            document.body.appendChild(noticeBox);
        }
        // noticeBox.appendChild(el);
        noticeBox.insertBefore(el, noticeBox.firstChild);
        if(duration>0){
            setTimeout(function(){
                closeNotice(el, onClose);
            }, duration+400);
        }
    }

    //关闭消息
    function closeNotice(el, cb) {
        if (!el) return;
        addClass(el.children[0], "notice-inner-fadeout");
        cb && cb();
        setTimeout(function () {
            if (!el) return;
            var has = false;
            for (var i = 0; i < noticeBox.children.length; i++) {
                if (noticeBox.children[i] === el) {
                    has = true;
                }
            }
            has && removeChild(el);
            el = null;
            if (!noticeBox.children.length) {
                has && removeChild(noticeBox);
            }
        }, 700);
    }

    //暴露消息体
    return myMessage;
});