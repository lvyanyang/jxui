/**
 * 下拉树选择编辑器组件
 */

//实现类
jx.ui.ComboTree = function (element, options) {
    var $element = $(element);
    var $tree, $nodata, combo, treeInstance, isReady = false;

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
    var init = function () {
        $tree = $('<ul class="jxtree" style="overflow: auto;width: 100%;height: 100%;"></ul>');
        options.content = $tree;
        combo = jx.ui.Combo($element, options);
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
    }();

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
    create: jx.ui.ComboTree,
    defaults: $.extend(true, {}, $.fn.jxcombo.defaults, {
        multiple: false,
        editable: true,
        separator: ',',
        treeOptions: {}
    })
});
