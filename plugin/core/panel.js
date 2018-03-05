/**
 * 面板组件
 */
jx.ui.Panel = function (element, options) {
    var $element = $(element);

    var init = function () {
        $element.panel(options);
    }();

    return {
        options: function () {
            return $element.panel('options');
        },
        panel: function () {
            return $element.panel('panel');
        },
        header: function () {
            return $element.panel('header');
        },
        footer: function () {
            return $element.panel('footer');
        },
        body: function () {
            return $element.panel('body');
        },
        setTitle: function (title) {
            return $element.panel('setTitle', title);
        },
        open: function (forceOpen) {
            return $element.panel('open', forceOpen);
        },
        close: function (forceClose) {
            return $element.panel('close', forceClose);
        },
        destroy: function (forceDestroy) {
            return $element.panel('destroy', forceDestroy);
        },
        clear: function () {
            return $element.panel('clear');
        },
        refresh: function (href) {
            return $element.panel('refresh', href);
        },
        resize: function (options) {
            return $element.panel('resize', options);
        },
        doLayout: function () {
            return $element.panel('doLayout');
        },
        move: function (options) {
            return $element.panel('move', options);
        },
        maximize: function () {
            return $element.panel('maximize');
        },
        minimize: function () {
            return $element.panel('minimize');
        },
        restore: function () {
            return $element.panel('restore');
        },
        collapse: function (animate) {
            return $element.panel('collapse', animate);
        },
        expand: function (animate) {
            return $element.panel('expand', animate);
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxpanel',
    create: jx.ui.Panel,
    defaults: {
        fit: true,
        border: false
    }
});