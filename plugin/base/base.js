(function ($) {

    //声明命名空间
    jx.ns('jx.ui');

    jx._grid = {};
    jx._tree = {};
    jx.gf = {};

    /**
     * 初始化表格组件中的表单对象
     */
    jx._grid._initForm = function ($element, options, method) {
        if (!options.form) return;
        var formSelectors = options.form.split(',');
        options.$form = $(formSelectors[0]);
        options.$form.jxform({
            highlightElement: function ($ele) {
                return $ele.closest('.form-group');
            }
        });

        options.$form.on('beforesubmit', function () {
            var ps = jx.serialize(options.$form);
            if (formSelectors.length > 1) {
                for (var i = 1; i < formSelectors.length; i++) {
                    var $subform = $(formSelectors[i]);
                    if(!$subform.data('validator')){
                        $subform.jxform();
                    }
                    if ($subform.valid() === false) {
                        return false;
                    }
                    $.extend(ps, jx.serialize($subform));
                }
            }
            method($element, ps);
            return false;
        })
    };

    /**
     * 获取表格组件中错误信息面板
     */
    jx._grid._getErrorPanel = function ($element, options) {
        var $body = $element.data('datagrid').dc.body2;
        var $error = $body.find('.datagrid-error');
        if ($error.length === 0) {
            $error = $('<div class="datagrid-error"></div>');
            $body.append($error);
        }
        return $error;
    };

    /**
     * 获取表格组件中空数据提示信息面板
     */
    jx._grid._getNoPanel = function ($element, options) {
        var $body = $element.data('datagrid').dc.body2;
        var $noPanel = $body.find('.datagrid-nodata');
        if ($noPanel.length === 0) {
            $noPanel = $('<div class="datagrid-nodata"></div>');
            $body.append($noPanel);
        }
        return $noPanel;
    };

    /**
     * Tree组件过滤函数
     */
    jx._tree._filter = function (q, node) {
        var qq = [];
        $.map($.isArray(q) ? q : [q],
            function (q) {
                q = $.trim(q);
                if (q) {
                    qq.push(q);
                }
            });
        for (var i = 0; i < qq.length; i++) {
            var _textFilter = node.text.toLowerCase().indexOf(qq[i].toLowerCase()) >= 0;
            var _spellFilter = (node.spell) && (node.spell.toLowerCase().indexOf(qq[i].toLowerCase()) >= 0);
            if (_textFilter || _spellFilter) {
                return true;
            }
        }
        return !qq.length;
    };

    //region GridFormat

    /**
     * bool转换
     * @return {string}
     */
    jx.gf.bool = function (v) {
        if (jx.toBoolean(v)) {
            return '<i class="fa fa-toggle-on"></i>';
        }
        return '<i class="fa fa-toggle-off"></i>';
    };

    /**
     * 日期转换
     * @return {string}
     */
    jx.gf.date = function (v) {
        if (v) {
            return jx.formatDate(new Date(v));
        }
        return v;
    };
    /**
     * 日期转换
     * @return {string}
     */
    jx.gf.datetime = function (v) {
        if (v) {
            return jx.formatDateTime(new Date(v));
        }
        return v;
    };

    jx.gf.decimal = function (v) {
        if (v) {
            return jx.toDecimal(v);
        }
        return v;
    };

    // endregion

}(jQuery));