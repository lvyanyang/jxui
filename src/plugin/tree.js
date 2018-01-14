/**
 * 树组件
 */

(function ($) {

    //插件类
    var Tree = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        var filterTimeoutId;
        var $nodataAlert;

        var init = function () {

            if (!options.maskTarget) {
                options.maskTarget = $element;
            }
            if (options.params) {
                $.extend(options.queryParams, options.params);
            }
            $element.addClass('jxtree-container');
            //定义无过滤结果时的提示,在加载成功后添加进去
            $nodataAlert = $('<div class="alert alert-warning nodata" role="alert"></div>');

            //#region 初始化函数

            options.filter = _filter;

            var _beforeLoad = options.onBeforeLoad;
            options.onBeforeLoad = function (node, param) {
                if (options.url) {
                    options.maskTarget.mask(options.maskMsg, options.maskDelay);
                }
                if (_beforeLoad) {
                    _beforeLoad.call(this, node, param);
                }
            };

            var _onLoadSuccess = options.onLoadSuccess;
            options.onLoadSuccess = function (node, data) {
                options.maskTarget.unmask();
                if (_onLoadSuccess) {
                    _onLoadSuccess.call(this, node, data);
                }
                _initNodataAlert();
                if (!data || data.length == 0) {
                    $nodataAlert.html(options.loadEmptyMessage);
                    $nodataAlert.show();
                }
                else {
                    $nodataAlert.html('');
                    $nodataAlert.hide();
                }
            };

            var _loadError = options.onLoadError;
            options.onLoadError = function (result) {
                options.maskTarget.unmask();
                onFail(result);
                if (_loadError) {
                    _loadError(msg);
                }
            };

            var _loadFilter = options.loadFilter;
            options.loadFilter = function (rows) {
                if (_loadFilter) {
                    _loadFilter.call(this, rows);
                }
                if (options.convert == true) {
                    return jx.treeConvert(rows);
                } else {
                    return rows;
                }
            };

            var _onClick = options.onClick;
            options.onClick = function (node) {
                if (options.clickToggle) {
                    toggle(node.target);
                }
                if (_onClick) {
                    _onClick.call(this, node);
                }
            };

            var _onCheck = options.onCheck;
            options.onCheck = function (node, checked) {
                if (checked) {
                    $(node.target).find('.tree-title').addClass('tree-node-yellow');
                } else {
                    $(node.target).find('.tree-title').removeClass('tree-node-yellow');
                }
                if (_onCheck) {
                    _onCheck.call(this, node, checked);
                }
            };

            var _onDrop = options.onDrop;
            options.onDrop = function (target, source, point) {
                if (_onDrop) {
                    _onDrop.call(this, target, source, point);
                }

                _dropHandle(self, target, source, point);
            };

            //#endregion

            $element.tree(options);
        };

        var _initNodataAlert = function () {
            if ($element.children('nodata').length > 0) return;
            $element.prepend($nodataAlert);
            if (options.filterBox) {
                options.filterBox.on('input', function (e) {
                    var val = $(this).val().trim();
                    delayFilter(val, 500, function () {
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
            }
        };

        /**
         * 获取节点Id根据级别
         * @param level
         * @return {number}
         */
        var getIdByLevel = function (level) {
            var i = 1;
            var node = getRoot();
            while (i < level) {
                i++;
                node = getChildFirstNode(node);
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
            var node = find(nid);
            var parentNode = getParent(node.target);
            if (parentNode) {
                var pstring = '';
                if (parentNode.id != '0') {
                    pstring = getPath(parentNode.id);
                }
                return pstring + jx.fixLen(getIndex(nid, parentNode.children), 4, '0');
            } else {
                return jx.fixLen(getIndex(nid, this.getRoots()), 4, '0');
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
         * 查找指定节点并返回节点对象。
         * @param id 节点Id
         */
        var find = function (id) {
            return $element.tree('find', id);
        };

        /**
         * 获取通过“nodeEl”参数指定的节点的顶部父节点元素。
         * @param nodeEl 节点选择器字符串
         */
        var getRoot = function (nodeEl) {
            return $element.tree('getRoot', nodeEl);
        };

        /**
         * 获取所有根节点，返回节点数组。
         */
        var getRoots = function () {
            return $element.tree('getRoots');
        };

        /**
         * 打开或关闭节点的触发器
         * @param target 节点DOM对象
         */
        var toggle = function (target) {
            $element.tree('toggle', target);
        };

        /**
         * 获取父节点，'target'参数代表节点的DOM对象。
         * @param target 节点的DOM对象
         */
        var getParent = function (target) {
            return $element.tree('getParent', target);
        };

        /**
         * 显示失败信息
         * @param result
         * @private
         */
        var onFail = function (result) {
            var jobject = {};
            var msg = '';
            if (!result['responseJSON']) {
                msg = jx.getBody(result.responseText) || result.responseText;
            }
            else {
                msg = result['responseJSON'].message;
            }
            $element.append('<pre>' + msg + '</pre>');
        };

        /**
         * 指定延迟时间进行本地过滤
         * @param val
         * @param delayTime
         * @param callback
         */
        var delayFilter = function (val, delayTime, callback) {
            if (!delayTime) {
                delayTime = 500;
            }
            if (filterTimeoutId && filterTimeoutId > 0) {
                clearTimeout(filterTimeoutId);
            }
            filterTimeoutId = setTimeout(function () {
                if (jx.debug) {
                    console.log('过滤tree数据，关键字：' + val);
                }
                $element.tree('doFilter', val);
                if (callback) {
                    callback();
                }
            }, delayTime);
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
                $(node.target).removeClass("tree-node-selected")
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
        var selectedOrCheckedNode = function (val,separator) {
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
            if(node){
                $element.jxscrollTo($(node.target));
            }
        };

        //region 私有函数

        var _dropHandle = function (self, target, source, point) {
            var $tree = self.$element;
            var targetId = $tree.tree('getNode', target).id;
            var sourceParentId = source.parentid;
            var sourceId = source.id;
            var sourceNode = $tree.tree('find', sourceId);
            var newParentNode = $tree.tree('getParent', sourceNode.target);
            var newParentId = newParentNode.id;

            if (sourceParentId != newParentId) {//改变父节点
                var _parentUrl = $tree.data('parentUrl');
                if (_parentUrl) {
                    var _postData = {
                        id: sourceId,
                        newParentId: newParentId
                    };
                    $.post(_parentUrl, _postData, function (result) {
                        if (result.message) {
                            jx.alert(result.message);
                        }
                    });
                }
            }

            var _sortUrl = $tree.data('sortUrl');
            if (_sortUrl) {
                var node = $tree.tree('find', newParentId);
                if (!node) {
                    jx.alert('更新节点顺序出错,无效的节点Id');
                    return;
                }
                var sortData = {};
                var childs = node.children || {};
                $.each(childs, function (index, value) {
                    sortData[value.id] = self.getPath(value.id);
                });
                //更新节点序号
                $.post(_sortUrl, sortData, function (result) {
                    if (result.message) {
                        jx.alert(result.message);
                    }
                });
            }
        };

        var _filter = function (q, node) {
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

        var getChildFirstNode = function (node) {
            if (!node) return null;
            if (node.children && node.children.length > 0) {
                return node.children[0];
            }
        };

        //endregion

        //初始化插件
        init();

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

            /**
             * 查找指定节点并返回节点对象。
             * @param id 节点Id
             */
            find: function (id) {
                return find(id);
            },

            /**
             * 获取通过“nodeEl”参数指定的节点的顶部父节点元素。
             * @param nodeEl 节点选择器字符串
             */
            getRoot: function (nodeEl) {
                return getRoot(nodeEl);
            },

            /**
             * 获取所有根节点，返回节点数组。
             */
            getRoots: function () {
                return getRoots();
            },

            getSelected:function(){
                return $element.tree('getSelected');
            },
            getChecked:function(){
                return $element.tree('getChecked');
            },

            /**
             * 打开或关闭节点的触发器
             * @param target 节点DOM对象
             */
            toggle: function (target) {
                toggle(target);
            },

            /**
             * 获取父节点，'target'参数代表节点的DOM对象。
             * @param target 节点的DOM对象
             */
            getParent: function (target) {
                return getPath(target);
            },
            /**
             * 指定延迟时间进行本地过滤
             */
            delayFilter: function (val, delayTime, callback) {
                delayFilter(val, delayTime, callback);
            },
            /**
             * 清除节点选中节点和复选框
             */
            clearSelectedOrChecked : function () {
                clearSelectedOrChecked();
            },
            /**
             * 选中节点或者复选框
             * @param val 节点id值(多选值分隔符隔开)
             * @param separator 分隔符
             */
            selectedOrCheckedNode : function (val,separator) {
                selectedOrCheckedNode(val,separator);
            },
            /**
             * 获取节选中点或者复选框值
             * @param separator 分隔符
             */
            getSelectedOrCheckedData : function (separator) {
                return getSelectedOrCheckedData(separator);
            },
            /**
             * 滚动到选中节点或者复选节点
             */
            scrollToSelectedOrCheckedNode : function () {
                return scrollToSelectedOrCheckedNode();
            }
        }
    };

    //插件定义
    jx.plugin({
        name: 'jxtree',
        instance: function ($ele, ops) {
            return Tree($ele, ops);
        },
        options: function ($ele) {
            return jx.parseOptions($ele, ['url', 'method', {convert: 'boolean'}]);
        },
        defaults: {

            method: 'get',

            /**
             * 过滤文本框
             */
            filterBox: null,

            /**
             * 加载为空消息
             */
            loadEmptyMessage:'加载的结果为空',

            /**
             * 过滤结果为空消息
             */
            filterEmptyMessage:'未找到符合条件的结果',

            /**
             * 是否转换为tree对象结构
             */
            convert: true,

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
            maskDelay: 100
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxtree').jxtree();
    });

}(jQuery));