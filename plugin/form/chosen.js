/**
 * 下拉组件
 */

//实现类
jx.ui.Chosen = function (element, options) {
    var $element = $(element);

    var _initHidden = function () {
        var text_name = $element.data('textField');
        if (!text_name && $element[0].name) {
            text_name = $element[0].name + '_text';
        }

        var hidden = '<input type="hidden" name="' + text_name + '"/>';
        $element.parent().prepend(hidden);
        _setText(text_name);

        $element.on('change', function () {
            _setText(text_name);
        });
    };

    var _setText = function (text_name) {
        var option = $element.find('option:checked');
        $element.siblings('[name=' + text_name + ']').val(option.text());
    };

    var _getArrayParams = function (item) {
        var sz = [];
        if (Array.isArray(item)) {
            sz = item;
        }
        else {
            sz.push(item);
        }
        return sz;
    };

    var _getArrayFilters = function (item) {
        var sz = _getArrayParams(item);
        var vsz = [];
        for (var i = 0; i < sz.length; i++) {
            var o = sz[i];
            var v = o;
            if (jx.isObj(o)) {
                v = o.id || o.text;
            }
            vsz.push('option[value="' + v + '"]');
        }
        return vsz;
    };

    var _triggerUpdate = function () {
        $element.trigger('chosen:updated');
    };

    var _load = function () {
        if (options.url) {
            $.ajax({
                url: options.url,
                type: options.method,
                data: options.params,
                success: function (result) {
                    add(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    };

    /**
     * 添加下拉选项
     * @param item
     */
    var add = function (item) {
        var sz = _getArrayParams(item);
        var ostr = '';
        for (var i = 0; i < sz.length; i++) {
            var o = sz[i];
            if (!o.hasOwnProperty('id')) {
                continue;
            }
            ostr += '<option value="' + (o.id || '') + '"';
            if (o.keys) {
                ostr += ' data-keys="' + o.keys + '"';
            }
            ostr += '>' + (o.text || '') + '</option>';
        }
        $element.append(ostr);
        _triggerUpdate();
        return this;
    };

    /**
     * 移除下拉选项
     * @param item
     */
    var remove = function (item) {
        var vsz = _getArrayFilters(item);
        if (vsz.length === 0) return;
        $element.find('option').filter(vsz.join(',')).remove();
        _triggerUpdate();
    };

    var disable = function (item) {
        var vsz = _getArrayFilters(item);
        if (vsz.length === 0) return;
        $element.find('option').filter(vsz.join(',')).attr('disabled', '1');
        _triggerUpdate();
    };
    var enable = function (item) {
        var vsz = _getArrayFilters(item);
        if (vsz.length === 0) return;
        $element.find('option').filter(vsz.join(',')).removeAttr('disabled');
        _triggerUpdate();
    };

    var text = function () {
        var v = $element.val();
        if (Array.isArray(v)) {
            var items = [];
            for (var i = 0; i < v.length; i++) {
                items.push({id: v[i]});
            }
            var vsz = _getArrayFilters(items);
            var tsz = $element.find('option').filter(vsz.join(',')).map(function (a, b) {
                return $(this).text();
            });
            return tsz.get().join();
        } else {
            return $element.find('option').filter('option[value="' + v + '"]').text();
        }
    };

    //插件初始化
    var init = function () {
        $element.on('chosen:ready', _load);
        $element.chosen(options);
        _initHidden();

        if (options.changeValidate) {
            //注册控件值变化事件,在值发生变化时进行验证,目的是让验证状态马上生效
            $element.on('change', function () {
                var $form = $element.closest('.jxform');
                if ($form && $form.length === 0) return;
                $form.validate().element($(this));
            });
        }
    }();

    return {
        /**
         * 添加下拉选项
         * @param item
         */
        add: function (item) {
            return add(item);
        },

        /**
         * 移除下拉选项
         * @param item
         */
        remove: function (item) {
            remove(item);
        },

        disable: function (item) {
            disable(item);
        },

        enable: function (item) {
            enable(item);
        },

        val: function (v) {
            if (typeof v === 'undefined') {
                return $element.val();
            }
            $element.val(v);
            _triggerUpdate();
        },

        text: function () {
            return text();
        }
    }
};

//插件定义
jx.plugin({
    name: 'jxchosen',
    depend:'chosen',
    create: jx.ui.Chosen,
    options: function (element) {
        return jx.parseOptions($(element), ['url', 'method', 'width', {params: 'object'}]);
    },
    defaults: {
        url: null,
        method: 'get',
        params: {},
        width: '100%',
        allow_single_deselect: true,  // 允许单选取消
        disable_search_threshold: 6,  // 10 个以下的选择项则不显示检索框
        search_contains: true,        // 从任意位置开始检索
        changeValidate: true
    },
    onLoad:function () {
        $.fn.jxform.defaults.validateOptions.ignore += ':not(.jxchosen)';
    }
});