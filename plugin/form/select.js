/**
 * 下拉框组件
 */

/**
 * 下拉选择控件实现类
 */
jx.ui.Select = function (element, options) {
    var $element = $(element);

    var _matchCustom = function (params, data, a, b) {
        if ($.trim(params.term) === '') {
            return data;
        }

        if (typeof data.text === 'undefined') {
            return null;
        }
        var keys = '';
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
        if (!text_name) {
            return;
        }
        // if (!text_name && $element[0].name) {
        //     text_name = $element[0].name + '_text';
        // }

        var hidden = '<input type="hidden" name="' + text_name + '"/>';
        $element.parent().prepend(hidden);
        _setText(text_name);

        $element.on('change', function () {
            _setText(text_name);
        });
    };

    var _setText = function (text_name) {
        // var option = $element.find('option:checked');
        var text = $element.select2('data').map(function (i) {
            return i.text;
        }).join(',');
        $element.siblings('[name=' + text_name + ']').val(text);
    };

    //插件初始化
    var init = function () {
        options.matcher = _matchCustom;
        $element.select2(options);
        _initHidden();
        $element.on('change', function () {
            var $form = $element.closest('.jxform');
            if ($form && $form.length === 0) return;
            $form.validate().element($(this));
        });

        $element.on('change', function () {
            if ($(this).data('selectSubmit') === true) {
                $(this).closest('form').find(':submit').click();
            }
        });
    }();

    return {
        getOptions: function () {
            return options;
        },
        setOptions: function (ops) {
            $.extend(options, ops);
        },
        open: function () {
            return $element.select2('open');
        },
        close: function () {
            return $element.select2('close');
        },
        destroy: function () {
            return $element.select2('destroy');
        },
        data: function () {
            return $element.select2('data');
        }
    }
};

//插件定义
jx.plugin({
    name: 'jxselect',
    create: jx.ui.Select,
    defaults: {
        minimumResultsForSearch: 10,
        selectSubmit: false,
        allowClear: true,
        placeholder: '',
        width: '100%',
        language: 'zh-CN',
        theme: 'bootstrap'
    }
});