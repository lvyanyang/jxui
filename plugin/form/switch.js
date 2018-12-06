/**
 * Switch组件
 */
jx.plugin({
    name: 'jxswitch',
    depend: 'switch',
    create: function (element, options) {
        var $element = $(element);
        $element.bootstrapSwitch();
    }
});