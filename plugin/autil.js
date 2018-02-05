(function ($) {

    jx._grid = {};
    jx._tree = {};

    /**
     * 初始化表格组件中的表单对象
     */
    jx._grid._initForm = function ($element, options,method) {
        if (!options.form) return;
        options.$form = $(options.form);
        options.$form.jxform({
            highlightElement: function ($ele) {
                return $ele.closest('.form-group');
            }
        });

        options.$form.on('beforesubmit', function () {
            var ps = jx.serialize(options.$form);
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

}(jQuery));