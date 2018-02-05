/**
 * 输入长度组件
 */
jx.plugin({
    name: 'jxmaxlength',
    instance: function ($ele, ops) {
        return function ($e, o) {
            $e.maxlength(o);
            return {};
        }($ele, ops);
    },
    onInit: function (e) {//实例化
        $(e.target).find('input[maxlength]').jxmaxlength();
    }
});