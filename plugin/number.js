/**
 * 数字输入组件
 */
jx.plugin({
    name: 'jxnumber',
    instance: function ($ele, ops) {
        return function ($e, o) {
            $e.TouchSpin(o);
            return {};
        }($ele, ops);
    },
    options: function ($ele) {
        return jx.parseOptions($ele, ['initval','min','max','step','decimals','prefix','postfix',{mousewheel: 'boolean'}]);
    },
    defaults: {
        verticalupclass: 'fa fa-chevron-up',
        verticaldownclass: 'fa fa-chevron-down'
    },
    onInit: function (e) {//实例化
        $(e.target).find('.jxnumber').jxnumber();
    }
});