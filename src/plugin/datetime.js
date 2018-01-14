/**
 * 日期时间组件
 */

(function ($) {

    //实现类
    var DateTime = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        $element.datetimepicker(options);

        if (options.changeValidate) {
            //注册控件值变化事件,在值发生变化时进行验证,目的是让验证状态马上生效
            $element.on('changeDate', function () {
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

    //插件定义
    jx.plugin({
        name: 'jxdatetime',
        instance: function ($ele, ops) {
            return DateTime($ele, ops);
        },
        defaults: {
            autoclose: true,
            todayBtn: 'linked',
            todayHighlight: true,
            language: 'zh-CN',
            isInline: false,
            // format:"yyyy-mm-dd",
            fontAwesome: true,
            changeValidate: true
        }
    });

    //注册依赖
    jx.onBeforeInit(function (e) {
        if (document.querySelector('.jxdatetime')) {
            jx.depend('datetime');
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxdatetime').jxdatetime();
    });

}(jQuery));