/**
 * 表格组件
 */

jx.ui.Grid = function (element, options) {
    var $element = $(element);

    var init = function () {

        //region 函数重写

        var _onBeforeLoad = options.onBeforeLoad;
        options.onBeforeLoad = function (param) {
            if (_onBeforeLoad) {
                var result = _onBeforeLoad.call(this, param);
                if (result === false) {
                    return false;
                }
            }
            if (param.sort) {
                param.sort = jx.humpToLine(param.sort);
            }
            if (options.url) {
                // console.log($element.datagrid("getPanel"));
                $element.datagrid("getPanel").find('.datagrid-view').mask(options.maskMsg, 300);
            }
        };

        var _onLoadSuccess = options.onLoadSuccess;
        options.onLoadSuccess = function (result) {
            var $panel = $element.datagrid("getPanel");
            $panel.find('.datagrid-view').unmask();

            jx._grid._getErrorPanel($element, options).hide();
            var $noPanel = jx._grid._getNoPanel($element, options);
            //错误提示
            if(result.success){
                //无数据提示
                if (result && ((Array.isArray(result.rows) && result.rows.length === 0))) {
                    $noPanel.show();
                }
                else {
                    $noPanel.hide();
                }
                if (_onLoadSuccess) {
                    _onLoadSuccess.call(this, result);
                }
            }
            else {
                jx._grid._getErrorPanel($element, options).html(result.msg).show();
            }
        };

        var _onLoadError = options.onLoadError;
        options.onLoadError = function (httpRequest) {
            $element.datagrid("getPanel").find('.datagrid-view').unmask();
            jx._grid._getErrorPanel($element, options).html(jx.getAjaxError(httpRequest)).show();
            if (_onLoadError) {
                _onLoadError.call(this, httpRequest);
            }
        };

        //endregion

        $element.datagrid(options);
        jx._grid._initForm($element, options, function ($e, par) {
            $.fn.datagrid.methods.clearSelections($e);
            $.fn.datagrid.methods.clearChecked($e);
            $.fn.datagrid.methods.load($e, par);
        });
    }();

    return {
        reloadGridData: function (param) {
            this.clearSelections();
            this.clearChecked();
            this.reload(param);
        },
        loadGridData: function (param) {
            this.clearSelections();
            this.clearChecked();
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
        getDataBodyPanel:function () {
            return $element.data('datagrid').dc.body2;
        },
        getSelectedRowId: function () {
            var row = this.getSelected();
            return this.getRowId(row);
        },
        getCheckedRowIds: function () {
            var ids = [];
            var rows = this.getChecked();
            var ops = this.options();
            var idField = ops['idField'];
            if (rows.length > 0 && idField) {
                for (var i = 0; i < rows.length; i++) {
                    var r = rows[i];
                    if(r[idField]){
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
            var checkRows = this.getChecked();
            if (checkRows.length === 0) {
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

        options: function () {
            return $element.datagrid('options');
        },
        setSelectionState: function () {
            return $element.datagrid('setSelectionState');
        },
        createStyleSheet: function () {
            return $element.datagrid('createStyleSheet');
        },
        getPanel: function () {
            return $element.datagrid('getPanel');
        },
        getPager: function () {
            return $element.datagrid('getPager');
        },
        getColumnFields: function (frozen) {
            return $element.datagrid('getColumnFields', frozen);
        },
        getColumnOption: function (field) {
            return $element.datagrid('getColumnOption', field);
        },
        resize: function (param) {
            return $element.datagrid('resize', param);
        },
        load: function (param) {
            return $element.datagrid('load', param);
        },
        reload: function (param) {
            return $element.datagrid('reload', param);
        },
        reloadFooter: function (footer) {
            return $element.datagrid('reloadFooter', footer);
        },
        loading: function () {
            return $element.datagrid('loading');
        },
        loaded: function () {
            return $element.datagrid('loaded');
        },
        fitColumns: function () {
            return $element.datagrid('fitColumns');
        },
        fixColumnSize: function (field) {
            return $element.datagrid('fixColumnSize', field);
        },
        fixRowHeight: function (index) {
            return $element.datagrid('fixRowHeight', index);
        },
        freezeRow: function (index) {
            return $element.datagrid('freezeRow', index);
        },
        autoSizeColumn: function (field) {
            return $element.datagrid('autoSizeColumn', field);
        },
        loadData: function (data) {
            return $element.datagrid('loadData', data);
        },
        getData: function () {
            return $element.datagrid('getData');
        },
        getRows: function () {
            return $element.datagrid('getRows');
        },
        getFooterRows: function () {
            return $element.datagrid('getFooterRows');
        },
        getRowIndex: function (id) {
            return $element.datagrid('getRowIndex');
        },
        getChecked: function () {
            return $element.datagrid('getChecked');
        },
        getSelected: function () {
            return $element.datagrid('getSelected');
        },
        getSelections: function () {
            return $element.datagrid('getSelections');
        },
        clearSelections: function () {
            return $element.datagrid('clearSelections');
        },
        clearChecked: function () {
            return $element.datagrid('clearChecked');
        },
        scrollTo: function (index) {
            return $element.datagrid('scrollTo', index);
        },
        highlightRow: function (index) {
            return $element.datagrid('highlightRow', index);
        },
        selectAll: function () {
            return $element.datagrid('selectAll');
        },
        unselectAll: function () {
            return $element.datagrid('unselectAll');
        },
        selectRow: function (index) {
            return $element.datagrid('selectRow', index);
        },
        selectRecord: function (id) {
            return $element.datagrid('selectRecord', id);
        },
        unselectRow: function (index) {
            return $element.datagrid('unselectRow', index);
        },
        checkRow: function (index) {
            return $element.datagrid('checkRow', index);
        },
        uncheckRow: function (index) {
            return $element.datagrid('uncheckRow', index);
        },
        checkAll: function () {
            return $element.datagrid('checkAll');
        },
        uncheckAll: function () {
            return $element.datagrid('uncheckAll');
        },
        beginEdit: function (index) {
            return $element.datagrid('beginEdit', index);
        },
        endEdit: function (index) {
            return $element.datagrid('endEdit', index);
        },
        cancelEdit: function (index) {
            return $element.datagrid('cancelEdit', index);
        },
        getEditors: function (index) {
            return $element.datagrid('getEditors', index);
        },
        getEditor: function (options) {
            return $element.datagrid('getEditor', options);
        },
        refreshRow: function (index) {
            return $element.datagrid('refreshRow', index);
        },
        validateRow: function (index) {
            return $element.datagrid('validateRow', index);
        },
        updateRow: function (param) {
            return $element.datagrid('updateRow', param);
        },
        appendRow: function (row) {
            return $element.datagrid('appendRow', row);
        },
        insertRow: function (param) {
            return $element.datagrid('insertRow', param);
        },
        deleteRow: function (index) {
            return $element.datagrid('deleteRow', index);
        },
        getChanges: function (type) {
            return $element.datagrid('getChanges', type);
        },
        acceptChanges: function () {
            return $element.datagrid('acceptChanges');
        },
        rejectChanges: function () {
            return $element.datagrid('rejectChanges');
        },
        mergeCells: function (options) {
            return $element.datagrid('mergeCells', options);
        },
        showColumn: function (field) {
            return $element.datagrid('showColumn', field);
        },
        hideColumn: function (field) {
            return $element.datagrid('hideColumn', field);
        },
        sort: function (param) {
            return $element.datagrid('sort', param);
        },
        gotoPage: function (param) {
            return $element.datagrid('gotoPage', param);
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxgrid',
    create: jx.ui.Grid,
    defaults: {
        form: false,//查询表单对象
        nameField: null,
        method: 'get',
        fit: true,
        border: false,
        loadMsg: null,
        maskMsg: '正在加载数据,请稍等...',
        singleSelect: false,
        ctrlSelect: true,
        autoRowHeight: false,
        pagination: true,
        pageList: [10, 20, 30, 50, 80, 100]
    }
});
