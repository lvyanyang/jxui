/**
 * window.tree编辑器组件
 */
//实现类
jx.ui.LookupTree = function (element, options) {
    var $element = $(element);

    var lookup = jx.ui.Lookup($element, options);
    var $container = lookup.getContainer();
    var $treeContainer, $layerContainer, layerIndex;
    var isAccept = false, treeInstance;

    var init = function () {
        options.treeOptions.onLoadSuccess = function (node, data) {
            valueAction();
        };
        options.treeOptions.onDblClick = function (node) {
            if (options.dblClickAccept === true) {
                if (acceptAction() === true) {
                    top.layer.close(layerIndex);
                }
            }
        };
        options.dialogOptions.content = '<div class="m-5">' +
            '<input class="form-control jxlookuptree-filter" placeholder="请输入关键字模糊查询"></div>' +
            '<div class="jxtree-container jxlookup-tree" style="overflow: auto;"></div>';
        options.dialogOptions.success = function ($layer, index) {
            $layerContainer = $layer;
            layerIndex = index;
            isAccept = false;
            $layer.find('.layui-layer-content').css('overflow', 'hidden');
            var $filterbox = $layer.find('.jxlookuptree-filter');
            var treeHeight = $layer.find('.layui-layer-content').height() - 25 - ($filterbox.height());

            $treeContainer = $layer.find('.jxlookup-tree');
            $treeContainer.height(treeHeight);
            if (!options.treeOptions.maskTarget) {
                options.treeOptions.maskTarget = $treeContainer;
            }
            if (!options.treeOptions.url) {
                $treeContainer.append('<pre>请指定tree控件url属性</pre>');
                return;
            }
            options.treeOptions.checkbox = options.multiple;
            options.treeOptions.filterBox = $filterbox;
            if (jx.debug) {
                console.log('LookupTree:tree选项:%o', options.treeOptions);
            }
            $treeContainer.jxtree(options.treeOptions);
            treeInstance = $treeContainer.data('jxtree');
        };
        options.dialogOptions.callback = function (dwin, $layer, index) {
            return acceptAction();
        };
        if (options.autoAccept === true) {
            options.dialogOptions.end = function () {
                if (isAccept === false) {
                    acceptAction();
                }
            }
        }
    }();

    var valueAction = function () {
        var v = lookup.getValue();
        if (!v.value) return;
        treeInstance.selectedOrCheckedNode(v.value, options.separator);
        treeInstance.scrollToSelectedOrCheckedNode();
    };

    var acceptAction = function () {
        var kv = treeInstance.getSelectedOrCheckedData(options.separator);
        if (options.multiple === true) {
            var v = kv.value.split(options.separator);
            if (options.requireSelect === true && v.length == 0) {
                toastr.error(options.noSelectMsg, '');
                return false;
            }
            if (options.maxSelectCount > 0 && v.length > options.maxSelectCount) {
                toastr.error(jx.formatString(options.maxSelectCountMsg, [options.maxSelectCount]), '');
                return false;
            }
        }
        else {
            if (options.requireSelect === true && !kv.value) {
                toastr.error(options.noSelectMsg, '');
                return false;
            }
        }

        if (jx.debug) {
            console.log('LookupTree选中的值:%o', kv);
        }
        lookup.setValue(kv);
        isAccept = true;
        //region accept 事件
        var e = $.Event('accept');
        $element.triggerHandler(e, [kv]);
        return e.result !== false;
        //endregion
    };

    return {
        getContainer: function () {
            return $container;
        },
        getOptions: function () {
            return options;
        },
        setValue: function (kv) {
            lookup.setValue(kv);
        },
        getValue: function () {
            return lookup.getValue();
        },
        clearValue: function () {
            lookup.clearValue();
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxlookuptree',
    create: jx.ui.LookupTree,
    options: function (element) {
        return jx.parseOptions($(element), ['textField']);
    },
    defaults: $.extend(true, {}, $.fn.jxlookup.defaults, {
        requireSelect: false,
        noSelectMsg: '请至少选择一项',
        maxSelectCount: 0,
        maxSelectCountMsg: '最多选择{0}项',
        searchPlaceholder: '请输入关键字进行模糊查询',
        dblClickAccept: true,
        autoAccept: false,
        multiple: false,
        separator: ',',
        dialogOptions: {
            width: '30%',
            height: '70%'
        },
        treeOptions: {
            method: 'get',

            /**
             * 是否转换为tree对象结构
             */
            convert: false,

            /**
             * 单击节点切换展开状态
             */
            clickToggle: false,

            /**
             * mask目标对象
             */
            maskTarget: null,

            /**
             * 加载提示消息
             */
            maskMsg: '正在加载,请稍等...',

            /**
             * 加载提示延迟毫秒
             */
            maskDelay: 500
        }
    })
});