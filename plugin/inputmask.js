/**
 * 输入掩码组件
 */
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
            return {};
        }($ele, ops);
    },
    onBeforeInit: function (e) {//注册依赖
        if (document.querySelector('input.jxinputmask')) {
            jx.depend('inputmask');
        }
    },
    onInit: function (e) {//实例化
        $(e.target).find('.jxinputmask').jxinputmask();
    }
});