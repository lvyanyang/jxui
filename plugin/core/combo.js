/**
 * 下拉选择编辑器组件
 */

//实现类
jx.ui.Combo = function (element, options) {
    var $element = $(element);
    var $container, $hiddenElement, $btnSelect, $btnClear, $dropContainer;
    var text_name = '', isOpen = false, setTimeoutId, elementId;

    var togglePanel = function () {
        if (isOpen) {
            hidePanel();
        }
        else {
            showPanel();
        }
    };

    var showPanel = function () {
        if (isOpen === true) {
            return;
        }
        //show 事件
        var e = $.Event('show');
        $element.triggerHandler(e);
        if (e.result === false) {
            return;
        }

        $dropContainer.show();
        $element.css('border-radius', '4px 4px 0 0').css('border-bottom-width', '0');
        isOpen = true;
        $btnSelect.find('i').removeClass().addClass(options.selectOpenIcon);

        $element.triggerHandler('showed');
    };

    var hidePanel = function () {
        if (isOpen === false) {
            return;
        }
        //hide 事件
        var e = $.Event('hide');
        $element.triggerHandler(e);
        if (e.result === false) {
            return;
        }

        $dropContainer.hide();
        $element.css('border-radius', '4px').css('border-bottom-width', '1px');
        isOpen = false;
        $btnSelect.find('i').removeClass().addClass(options.selectIcon);

        $element.triggerHandler('hided');
    };

    var _setHiddenValue = function (val) {
        $hiddenElement.val(val);
    };

    var _initHidden = function () {
        text_name = options.hiddenField;
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

    var clearValue = function () {
        var kv = {text: '', value: ''};
        setValue(kv);
        $element.triggerHandler('clear');
    };

    var getValue = function () {
        return {
            text: $element.val(),
            value: $hiddenElement.val()
        };
    };

    var delayRun = function (fn, delay) {
        if (setTimeoutId > 0) {
            clearTimeout(setTimeoutId);
        }
        setTimeoutId = setTimeout(fn, delay);
    };

    //初始化插件
    var init = function () {
        var panelWidth = options.panelWidth;
        var panelHeight = options.panelHeight;

        elementId = jx.uuid();
        var $parent = $element.parent();
        var btnSelectHtml = '';
        var btnClearHtml = '';
        if (options.showSelect === true) {
            btnSelectHtml = '<a class="jxcombo-cmd-select"><i class="' + options.selectIcon + '"></i></a>';
        }
        if (options.showClear === true) {
            btnClearHtml = '<a class="jxcombo-cmd-clear"><i class="' + options.clearIcon + '"></i></a>';
        }
        $container = $('<span id="' + elementId + '" class="jxcombo-container">'
            + btnSelectHtml + btnClearHtml + '<div class="jxcombo-drop" style="width: ' + panelWidth
            + ';height: ' + panelHeight + ';"></div></span>');
        $container.prepend($element);
        $parent.append($container);
        $btnSelect = $container.find('.jxcombo-cmd-select');
        $btnClear = $container.find('.jxcombo-cmd-clear');
        $dropContainer = $container.find('.jxcombo-drop');
        if (options.content) {
            if (options.content.show) {
                options.content.show();
            }
            $dropContainer.append(options.content);
        }
        else {
            $dropContainer.append('<pre>请指定content属性</pre>');
        }
        _initHidden();
        _cmdButtonAction();

        if (options.inputTrigger === true) {
            $element.on('click', function (e) {
                showPanel();
            });
        }
        if (options.editable === false) {
            $element.attr('readonly', 'readonly');
            $element.css('cursor', 'pointer');
        }

        $btnSelect.on('click', function (e) {
            togglePanel();
        });
        $btnClear.on('click', function (e) {
            clearValue();
        });

        $(document).on('click', function (e) {

            var $target = $(e.target);
            // console.log($target);
            if ($target.hasClass('l-btn-icon')  || $target.hasClass('l-btn-text')  || $target.hasClass('l-btn-left')) {
                return;
            }
            if ($target.closest('#' + elementId, $container).length === 0) {
                hidePanel();
                //jx.stope();
            }
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
            clearValue();
        },
        togglePanel: function () {
            togglePanel();
        },
        showPanel: function () {
            showPanel();
        },
        hidePanel: function () {
            hidePanel();
        },
        delayRun: function (fn, delay) {
            delayRun(fn, delay);
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxcombo',
    create: jx.ui.Combo,
    defaults: {
        showSelect: true,
        showClear: true,
        selectIcon: 'fa fa-caret-down',
        selectOpenIcon: 'fa fa-caret-up',
        clearIcon: 'fa fa-close',
        editable: false,
        inputTrigger: true,
        changeValidate: true,
        content: null,
        panelWidth: '100%',
        panelHeight: '200px'
    }
});
