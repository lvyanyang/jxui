/**
 * 日期组件
 */

(function ($) {

    //实现类
    var Date = function ($element, options) {
        options = options || {};

        $element.datepicker(options);
        $element.datepicker().on('changeDate', function (e) {
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

        return {};
    };

    //插件定义
    jx.plugin({
        name: 'jxdate',
        instance: function ($ele, ops) {
            return Date($ele, ops);
        },
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
        },
        onInit: function (e) {
            //插件实例化
            $(e.target).find('.jxdate').jxdate();
        }
    });
}(jQuery));