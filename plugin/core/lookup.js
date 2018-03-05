/**
 * window编辑器组件
 */

//实现类
jx.ui.Lookup = function (element, options) {
    var $element = $(element);
    var $container, $hiddenElement, $btnSelect, $btnClear;
    var text_name = '';

    var _setHiddenValue = function (val) {
        $hiddenElement.val(val);
    };

    var _initHidden = function () {
        text_name = options.textField;
        if (!text_name && $element[0].name) {
            text_name = $element[0].name + '_id';
        }

        $hiddenElement = $('<input type="hidden" name="' + text_name + '"/>');
        $element.parent().prepend($hiddenElement);
        _setHiddenValue($element.data('value'));
    };

    var _cmdButtonAction = function () {
        if (options.showSelect === false && options.showClear === false) return;
        var selectRightOffset = 1;
        var clearRightOffset = 1;
        var showClearBtn = options.showClear === true && $element.val();
        if (options.showSelect === true && showClearBtn) {
            selectRightOffset = 24;
            clearRightOffset = 1;
        }
        $btnSelect.css('right', selectRightOffset);
        $btnClear.css('right', clearRightOffset);
        if (showClearBtn) {
            $btnClear.show();
        }
        else {
            $btnClear.hide();
        }
    };

    var setValue = function (kv) {
        if (!kv) return;
        if (kv.hasOwnProperty('text')) {
            $element.val(kv['text']);
            _cmdButtonAction();
            if (options.changeValidate) {
                var $form = $element.closest('.jxform');
                if (!$form) return;
                $form.validate().element($element);
            }
        }
        if (kv.hasOwnProperty('value')) {
            _setHiddenValue(kv['value']);
        }
    };

    var getValue = function () {
        return {
            text: $element.val(),
            value: $hiddenElement.val()
        };
    };


    var init = function () {
        var width = $element[0].style.width ? $element[0].style.width : '100%';
        $element.css('width', '100%');
        var $parent = $element.parent();
        var btnSelectHtml = '';
        var btnClearHtml = '';
        if (options.showSelect === true) {
            btnSelectHtml = '<a class="jxlookup-cmd-select"><i class="' + options.selectIcon + '"></i></a>';
        }
        if (options.showClear === true) {
            btnClearHtml = '<a class="jxlookup-cmd-clear"><i class="' + options.clearIcon + '"></i></a>';
        }
        $container = $('<span class="jxlookup-container" style="width: ' + width + '">' + btnSelectHtml + btnClearHtml + '</span>');
        $container.prepend($element);
        $parent.append($container);
        $btnSelect = $container.find('.jxlookup-cmd-select');
        $btnClear = $container.find('.jxlookup-cmd-clear');
        _initHidden();
        _cmdButtonAction();

        if (options.inputTrigger === true) {
            $element.on('click', function () {
                jx.dialog(options.dialogOptions);
            });
            $element.css('cursor', 'pointer');
        }

        if (options.editable === false) {
            $element.attr('readonly', 'readonly');
        }

        $btnSelect.on('click', function () {
            jx.dialog(options.dialogOptions);
        });
        $btnClear.on('click', function () {
            setValue({text: '', value: ''});
        });
    }();

    return {
        getContainer: function () {
            return $container;
        },
        setValue: function (kv) {
            setValue(kv);
        },
        getValue: function () {
            return getValue();
        },
        clearValue: function () {
            setValue({text: '', value: ''});
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxlookup',
    create: jx.ui.Lookup,
    options: function (element) {
        return jx.parseOptions($(element), ['textField']);
    },
    defaults: {
        showSelect: true,
        showClear: true,
        selectIcon: 'fa fa-search',
        clearIcon: 'fa fa-close',
        editable: false,
        inputTrigger: true,
        changeValidate: true,
        dialogOptions: {
            shadeClose: true,
            resize: true,
            closeBtn: 0,
            btnFont: ['fa fa-check', 'fa fa-close'],
            btn: ['确定', '关闭'],
            title: '请指定属性',
            content: '请指定content属性'
        }
    }
});