/**
 * 时间组件
 */
jx.ui.Clock = function (element, options) {
    var $element = $(element);

    var init = function () {
        $element.clockpicker(options);
    }();

    return {
        /**
         * 显示表盘
         */
        show: function () {
            $element.clockpicker('show');
        },
        /**
         * 隐藏表盘
         */
        hide: function () {
            $element.clockpicker('hide');
        },
        /**
         * 移除表盘 (同时移除事件监听)
         */
        remove: function () {
            $element.clockpicker('remove');
        },
        /**
         * 切换小时视图或者分钟视图
         * @param view 'hours' 或者 'minutes'
         */
        toggleView: function (view) {
            $element.clockpicker('toggleView', view);
        }
    }
};

//插件定义
jx.plugin({
    name: 'jxclock',
    depend: 'clockpicker',
    create: jx.ui.Clock
});
