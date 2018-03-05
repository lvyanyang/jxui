/**
 * 输入长度组件
 */
jx.plugin({
    name: 'jxmaxlength',
    selector: 'input[maxlength]',
    create: function (element, options) {
        $(element).maxlength(options);
        return {};
    }
});