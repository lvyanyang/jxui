/**
 * 日期组件
 */

(function ($) {

    //实现类
    var Date = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        var init = function () {
            $element.datepicker(options);

            if (options.changeValidate) {
                $element.datepicker().on('changeDate', function (e) {
                    var $form = $element.closest('.jxform');
                    if (!$form) return;
                    if ($(this).is('div')) return;
                    if ($(this).is('.input-group.date')) {
                        $form.validate().element($(this).find('.form-control'));
                    }
                    else {
                        $form.validate().element($(this));
                    }
                });
            }
        };

        init();

        return $element.datepicker();
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
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxdate').jxdate();
    });

}(jQuery));