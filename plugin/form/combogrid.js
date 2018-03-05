/**
 * 下拉表格选择编辑器组件
 */

jx.ui.ComboGrid = function (element, options) {
    var $element = $(element);
    var $grid, combo, isReady = false;

    var _initFilter = function () {
        if (!options.editable) return;
        if (!options.filter_delay) {
            options.filter_delay = jx.delay();
        }
        $element.on('input', function (e) {
            var val = $(this).val().trim();
            options.filter_delay.run(function () {
                if (jx.debug) {
                    console.log('过滤combogrid数据，关键字：' + val);
                }
                $grid.datagrid('load',{name: val});
            }, 500);
        });
    };

    var clearAction = function () {
        $grid.datagrid('clearSelections');
    };

    var valueAction = function () {
        var v = combo.getValue();
        if (!v.value) return;

        var ids = v.value.split(options.separator);
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            $grid.datagrid('selectRecord', id);
        }
    };

    var textAction = function () {
        var kv = getSelectedData();
        combo.setValue(kv);
    };

    var acceptAction = function () {
        var kv = getSelectedData();
        combo.setValue(kv);
        if (jx.debug) {
            console.log('ComboGrid 选中的值:%o', kv);
        }
        //region accept事件
        var e = $.Event('accept');
        $element.triggerHandler(e, [kv]);
        return e.result !== false;
        //endregion
    };

    var getSelectedData = function () {
        var kv = {text: [], value: []};
        var rows = $grid.datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            var n = rows[i];
            kv.text.push(n[options.gridOptions.nameField]);
            kv.value.push(n[options.gridOptions.idField]);
        }
        kv = {text: kv.text.join(options.separator), value: kv.value.join(options.separator)};
        return kv;
    };

    // var scrollToSelected = function () {
    //     var row = $grid.datagrid('getSelected');
    //     if (row) {
    //         var index = $grid.datagrid('getRowIndex',row);
    //         $grid.datagrid('scrollTo',index);
    //     }
    // };

    //初始化插件
    var init = function () {
        options.gridOptions.ctrlSelect = false;
        $grid = $('<table class="jcombogrid"></table>');
        options.content = $grid;
        combo = jx.ui.Combo($element, options);

        options.gridOptions.onLoadSuccess = function (data) {
            valueAction();
        };
        options.gridOptions.onClickRow = function (index, row) {
            if (options.multiple === false) {//单选
                combo.hidePanel();
            }
        };
        options.gridOptions.singleSelect = !options.multiple;

        // options.gridOptions.filterBox = $element;

        $element.on('hide', function () {
            acceptAction();
        });
        $element.on('showed', function () {
            if (isReady === false) {
                isReady = true;
                $grid.jxgrid(options.gridOptions);
            }
        });
        $element.on('clear', function () {
            clearAction();
        });
        if (jx.debug) {
            console.log('ComboGrid:grid选项:%o', options.gridOptions);
        }
        _initFilter();//过滤框
    }();

    return {
        getContainer: function () {
            return combo.getContainer();
        },
        getGridContainer: function () {
            return $grid;
        },
        getOptions: function () {
            return options;
        },
        setValue: function (kv) {
            combo.setValue(kv);
        },
        getValue: function () {
            return combo.getValue();
        },
        clearValue: function () {
            combo.clearValue();
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxcombogrid',
    create: jx.ui.ComboGrid,
    defaults: $.extend(true, {}, $.fn.jxcombo.defaults, {
        multiple: false,
        editable: true,
        separator: ',',
        panelHeight: '280px',
        gridOptions: {
            url: null
        }
    })
});
