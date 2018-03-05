/**
 * 日期时间组件
 */

//实现类
jx.ui.DateTime = function (element, options) {
    var $element = $(element);

    var init = function () {
        $element.datetimepicker(options);
        $element.on('changeDate', function () {
            var $form = $element.closest('.jxform');
            if ($form && $form.length === 0) return;
            if ($(this).is('div')) return;
            if ($(this).is('.input-group.date')) {
                $form.validate().element($(this).find('.form-control'));
            }
            else {
                $form.validate().element($(this));
            }
        });
    }();

    return {};
};

//插件定义
jx.plugin({
    name: 'jxdatetime',
    depend: 'datetime',
    create: jx.ui.DateTime,
    defaults: {
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true,
        language: 'zh-CN',
        isInline: false,
        format:'yyyy-mm-dd hh:ii',
        fontAwesome: true
    }
});
