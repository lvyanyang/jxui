/**
 * 下拉框组件
 */

(function ($) {

    //实现类
    var Select2 = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        /**
         * 组件初始化
         */
        var init = function () {
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                options.matcher = oldMatcher(function (term, text, obj) {
                    var spell = $(obj.element).data('spell');
                    return (text.toUpperCase().indexOf(term.toUpperCase()) > -1)
                        || (spell && spell.toUpperCase().indexOf(term.toUpperCase()) > -1);
                });
                $element.select2(options);
                _initHidden();
                if (ops.changeValidate) {
                    $element.on('change', function () {
                        var $form = $ele.closest('.jxform');
                        if (!$form) return;
                        $form.validate().element($(this));
                    });
                }
            });
        };
        var _initHidden = function () {
            var text_name = $element.data('textField');
            if (!text_name && $element[0].name) {
                text_name = $element[0].name + '_text';
            }

            var hidden = '<input type="hidden" name="' + text_name + '"/>';
            $element.parent().prepend(hidden);
            _setText(text_name);

            $element.on('select2:select', function () {
                _setText(text_name);
            });
        };

        var _setText = function (text_name) {
            var option = $element.find('option:checked');
            $element.siblings('[name=' + text_name + ']').val(option.text());
        };

        //region 插件初始化

        init();

        //endregion

        return {}
    };

    //插件定义
    jx.plugin({
        name: 'jxselect2',
        instance: function ($ele, ops) {
            return Select2($ele, ops);
        },
        defaults: {
            allowClear: true,
            placeholder: '',
            width: '100%',
            language: 'zh-CN',
            theme: 'bootstrap',
            changeValidate: true
        }
    });

    //注册依赖
    jx.onBeforeInit(function (e) {
        if (document.querySelector('select.jxselect2')) {
            jx.depend('select2');
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('select.jxselect2').jxselect2();
    });

}(jQuery));