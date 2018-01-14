/**
 * 下拉树选择编辑器组件
 */

(function ($) {

    jx.ns('JX.UI');

    //实现类
    JX.UI.ComboTree = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        var $tree, $nodata, combo, treeInstance, isReady = false;

        var init = function () {
            $tree = $('<div class="jxtree" style="overflow: auto;width: 100%;height: 100%;"></div>');
            options.content = $tree;
            combo = JX.UI.Combo($element, options);
            options.treeOptions.onLoadSuccess = function (node, data) {
                if (isReady === false) {
                    isReady = true;
                    valueAction();
                    textAction();
                }
            };
            options.treeOptions.onClick = function (node) {
                if (options.multiple === false) {
                    combo.hidePanel();
                }
            };
            options.treeOptions.checkbox = options.multiple;
            options.treeOptions.filterBox = $element;
            $tree.jxtree(options.treeOptions);
            treeInstance = $tree.data('jxtree');
            $element.on('hide', function () {
                acceptAction();
            });
            $element.on('showed', function () {
                $tree.tree('doFilter', '');
                treeInstance.scrollToSelectedOrCheckedNode();
            });
            $element.on('clear', function () {
                clearAction();
            });
            if (jx.debug) {
                console.log('ComboTree:tree选项:%o', options.treeOptions);
            }
        };

        var clearAction = function () {
            treeInstance.clearSelectedOrChecked();
        };

        var valueAction = function () {
            var v = combo.getValue();
            if (!v.value) return;
            treeInstance.selectedOrCheckedNode(v.value, options.separator);
        };

        var textAction = function () {
            var kv = treeInstance.getSelectedOrCheckedData(options.separator);
            combo.setValue(kv);
        };

        var acceptAction = function () {
            var kv = treeInstance.getSelectedOrCheckedData(options.separator);
            combo.setValue(kv);
            if (jx.debug) {
                console.log('ComboTree 选中的值:%o', kv);
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
            getTreeContainer: function () {
                return $tree;
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
        name: 'jxcombotree',
        instance: function ($ele, ops) {
            return JX.UI.ComboTree($ele, ops);
        },
        options: function ($ele) {
            return jx.parseOptions($ele);
        },
        defaults: $.extend(true, {}, $.fn.jxcombo.defaults, {
            multiple: false,
            editable: true,
            separator: ',',
            treeOptions: {}
        })
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxcombotree').jxcombotree();
    });

}(jQuery));