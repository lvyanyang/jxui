/**
 * 树形表格组件
 */

//插件操作类
jx.ui.TreeGrid = function (element, options) {
    var $element = $(element);

    var init = function () {

        var _onBeforeLoad = options.onBeforeLoad;
        options.onBeforeLoad = function (row, param) {
            if (_onBeforeLoad) {
                var result = _onBeforeLoad.call(this, row, param);
                if (result === false) {
                    return false;
                }
            }

            if (options.url) {
                $element.datagrid("getPanel").parent().mask(options.maskMsg, 300);
            }
        };

        var _onLoadSuccess = options.onLoadSuccess;
        options.onLoadSuccess = function (row, data) {
            var $panel = $element.datagrid("getPanel");
            $panel.parent().unmask();

            jx._grid._getErrorPanel($element, options).hide();
            var $noPanel = jx._grid._getNoPanel($element, options);
            //错误提示
            if (data.success) {
                //无数据提示
                if (data && ((Array.isArray(data) && data.length === 0) || (data.rows.length === 0))) {
                    $noPanel.show();
                }
                else {
                    $noPanel.hide();
                }

                if (options.dnd === true) {
                    $element.treegrid('enableDnd', null);
                }
                // if(row==null){
                //     $element.datagrid("getPanel").find('.pagination-info').text('共'+data.total+'条记录');
                // }
                if (_onLoadSuccess) {
                    _onLoadSuccess.call(this, row, data);
                }
            }
            else {
                jx._grid._getErrorPanel($element, options).html(data.msg).show();
            }
        };

        var _onLoadError = options.onLoadError;
        options.onLoadError = function (httpRequest) {
            $element.datagrid("getPanel").parent().unmask();
            jx._grid._getErrorPanel($element, options).html(jx.getAjaxError(httpRequest)).show();
            if (_onLoadError) {
                _onLoadError.call(this, httpRequest);
            }
        };

        var _loadFilter = options.loadFilter;
        options.loadFilter = function (data, parentId) {
            data && data.rows && data.rows.forEach(function (v) {
                if (jx.isUndefined(v._parentId) && v.parentId) {
                    v._parentId = v.parentId;
                }
                if (v._parentId && (v._parentId === '0' || v._parentId === 0)) {
                    v._parentId = null;
                }
                if (!v.iconCls && options.defaultIconCls) {
                    if (!jx.isUndefined(v.leaf) && v.leaf === 0) {
                        v.iconCls = null;
                    }
                    else {
                        v.iconCls = options.defaultIconCls;
                    }
                }
            });
            if (_loadFilter) {
                _loadFilter.call(this, data, parentId);
            }
            return data;
        };

        var _onDragOver = options.onDragOver;
        options.onDragOver = function (targetRow, sourceRow) {
            if (_onDragOver) {
                var result = _onDragOver.call(this, targetRow, sourceRow);
                if (result === false) {
                    return false;
                }
            }

            if (sourceRow._parentId === targetRow[options.idField || 'Id']) {
                return false;
            }
        };

        var _onBeforeDrop = options.onBeforeDrop;
        options.onBeforeDrop = function (targetRow, sourceRow) {
            options.source_pid = sourceRow._parentId;

            if (_onBeforeDrop) {
                _onBeforeDrop.call(this, targetRow, sourceRow);
            }
        };

        var _onDrop = options.onDrop;
        options.onDrop = function (targetRow, sourceRow, point) {
            var id = sourceRow[options.idField || 'Id'];
            var target_pid = point === 'append' ? targetRow[options.idField || 'Id'] : targetRow._parentId;
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
                var row = $element.treegrid('find', v);
                if (row == null) {
                    var sz = $element.treegrid('getRoots');
                    $.each(sz, function (index, value) {
                        var id = value[options.idField || 'Id'];
                        if (!objs[id]) {
                            //console.log(value);
                            indexs.push({id: id, parentId: value._parentId || 0, index: index});
                            objs[id] = 1;
                        }
                    });
                } else if (row.children) {
                    $.each(row.children, function (index, value) {
                        var id = value[options.idField || 'Id'];
                        if (!objs[id]) {
                            // console.log(value);
                            indexs.push({id: id, parentId: value._parentId || 0, index: index});
                            objs[id] = 1;
                        }
                    });
                }
            });

            // var pd = {id: id, source_pid: source_pid, target_pid: target_pid, indexs: JSON.stringify(indexs)};
            // var pd = {data: JSON.stringify(indexs)};
            var pd = JSON.stringify(indexs);

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

        $element.treegrid(options);
        $element.datagrid('getPager').pagination({
            layout: ['info'],
            displayMsg: '共{total}条记录'
        });
        jx._grid._initForm($element, options, $.fn.treegrid.methods.load);
    }();

    return {
        reloadGridData: function () {
            $element.data('treegrid').checkedRows = [];
            this.reload();
        },
        loadGridData: function (param) {
            $element.data('treegrid').checkedRows = [];
            this.load(param);
        },

        getRowId: function (row) {
            var ops = this.options();
            var idField = ops['idField'];
            if (row && idField && row[idField]) {
                return row[idField];
            }
            return null;
        },
        getDataBodyPanel: function () {
            return $element.data('treegrid').dc.body2;
        },
        getSelectedRowId: function () {
            var row = this.getSelected();
            return this.getRowId(row);
        },
        getCheckedRowIds: function () {
            var ids = [];
            var rows = this.getCheckedNodes();
            var ops = this.options();
            var idField = ops['idField'];
            if (rows.length > 0 && idField) {
                for (var i = 0; i < rows.length; i++) {
                    var r = rows[i];
                    if (r[idField]) {
                        ids.push(r[idField]);
                    }
                }
            }
            return ids;
        },
        hasSelectedRow: function (errorCallback) {
            var selected = this.getSelected();
            if (!selected) {
                if (errorCallback) {
                    errorCallback();
                }
                else {
                    toastr.error('请先选择数据项后再操作！');
                }
                return false;
            }
            return true;
        },
        hasCheckedRow: function (errorCallback) {
            var checkRows = this.getCheckedNodes();
            if (checkRows.length === 0) {
                if (errorCallback) {
                    errorCallback();
                }
                else {
                    toastr.error('请先勾选数据项后再操作！');
                }
                return false;
            }
            return true;
        },

        options: function () {
            return $element.treegrid('options');
        },
        resize: function (options) {
            return $element.treegrid('resize', options);
        },
        fixRowHeight: function (id) {
            return $element.treegrid('fixRowHeight', id);
        },
        loadData: function (data) {
            return $element.treegrid('loadData', data);
        },
        load: function (param) {
            return $element.treegrid('load', param);
        },
        reload: function (id) {
            return $element.treegrid('reload', id);
        },
        reloadFooter: function (footer) {
            return $element.treegrid('reloadFooter', footer);
        },
        getPanel: function () {
            return $element.datagrid('getPanel');
        },
        getData: function () {
            return $element.treegrid('getData');
        },
        getFooterRows: function () {
            return $element.treegrid('getFooterRows');
        },
        getRoot: function () {
            return $element.treegrid('getRoot');
        },
        getRoots: function () {
            return $element.treegrid('getRoots');
        },
        getParent: function (id) {
            return $element.treegrid('getParent', id);
        },
        getChildren: function (id) {
            return $element.treegrid('getChildren', id);
        },
        getLevel: function (id) {
            return $element.treegrid('getLevel', id);
        },
        find: function (id) {
            return $element.treegrid('find', id);
        },
        isLeaf: function (id) {
            return $element.treegrid('isLeaf', id);
        },
        select: function (id) {
            return $element.treegrid('select', id);
        },
        unselect: function (id) {
            return $element.treegrid('unselect', id);
        },
        collapse: function (id) {
            return $element.treegrid('collapse', id);
        },
        expand: function (id) {
            return $element.treegrid('expand', id);
        },
        toggle: function (id) {
            return $element.treegrid('toggle', id);
        },
        collapseAll: function (id) {
            return $element.treegrid('collapseAll', id);
        },
        expandAll: function (id) {
            return $element.treegrid('expandAll', id);
        },
        expandTo: function (id) {
            return $element.treegrid('expandTo', id);
        },
        append: function (param) {
            return $element.treegrid('append', param);
        },
        insert: function (param) {
            return $element.treegrid('insert', param);
        },
        remove: function (id) {
            return $element.treegrid('remove', id);
        },
        pop: function (id) {
            return $element.treegrid('pop', id);
        },
        refresh: function (id) {
            return $element.treegrid('refresh', id);
        },
        update: function (param) {
            return $element.treegrid('update', param);
        },
        beginEdit: function (id) {
            return $element.treegrid('beginEdit', id);
        },
        endEdit: function (id) {
            return $element.treegrid('endEdit', id);
        },
        cancelEdit: function (id) {
            return $element.treegrid('cancelEdit', id);
        },
        showLines: function () {
            return $element.treegrid('showLines');
        },
        setSelectionState: function () {
            return $element.treegrid('setSelectionState');
        },
        getSelected: function () {
            return $element.treegrid('getSelected');
        },
        getSelections: function () {
            return $element.treegrid('getSelections');
        },
        getCheckedNodes: function (checked) {
            return $element.treegrid('getCheckedNodes', checked);
        },
        checkNode: function (id) {
            return $element.treegrid('checkNode', id);
        },
        uncheckNode: function (id) {
            return $element.treegrid('uncheckNode', id);
        },
        clearChecked: function () {
            return $element.treegrid('clearChecked');
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxtreegrid',
    create: jx.ui.TreeGrid,
    defaults: {
        form: false,//查询表单对象
        defaultIconCls: null,//节点默认图标样式
        dnd: true,
        dndUrl: null,
        idField: 'Id',
        fit: true,
        method: 'get',
        border: false,
        striped: false,
        rownumbers: true,
        loadMsg: null,
        maskMsg: '正在加载数据,请稍等...',
        animate: false,
        fitColumns: false,
        collapsible: true,
        checkbox: false,
        pagination: true
    }
});
