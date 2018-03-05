/**
 * 日期组件
 */

//实现类
jx.ui.Date = function (element, options) {
    var $element = $(element);

    var init = function () {
        $element.datepicker(options);
        $element.on('changeDate', function (e) {
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
    name: 'jxdate',
    create: jx.ui.Date,
    defaults: {
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        todayBtn: 'linked',
        autoclose: true,
        todayHighlight: true,
        templates: {
            leftArrow: '<span class="fa fa-arrow-left"></span>',
            rightArrow: '<span class="fa fa-arrow-right"></span>'
        },
        changeValidate: true
    }
});
