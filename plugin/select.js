/**
 * 下拉框组件
 */

(function ($) {
    jx.ns('JX.UI');
    /**
     * 下拉选择控件实现类
     */
    JX.UI.Select = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        var init = function () {
            options.matcher = _matchCustom;
            $element.select2(options);
            _initHidden();
            $element.on('change', function () {
                var $form = $ele.closest('.jxform');
                if ($form && $form.length === 0) return;
                $form.validate().element($(this));
            });
        };

        var _matchCustom = function (params, data, a, b) {
            if ($.trim(params.term) === '') {
                return data;
            }

            if (typeof data.text === 'undefined') {
                return null;
            }
            var keys ='';
            // data.element.localName option/optgroup"
            if (data.element.localName === 'optgroup') {
                var filteredChildren = [];
                $.each(data.children, function (idx, child) {
                    keys = $(child.element).data('keys') || '';
                    if (_isMatch(child.text, keys, params.term)) {
                        filteredChildren.push(child);
                    }
                });

                if (filteredChildren.length) {
                    var modifiedData = $.extend({}, data, true);
                    modifiedData.children = filteredChildren;
                    return modifiedData;
                }
            }
            else {
                keys = $(data.element).data('keys') || '';
                if (_isMatch(data.text, keys, params.term)) {
                    return $.extend({}, data, true);
                }
            }

            return null;
        };

        var _isMatch = function (text, keys, term) {
            return (text.toUpperCase().indexOf(term.toUpperCase()) > -1)
                || (keys && keys.toUpperCase().indexOf(term.toUpperCase()) > -1);
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
            // var option = $element.find('option:checked');
            var text = $element.select2('data').map(function(i) {
                return i.text;
            }).join(',');
            $element.siblings('[name=' + text_name + ']').val(text);
        };

        //插件初始化
        init();

        return {

        }
    };

    //插件定义
    jx.plugin({
        name: 'jxselect',
        instance: function ($ele, ops) {
            return JX.UI.Select($ele, ops);
        },
        defaults: {
            minimumResultsForSearch: 10,
            allowClear: true,
            placeholder: '',
            width: '100%',
            language: 'zh-CN',
            theme: 'bootstrap'
        },
        onInit: function (e) {
            $(e.target).find('select.jxselect').jxselect();
        }
    });
}(jQuery));