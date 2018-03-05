/**
 * 定义单选/复选控件
 */
jx.ui.Check = function (element, options) {
    var $element = $(element);

    //初始化
    var init = function () {
        var _color = '';
        var color = $element.data('color');
        if (typeof color === 'undefined') {
            color = options.color;
        }
        if (color) {
            _color = '-' + color;
        }
        var _ops = {
            checkboxClass: 'icheckbox_square' + _color,
            radioClass: 'iradio_square' + _color,
            increaseArea: '20%'
        };
        $element.iCheck($.extend(_ops, options));
        $element.on('ifToggled', function () {
            var $form = $(this).closest('.jxform');
            if ($form && $form.length === 0) return;
            $form.validate().element($(this));
        });
    }();

    //公共函数
    return {
        check: function (callback) {
            $element.iCheck('check', callback);
        },
        uncheck: function (callback) {
            $element.iCheck('uncheck', callback);
        },
        toggle: function (callback) {
            $element.iCheck('toggle', callback);
        },
        disable: function (callback) {
            $element.iCheck('disable', callback);
        },
        enable: function (callback) {
            $element.iCheck('enable', callback);
        },
        indeterminate: function (callback) {
            $element.iCheck('indeterminate', callback);
        },
        determinate: function (callback) {
            $element.iCheck('determinate', callback);
        },
        update: function (callback) {
            $element.iCheck('update', callback);
        },
        destroy: function (callback) {
            $element.iCheck('destroy', callback);
        }
    };
};

//定义插件
jx.plugin({
    name: 'jxcheck',//插件名称
    create: jx.ui.Check,
    defaults: {
        color: 'red'//颜色
    }
});