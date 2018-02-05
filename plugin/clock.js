/**
 * 时间组件
 */

(function ($) {

    //实现类
    var Clock = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        $element.clockpicker(options);

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
        instance: function ($ele, ops) {
            return Clock($ele, ops);
        },
        onBeforeInit:function (e) {//注册依赖
            if (document.querySelector('.jxclock')) {
                jx.depend('clockpicker');
            }
        },
        onInit:function (e) {//实例化
            $(e.target).find('.jxclock').jxclock();
        }
    });

}(jQuery));