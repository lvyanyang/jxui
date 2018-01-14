/**
 * 下拉表格选择编辑器组件
 */

(function ($) {

    jx.ns('JX.UI');

    //实现类
    JX.UI.ComboGrid = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        var $grid, combo, gridInstance, isReady = false, isset = false;

        var init = function () {
            $grid = $('<div class="jx-layout-body jxgrid"></div>');
            options.content = $grid;
            combo = JX.UI.Combo($element, options);

            options.gridOptions.onSelectRow = function (row) {
                if (isset === true) return;
                if (options.multiple === false) {//单选
                    combo.hidePanel();
                }
            };
            options.gridOptions.autuLoad = false;
            options.gridOptions.isMultiselect = options.multiple;
            options.gridOptions.filterBox = $element;//过滤框
            $grid.jxgrid(options.gridOptions);
            gridInstance = $grid.data('jxgrid');
            gridOptions = gridInstance.getOptions();
            // gridOptions.onRenderComplete = function (datas) {
            //
            // };

            $element.on('hide', function () {
                acceptAction();
            });
            $element.on('showed', function () {
                isset = true;
                // $tree.tree('doFilter', '');
                valueAction();
                // setTimeout(function () {
                //     gridInstance.scrollToSelectedOrCheckedNode();
                // },500);
                isset = false;
            });
            $element.on('clear', function () {
                clearAction();
            });
            if (jx.debug) {
                console.log('ComboGrid:grid选项:%o', options.gridOptions);
            }
            gridInstance.reload();
        };

        var clearAction = function () {
            gridInstance.clearSelectedOrChecked();
        };

        var valueAction = function () {
            var v = combo.getValue();
            if (!v.value) return;
            gridInstance.selectRows(v.value, options.separator);
        };

        var acceptAction = function () {
            var kv = gridInstance.getSelectedOrCheckedData(options.separator);
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

        //初始化插件
        init();

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
        instance: function ($ele, ops) {
            return JX.UI.ComboGrid($ele, ops);
        },
        options: function ($ele) {
            return jx.parseOptions($ele);
        },
        defaults: $.extend(true, {}, $.fn.jxcombo.defaults, {
            multiple: false,
            editable: true,
            separator: ',',
            panelHeight: '280px',
            gridOptions: {}
        })
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxcombogrid').jxcombogrid();
    });

}(jQuery));