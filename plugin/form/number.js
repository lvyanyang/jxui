/**
 * 数字输入组件
 */
jx.plugin({
    name: 'jxnumber',
    create: function (element, ops) {
        $(element).TouchSpin(ops);
        return {};
    },
    options: function (element) {
        return jx.parseOptions($(element), ['initval', 'min', 'max', 'step', 'decimals', 'prefix', 'postfix', {mousewheel: 'boolean'}]);
    },
    defaults: {
        verticalupclass: 'fa fa-chevron-up',
        verticaldownclass: 'fa fa-chevron-down'
    }
});