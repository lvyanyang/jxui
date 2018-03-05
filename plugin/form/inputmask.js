/**
 * 输入掩码组件
 */
jx.plugin({
    name: 'jxinputmask',
    depend: 'inputmask',
    create: function (element, options) {
        var $element = $(element);

        var mask = $element.data('mask');
        if (mask) {
            $element.inputmask(mask, options);
        }
        else {
            $element.inputmask(options);
        }
    }
});