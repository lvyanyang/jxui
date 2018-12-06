/**
 * 树组件
 */
jx.ui.Tree = function (element, options) {
    var $element = $(element);

    //region 公共函数

    var _getChildFirstNode = function (node) {
        if (!node) return null;
        if (node.children && node.children.length > 0) {
            return node.children[0];
        }
    };

    /**
     * 获取节点Id根据级别
     * @param level
     * @return {number}
     */
    var getIdByLevel = function (level) {
        var i = 1;
        var node = $element.tree('getRoot');
        while (i < level) {
            i++;
            node = _getChildFirstNode(node);
            if (!node) {
                break;
            }
        }
        if (node) {
            return node.id;
        }
        return 0;
    };

    /**
     * 获取数节点的排序路径
     * @param nid 节点Id
     */
    var getPath = function (nid) {
        if (!nid) {
            return '';
        }
        var node = $element.tree('find', nid);
        var parentNode = $element.tree('getParent', node.target);
        if (parentNode) {
            var pstring = '';
            if (parentNode.id != '0') {
                pstring = getPath(parentNode.id);
            }
            return pstring + jx.fixLen(getIndex(nid, parentNode.children), 4, '0');
        } else {
            return jx.fixLen(getIndex(nid, $element.tree('getRoots')), 4, '0');
        }
    };

    /**
     * 获取节点序号
     * @param nid 节点Id
     * @param nodes 待查找的节点集合
     */
    var getIndex = function (nid, nodes) {
        var nodeIndex = -1;
        $.each(nodes, function (index, value) {
            if (value.id == nid) {
                nodeIndex = index + 1;
                return false;
            }
        });
        return nodeIndex.toString();
    };

    /**
     * 展开根节点
     */
    var expandRoot = function () {
        var root = $element.tree('getRoot');
        if (root) {
            $element.tree('expand', root.target);
        }
    };

    /**
     * 清除节点选中节点或者复选框
     */
    var clearSelectedOrChecked = function () {
        if (options.checkbox === true) {
            var nodes = $element.tree('getChecked');
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                $element.tree('uncheck', n.target);
            }
        }

        var node = $element.tree('getSelected');
        if (node) {
            $(node.target).removeClass('tree-node-selected')
        }
    };

    /**
     * 获取节选中点或者复选框值
     * @param separator 分隔符
     */
    var getSelectedOrCheckedData = function (separator) {
        var kv = {text: null, value: null};
        if (options.checkbox === true) {
            kv = {text: [], value: []};
            var nodes = $element.tree('getChecked');
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                kv.text.push(n.text);
                kv.value.push(n.id);
            }
            kv = {text: kv.text.join(separator), value: kv.value.join(separator)};
        }
        else {
            var node = $element.tree('getSelected');
            if (node) {
                kv = {text: node.text, value: node.id};
            }
        }
        return kv;
    };

    /**
     * 选中节点或者复选框
     * @param val 节点id值(多选值分隔符隔开)
     * @param separator 分隔符
     */
    var selectedOrCheckedNode = function (val, separator) {
        if (options.checkbox === true) {
            var ids = val.split(separator);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var n = $element.tree('find', id);
                if (n) {
                    $element.tree('expandTo', n.target);
                    $element.tree('check', n.target);
                }
            }
        }
        else {
            var node = $element.tree('find', val);
            if (node) {
                $element.tree('expandTo', node.target);
                $element.tree('select', node.target);
            }
        }
    };

    /**
     * 滚动到选中节点或者复选节点
     */
    var scrollToSelectedOrCheckedNode = function () {
        var node;
        if (options.checkbox === false) {
            node = $element.tree('getSelected');
        }
        else {
            var nodes = $element.tree('getChecked');
            if (nodes.length > 0) {
                node = nodes[0];
            }
        }
        if (node) {
            $element.jxscrollTo($(node.target));
        }
    };

    var getChildNode = function (node) {
        if (!node) return null;
        if (node.children && node.children.length > 0) {
            return node.children[0];
        }
    };

    //endregion

    var init = function () {
        if (!options.maskTarget) {
            options.maskTarget = $element;
        }
        if (options.params) {
            $.extend(options.queryParams, options.params);
        }

        //region 函数重写

        options.filter = jx._tree._filter;

        var _onBeforeLoad = options.onBeforeLoad;
        options.onBeforeLoad = function (node, param) {
            if (_onBeforeLoad) {
                var result = _onBeforeLoad.call(this, node, param);
                if (result === false) {
                    return false;
                }
            }
            if (options.url) {
                options.maskTarget.mask(options.maskMsg, options.maskDelay);
            }
        };

        options.delayFilter = function (val, delayTime, callback) {
            if (!options.filter_delay) {
                options.filter_delay = jx.delay();
            }
            options.filter_delay.run(function () {
                if (jx.debug) {
                    console.log('过滤tree数据，关键字：' + val);
                }
                $element.tree('doFilter', val);
                if (callback) {
                    callback();
                }
            }, delayTime);
        };

        options.initNodataInfo = function () {
            if ($element.children('nodata').length > 0) return;
            var $nodataAlert = $('<div class="alert alert-warning nodata" role="alert"></div>');
            $element.prepend($nodataAlert);
            if (!options.filterBox) {
                return;
            }
            options.filterBox.on('input', function (e) {
                var val = $(this).val().trim();
                options.delayFilter(val, 500, function () {
                    var roots = $element.tree('getRoots');
                    var hided = false;
                    for (var i = 0; i < roots.length; i++) {
                        var $root = $(roots[i].target);
                        if ($root.hasClass('tree-node-hidden') === false) {//存在根节点
                            hided = true;
                            break;
                        }
                    }
                    $nodataAlert.html(options.filterEmptyMessage);
                    hided ? $nodataAlert.hide() : $nodataAlert.show();
                });
            });
        };

        var _onLoadSuccess = options.onLoadSuccess;
        options.onLoadSuccess = function (node, data) {
            options.maskTarget.unmask();
            options.initNodataInfo();
            var $nodataAlert = $element.find('.nodata');
            if ((!data || data.length === 0) && options.loadEmptyMessage) {
                $nodataAlert.html(options.loadEmptyMessage);
                $nodataAlert.show();
            }
            else {
                $nodataAlert.html('');
                $nodataAlert.hide();
            }

            if (_onLoadSuccess) {
                _onLoadSuccess.call(this, node, data);
            }
        };

        var _onLoadError = options.onLoadError;
        options.onLoadError = function (httpRequest) {
            options.maskTarget.unmask();
            $element.append(jx.getAjaxError(httpRequest));
            if (_onLoadError) {
                _onLoadError.call(this, httpRequest);
            }
        };

        var _loadFilter = options.loadFilter;
        options.loadFilter = function (rows) {
            //错误提示
            if (rows.success && rows.success === false) {
                $element.append(rows.msg);
                return false;
            }
            if (rows.data && Array.isArray(rows.data)) {
                rows = rows.data;
            }
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    var r = rows[i];
                    if (!r.iconCls && options.defaultIconCls) {
                        if (!jx.isUndefined(r.leaf) && r.leaf === 0) {
                            r.iconCls = null;
                        }
                        else {
                            r.iconCls = options.defaultIconCls;
                        }
                    }
                }
                var row = rows[0];
                if (row.hasOwnProperty('pid')) {
                    return jx.treeConvert(rows, options.useFolderIcon);
                }
            }
            if (_loadFilter) {
                _loadFilter.call(this, rows);
            }
            return rows;
        };

        var _onClick = options.onClick;
        options.onClick = function (node) {
            if (options.clickToggle) {
                $(this).tree('toggle', node.target);
            }
            if (_onClick) {
                _onClick.call(this, node);
            }
        };

        // var _onCheck = options.onCheck;
        // options.onCheck = function (node, checked) {
        //     if (checked) {
        //         $(node.target).find('.tree-title').addClass('tree-node-yellow');
        //     } else {
        //         $(node.target).find('.tree-title').removeClass('tree-node-yellow');
        //     }
        //     if (_onCheck) {
        //         _onCheck.call(this, node, checked);
        //     }
        // };

        var _onDragOver = options.onDragOver;
        options.onDragOver = function (target, source) {
            if (_onDragOver) {
                var result = _onDragOver.call(this, target, source);
                if (result === false) {
                    return false;
                }
            }
            var id = source.id;
            var $this = $(this);
            var sourceNode = $this.tree('find', id);
            var parentNode = $this.tree('getParent', sourceNode.target);
            var targetNode = $this.tree('getNode', target);
            if ((parentNode && parentNode.id) === targetNode.id) {
                return false;
            }
            return true;
        };

        var _onBeforeDrag = options.onBeforeDrag;
        options.onBeforeDrag = function (node) {
            var id = node.id;
            var sourceNode = $(this).tree('find', id);
            var parentNode = $(this).tree('getParent', sourceNode.target);
            options.source_pid = parentNode && parentNode.id;

            if (_onBeforeDrag) {
                _onBeforeDrag.call(this, node);
            }
        };

        var _onDrop = options.onDrop;
        options.onDrop = function (target, source, point) {
            var id = source.id;
            var $this = $(this);
            var sourceNode = $this.tree('find', id);
            var targetNode = $this.tree('getNode', target);
            var parentNode = $this.tree('getParent', sourceNode.target);
            var target_pid = point === 'append' ? targetNode.id : parentNode && parentNode.id;
            if (!target_pid || target_pid === '0' || target_pid === 0) {
                target_pid = 0;
            }
            var source_pid = options.source_pid;
            if (!source_pid || source_pid === '0' || source_pid === 0) {
                source_pid = 0;
            }

            var parentIds = [];
            parentIds.push(source_pid);
            parentIds.push(target_pid);

            var indexs = [];
            var objs = {};
            $.each(parentIds, function (i, v) {
                var row = $element.tree('find', v);
                if (row == null) {
                    var sz = $element.tree('getRoots');
                    $.each(sz, function (index, value) {
                        var id = value.id;
                        var parentNode = $element.tree('getParent', value.target);
                        if (!objs[id]) {
                            //console.log(value);
                            indexs.push({id: id, parentId: (parentNode && parentNode.id) || 0, index: index});
                            objs[id] = 1;
                        }
                    });
                } else if (row.children) {
                    $.each(row.children, function (index, value) {
                        var id = value.id;
                        var parentNode = $element.tree('getParent', value.target);
                        if (!objs[id]) {
                            // console.log(value);
                            indexs.push({id: id, parentId: (parentNode && parentNode.id) || 0, index: index});
                            objs[id] = 1;
                        }
                    });
                }
            });

            // var pd = {data: JSON.stringify(indexs)};
            var pd = JSON.stringify(indexs);
            // var pd = {id: id, source_pid: source_pid, target_pid: target_pid};
            if (jx.debug) {
                console.log(pd);
            }
            if (options.dndUrl) {
                jx.ajax({
                    url: options.dndUrl,
                    contentType: "application/json; charset=utf-8",
                    data: pd,
                    dataType: "json",
                    //maskMsg: '正在修改数据状态,请稍等...',
                    success: function (result) {
                        if (!result.success) {
                            toastr.error(result.msg);
                        }
                    }
                });
                // $.post(options.dndUrl, pd, function (result) {
                //     if (!result.success) {
                //         toastr.error(result.msg);
                //     }
                // });
            }

            if (_onDrop) {
                _onDrop.call(this, targetRow, sourceRow, point);
            }
        };

        //endregion

        $element.tree(options);
    }();

    return {
        /**
         * 获取节点Id根据级别
         * @param level
         * @return {number}
         */
        getIdByLevel: function (level) {
            return getIdByLevel(level);
        },

        /**
         * 高亮显示选中的节点
         */
        highlightCheckedNode: function () {
            $.each($element.tree('getChecked', ['checked', 'indeterminate']), function (i, v) {
                var node = $(v.target).find('.tree-title');
                if (!node.hasClass('tree-node-yellow')) {
                    node.addClass('tree-node-yellow');
                }
            });
        },

        /**
         * 重新设置高亮显示选中的节点
         */
        reHighlightCheckedNode: function () {
            function _core(v) {
                var title = $(v.target).find('.tree-title');
                if (title.hasClass('tree-node-yellow')) {
                    title.removeClass('tree-node-yellow');
                }
                if (v.checkState === 'checked' || v.checkState === 'indeterminate') {
                    title.addClass('tree-node-yellow');
                }
            }

            $.each($element.tree('getRoots'), function (i, v) {
                _core(v);
                $.each($element.tree('getChildren', v.target), function (ci, cv) {
                    _core(cv);
                });
            });
        },

        /**
         * 获取数节点的排序路径
         * @param nid 节点Id
         */
        getPath: function (nid) {
            return getPath(nid);
        },

        /**
         * 获取节点序号
         * @param nid 节点Id
         * @param nodes 待查找的节点集合
         */
        getIndex: function (nid, nodes) {
            return getIndex(nid, nodes);
        },

        /**
         * 展开根节点
         */
        expandRoot: function () {
            expandRoot();
        },

        getLevelById: function (level) {
            var i = 1;
            var node = this.getRoot();
            while (i < level) {
                i++;
                node = getChildNode(node);
                if (!node) {
                    break;
                }
            }
            if (node) {
                return node.id;
            }
            return 0;
        },
        /**
         * 指定延迟时间进行本地过滤
         */
        delayFilter: function (val, delayTime, callback) {
            options.delayFilter(val, delayTime, callback);
        },
        /**
         * 清除节点选中节点或者复选框
         */
        clearSelectedOrChecked: function () {
            clearSelectedOrChecked();
        },
        /**
         * 选中节点或者复选框
         * @param val 节点id值(多选值分隔符隔开)
         * @param separator 分隔符
         */
        selectedOrCheckedNode: function (val, separator) {
            selectedOrCheckedNode(val, separator);
        },
        /**
         * 获取节选中点或者复选框值
         * @param separator 分隔符
         */
        getSelectedOrCheckedData: function (separator) {
            return getSelectedOrCheckedData(separator);
        },
        /**
         * 滚动到选中节点或者复选节点
         */
        scrollToSelectedOrCheckedNode: function () {
            return scrollToSelectedOrCheckedNode();
        },

        /**
         * 返回树控件属性
         */
        options: function () {
            return $element.tree('options');
        },

        /**
         * 读取树控件数据
         * @param data 待加载的数据
         */
        loadData: function (data) {
            return $element.tree('loadData', data);
        },

        /**
         * 获取指定节点对象。
         * @param target 节点的DOM对象
         * @returns 返回指定的节点对象
         */
        getNode: function (target) {
            return $element.tree('getNode', target);
        },

        /**
         * 获取指定节点数据，包含它的子节点。
         * @param target 节点的DOM对象
         */
        getData: function (target) {
            return $element.tree('getData', target);
        },

        /**
         * 重新载入树控件数据。
         * @param target 节点的DOM对象
         */
        reload: function (target) {
            return $element.tree('reload', target);
        },

        /**
         * 获取通过“nodeEl”参数指定的节点的顶部父节点元素。
         * @param nodeEl 节点选择器字符串
         */
        getRoot: function (nodeEl) {
            return $element.tree('getRoot', nodeEl);
        },

        /**
         * 获取所有根节点，返回节点数组。
         */
        getRoots: function () {
            return $element.tree('getRoots');
        },

        /**
         * 获取父节点，'target'参数代表节点的DOM对象。
         * @param target 节点的DOM对象
         */
        getParent: function (target) {
            return $element.tree('getParent', target);
        },

        /**
         * 获取所有子节点，'target'参数代表节点的DOM对象。
         * @param target 节点的DOM对象
         * @returns
         */
        getChildren: function (target) {
            return $element.tree('getChildren', target);
        },

        /**
         * 获取所有选中的节点。'state'可用值有：'checked','unchecked','indeterminate'。
         * 如果'state'未指定，将返回'checked'节点。
         * @param state 可用值有：'checked','unchecked','indeterminate'。
         * @returns
         */
        getChecked: function (state) {
            return $element.tree('getChecked', state);
        },

        /**
         * 获取选中节点,如果未选择则返回null.
         * @returns 如果未选择则返回null.
         */
        getSelected: function () {
            return $element.tree('getSelected');
        },

        /**
         * 判断指定的节点是否是叶子节点，target参数是一个节点DOM对象。
         * @param target 节点的DOM对象
         */
        isLeaf: function (target) {
            return $element.tree('isLeaf', target);
        },

        /**
         * 查找指定节点并返回节点对象。
         * @param id 节点Id
         */
        find: function (id) {
            return $element.tree('find', id);
        },

        /**
         * 选择一个节点，'target'参数表示节点的DOM对象。
         * @param target 节点的DOM对象
         */
        select: function (target) {
            return $element.tree('select', target);
        },

        /**
         * 选中指定节点。
         * @param target 节点的DOM对象
         */
        check: function (target) {
            return $element.tree('check', target);
        },

        /**
         * 取消选中指定节点。
         * @param target 节点的DOM对象
         */
        uncheck: function (target) {
            return $element.tree('uncheck', target);
        },

        /**
         * 折叠一个节点，'target'参数表示节点的DOM对象。
         * @param target 节点的DOM对象
         */
        collapse: function (target) {
            return $element.tree('collapse', target);
        },

        /**
         * 展开一个节点，'target'参数表示节点的DOM对象。
         * 在节点关闭或没有子节点的时候，节点ID的值(名为'id'的参数)将会发送给服务器请求子节点的数据。
         * @param target 节点的DOM对象
         */
        expand: function (target) {
            return $element.tree('expand', target);
        },

        /**
         * 折叠所有节点。
         * @param target 节点的DOM对象
         */
        collapseAll: function (target) {
            return $element.tree('collapseAll', target);
        },

        /**
         * 展开所有节点。
         * @param target 节点的DOM对象
         */
        expandAll: function (target) {
            return $element.tree('expandAll', target);
        },

        /**
         * 打开从根节点到指定节点之间的所有节点。
         * @param target 节点的DOM对象
         */
        expandTo: function (target) {
            return $element.tree('expandTo', target);
        },

        /**
         * 滚动到指定节点。
         * @param target 节点的DOM对象
         */
        scrollTo: function (target) {
            return $element.tree('scrollTo', target);
        },

        /**
         * 追加若干子节点到一个父节点，
         * param参数有2个属性：
         * parent：DOM对象，将要被追加子节点的父节点，如果未指定，子节点将被追加至根节点。
         * data：数组，节点数据。
         * @param param
         */
        append: function (param) {
            return $element.tree('append', param);
        },

        /**
         * 打开或关闭节点的触发器
         * @param target 节点DOM对象
         */
        toggle: function (target) {
            $element.tree('toggle', target);
        },

        /**
         * 在一个指定节点之前或之后插入节点，
         * 'param'参数包含如下属性：
         * before：DOM对象，在某个节点之前插入。
         * after：DOM对象，在某个节点之后插入。
         * data：对象，节点数据。
         * @param param
         */
        insert: function (param) {
            return $element.tree('insert', param);
        },

        /**
         * 移除一个节点和它的子节点，'target'参数是该节点的DOM对象。
         * @param target 节点的DOM对象
         */
        remove: function (target) {
            $element.tree('remove', target);
        },

        /**
         * 移除一个节点和它的子节点，该方法跟remove方法一样，不同的是它将返回被移除的节点数据。
         * @param target 节点的DOM对象
         */
        pop: function (target) {
            return $element.tree('pop', target);
        },

        /**
         * 更新指定节点。'param'参数包含以下属性：
         * target(DOM对象，将被更新的目标节点)，id，text，iconCls，checked等。
         * @param param
         */
        update: function (param) {
            return $element.tree('update', param);
        },

        /**
         * 启用拖拽功能。
         */
        enableDnd: function () {
            return $element.tree('enableDnd');
        },

        /**
         * 禁用拖拽功能。
         */
        disableDnd: function () {
            return $element.tree('disableDnd');
        },

        /**
         * 开始编辑一个节点。
         * @param target 节点的DOM对象
         */
        beginEdit: function (target) {
            return $element.tree('beginEdit', target);
        },

        /**
         * 结束编辑一个节点。
         * @param target 节点的DOM对象
         */
        endEdit: function (target) {
            return $element.tree('endEdit', target);
        },

        /**
         * 取消编辑一个节点。
         * @param target 节点的DOM对象
         */
        cancelEdit: function (target) {
            return $element.tree('cancelEdit', target);
        },

        /**
         * 过滤操作，和filter属性功能类似
         * $('#tt').tree('doFilter', '');    // 清除过滤器
         * @param text 查询关键字
         */
        doFilter: function (text) {
            return $element.tree('doFilter', text);
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxtree',
    create: jx.ui.Tree,
    options: function (element) {
        return jx.parseOptions($(element), ['url', 'dndUrl', 'method', 'loadEmptyMessage', 'filterEmptyMessage', 'defaultIconCls', 'maskMsg', {
            animate: 'boolean',
            checkbox: 'boolean',
            cascadeCheck: 'boolean',
            onlyLeafCheck: 'boolean',
            lines: 'boolean',
            dnd: 'boolean',
            clickToggle: 'boolean',
            data: 'array',
            queryParams: 'object',
            filterBox: 'jquery',
            maskTarget: 'jquery',
            maskDelay: 'number'
        }]);
    },
    defaults: {
        /**
         * 检索数据的HTTP方法(get/post)
         */
        method: 'get',

        /**
         * 过滤文本框
         */
        filterBox: null,

        /**
         * 加载为空消息
         */
        loadEmptyMessage: '加载的结果为空',

        /**
         * 过滤结果为空消息
         */
        filterEmptyMessage: '未找到符合条件的结果',

        /**
         * 单击节点切换展开状态
         */
        clickToggle: true,

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
        maskDelay: 1000,

        dndUrl: null,

        defaultIconCls: null,//节点默认图标样式

        useFolderIcon: false,//使用文件夹图标
    }
});