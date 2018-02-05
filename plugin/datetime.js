/**
 * 日期时间组件
 */

(function ($) {

    //实现类
    var DateTime = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        $element.datetimepicker(options);

        //注册控件值变化事件,在值发生变化时进行验证,目的是让验证状态马上生效
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
        
        return {};
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
            fontAwesome: true
        },
        onBeforeInit: function (e) {//注册依赖
            if (document.querySelector('.jxdatetime')) {
                jx.depend('datetime');
            }
        },
        onInit: function (e) {//实例化
            $(e.target).find('.jxdatetime').jxdatetime();
        }
    });

}(jQuery));