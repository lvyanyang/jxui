/**
 * 对话框组件
 */

//region dialog函数扩展

jx.extend({
    /**
     * 警告框
     * @param msg 消息内容或者配置选项
     * @param callback 回调函数
     */
    alert: function (msg, callback) {
        var ops = {
            title: '系统提示',
            skin: 'jxnav-layer',
            icon: 0
        };
        if (jx.isObj(msg)) {
            $.extend(ops, msg);
        }
        else {
            ops.content = msg;
        }

        if (jx.isFunc(callback)) {
            ops.yes = callback;
        }
        return top.layer.open(ops);
    },

    /**
     * 确认框
     * @param msg 消息内容或者配置选项
     * @param callback 回调函数
     */
    confirm: function (msg, callback) {
        var ops = {
            title: "系统提示",
            skin: 'jxnav-layer',
            icon: 7,
            btn: ['确定', '取消']
        };
        if (jx.isObj(msg)) {
            $.extend(ops, msg);
        }
        else {
            ops.content = msg;
        }
        if (jx.isFunc(callback)) {
            ops.yes = function (index) {
                callback(true, index);
                top.layer.close(index);
            };
            ops.btn2 = function (index) {
                callback(false, index)
            };
        }
        return top.layer.open(ops);
    },

    /**
     * 信息框
     * @param msg 消息内容或者配置选项
     * @param icon 图标
     * @param callback 回调函数
     */
    msg: function (msg, icon, callback) {
        var ops = {
            icon: icon || -1,
            time: 4000,
            anim: 5,
            maxWidth: top.window.outerWidth - 500
        };
        if (jx.isObj(msg)) {
            $.extend(ops, msg);
        }
        else {
            ops.content = msg;
        }
        if (jx.isFunc(icon)) {
            callback = icon;
            ops.icon = -1;
        }

        return top.layer.msg(ops.content, ops, callback);
    },

    /**
     * 输入框
     * @param options 标题
     * @param callback 回调函数
     */
    prompt: function (options, callback) {
        return top.layer.prompt(options, callback);
    },

    /**
     * 打开窗口
     * @param options
     */
    dialog: function (options) {
        var ops = {
            scrollbar: false,
            moveOut: false,
            fixed: false,
            closeBtn: 1,
            shade: 0.1,
            type: 1, // 0信息框 1页面层 2iframe层 3加载层 4tips层
            resize: false,
            skin: 'jxdialog-layer',
            callback: false,
            btnFont: ['fa fa-save', 'fa fa-sign-in'],
            area: ['50%', '50%'],
            title: '  '
        };
        $.extend(ops, options);
        //iframe层
        if (ops.url) {
            ops.type = 2;
        }
        if (ops.type == 2) {
            if (!ops.url) {
                console.log('请指定对话框Url');
                return;
            }
            if (jx.isObj(ops.params)) {
                $.each(ops.params, function (k, v) {
                    ops.url = jx.setUrlParam(ops.url, k, v);
                });
            }
            ops.url = jx.setUrlParam(ops.url, '_', Date.now());
            ops.content = ops.url;
        }

        //随机动画
        if (!ops.anim) {
            ops.anim = jx.randomNumber(0, 6);
        }
        var wunit, _w_width;
        var hunit, _w_height;
        //把百分比转换为像素值
        if (ops.width) {
            wunit = ops.width.toString().indexOf('%') === -1 ? 'px' : '%';
            _w_width = $(top.window).width();
            if (wunit === '%') {
                ops.width = _w_width * parseInt(ops.width) / 100;
            }
        }

        if (ops.height) {
            hunit = ops.height.toString().indexOf('%') === -1 ? 'px' : '%';
            _w_height = $(top.window).height();
            if (hunit === '%') {
                ops.height = _w_height * parseInt(ops.height) / 100;
            }
        }

        //处理宽高
        if (ops.width) {
            wunit = ops.width.toString().indexOf('%') === -1 ? 'px' : '%';
            _w_width = $(top.window).width();
            var _width = 0;
            if (wunit === '%') {
                _width = 100 > parseInt(ops.width) ? parseInt(ops.width) : 100;
            }
            else {
                _width = _w_width > parseInt(ops.width) ? parseInt(ops.width) : _w_width;
            }
            ops.area = _width + wunit;
            if (ops.height) {
                hunit = ops.height.toString().indexOf('%') === -1 ? 'px' : '%';
                _w_height = $(top.window).height();
                var _height = 0;
                if (hunit === '%') {
                    _height = 100 > parseInt(ops.height) ? parseInt(ops.height) : 100;
                }
                else {
                    _height = _w_height > parseInt(ops.height) ? parseInt(ops.height) : _w_height;
                }
                ops.area = [_width + wunit, _height + hunit];
            }
        }

        //处理按钮
        if (ops.btnFont && ops.btn && !ops.btnRender) {
            ops.btnRender = true;
            if (jx.isArray(ops.btn) && jx.isArray(ops.btnFont)) {
                for (var i = 0; i < ops.btn.length; i++) {
                    var btn = ops.btn[i];
                    var font = ops.btnFont[i];
                    if (font && ops.btn[i].indexOf('fa') === -1) {
                        ops.btn[i] = '<i class="' + font + '"></i> ' + btn;
                    }
                }
            }
            else if (ops.btn.indexOf('fa') === -1) {
                ops.btn = '<i class="' + ops.btnFont + '"></i> ' + ops.btn;
            }
        }

        ops.before = function (layero, index) {
            layero.mask(ops.maskMsg || ('正在加载' + ops.title || '' + ',请稍等...'), ops.maskDelay || 100);

            if (options.before) {
                options.before(layero, index);
            }
        };

        ops.success = function (layero, index) {
            layero.unmask();
            var dwin = ops.type == 2 ? layero.find('iframe')[0].contentWindow : window;
            dwin.pwin = window;
            dwin.$layer = layero;
            dwin.$index = index;

            if (ops.type == 2 && ops.title && !ops.title.trim()) {
                ops.title = top.layer.getChildFrame('title', index).text();
                top.layer.title(ops.title, index);
            }

            if (options.success) {
                options.success(layero, index);
            }
        };

        if (ops.callback) {
            ops.yes = function (index, layero) {
                var dwin = ops.type == 2 ? layero.find('iframe')[0].contentWindow : window;
                var result = ops.callback(dwin, layero, index);
                if (result === true) {
                    top.layer.close(index);
                }
            }
        }
        if (jx.debug) {
            console.log('dialog选项:%o', ops);
        }
        return top.layer.open(ops);
    },

    /**
     * ajax请求失败
     * @param result
     */
    ajaxFail: function (result) {

        var title = result.statusText + '(' + result.status + ')';
        if (!result.responseJSON) {
            try {
                if (result.responseText) {
                    var r = $.parseJSON(result.responseText);
                    if (r) {
                        top.layer.alert(r.message, {title: title});
                    }
                }
                else if (result.status === 0) {
                    jx.alert('无法连接到服务器,请及时通知系统管理员!');
                }
            } catch (e) {
                top.layer.open({
                    type: 1,
                    // skin: 'layui-layer-rim',
                    area: [($(top.window).width() / 3 * 2) + 'px', ($(top.window).height() - 100) + 'px'],
                    title: title,
                    btn: '关闭',
                    content: jx.getBody(result.responseText)
                });
            }
        }
        else {
            top.layer.alert(result.responseJSON.msg, {title: title});
        }
    },

    /**
     * 关闭对话框
     * @param {number} index 对话框索引
     */
    closeDialog: function (index) {
        if (jx.isUndefined(index) && $index) {
            top.layer.close($index);
        }
        else {
            top.layer.close(index);
        }
    },

    /**
     * 关闭所有对话框
     */
    closeAllDialog: function () {
        top.layer.closeAll();
    },

    dialogSaveBtn: ['<i class="fa fa-save"></i> 保存', '<i class="fa fa-sign-in"></i> 关闭']
});

//endregion

//dialog插件实现类
jx.ui.Dialog = function (element, options) {
    var $element = $(element);
    var index = -1;
    var $layer = null;

    /**
     * 显示对话框
     */
    var show = function () {

        //region beforeshow 事件
        var e = $.Event('beforeshow');
        $element.triggerHandler(e);
        if (e.result === false) {
            return;
        }
        //endregion

        options.success = function (layero, index) {
            $layer = layero;
            //region aftershow 事件
            $element.triggerHandler('aftershow', [layero, index]);
            //endregion
        };

        options.cancel = function (index, layero) {
            //region beforeclose 事件
            var e = $.Event('beforeclose');
            $element.triggerHandler(e, [layero, index]);
            return e.result;
            //endregion
        };

        options.end = function () {
            //region afterclose 事件
            $element.triggerHandler('afterclose');
            //endregion
        };

        index = jx.dialog(options);
    };

    /**
     * 关闭对话框
     */
    var close = function () {
        var isClose = options.cancel && options.cancel(index, $layer);
        isClose === false || jx.closeDialog(index);
    };

    // //初始化插件
    // var init = function () {
    //
    // }();

    return {
        /**
         * 显示对话框
         */
        show: function () {
            show();
        },
        /**
         * 关闭对话框
         */
        close: function () {
            return close();
        }
    }
};

//插件定义
jx.plugin({
    name: 'jxdialog',
    auto: false,
    create: jx.ui.Dialog,
    options: function (element) {
        return jx.parseOptions($(element), ['url', 'title',
            {resize: 'boolean', width: 'number', height: 'number'}
        ]);
    },
    defaults: {
        /**
         * 是否允许浏览器出现滚动条
         */
        scrollbar: false,

        /**
         * 是否允许拖拽到窗口外
         */
        moveOut: false,

        /**
         * 固定,鼠标滚动时，层是否固定在可视区域
         */
        fixed: false,

        /**
         * 关闭按钮
         */
        closeBtn: 1,

        /**
         * 遮罩
         */
        shade: 0.1,

        /**
         * 是否点击遮罩关闭
         */
        shadeClose: false,

        /**
         * 自动关闭所需毫秒
         */
        time: 0,

        /**
         * 窗口关闭时显示动画
         */
        isOutAnim: true,

        /**
         * 是否显示最大最小化。
         */
        maxmin: false,

        /**
         * 是否允许拉伸
         */
        resize: false,

        /**
         * 按钮排列 l/c/r
         */
        btnAlign: 'r',

        /**
         * 加载地址
         */
        url: null,
        width: '100%', //宽度
        height: '100%' //高度
    }
});

//实例化
$(document).on('click', '.jxdialog', function (e) {
    jx.stope(e);
    $(this).jxdialog().show();
});