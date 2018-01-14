/**
 * 输入掩码组件
 */

(function ($) {

    //插件定义
    jx.plugin({
        name: 'jxinputmask',
        instance: function ($ele, ops) {
            return function ($e, o) {
                var mask = $e.data('mask');
                if (mask) {
                    $e.inputmask(mask, ops);
                }
                else {
                    $e.inputmask(ops);
                }
            }($ele, ops);
        }
    });

    //注册依赖
    jx.onBeforeInit(function (e) {
        if (document.querySelector('input.jxinputmask')) {
            jx.depend('inputmask');
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxinputmask').jxinputmask();
    });

}(jQuery));