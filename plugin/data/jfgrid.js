// /**
//  * jf表格组件
//  */
//
// (function ($) {
//
//     jx.ns('JX.UI');
//     //实现类
//     JX.UI.JFGrid = function ($ele, ops) {
//         var $element = $ele;
//         var options = ops || {};
//         var filterTimeoutId;
//
//         var init = function () {
//             initForm();
//
//             if (!$element.attr('id')) {
//                 $element.attr('id', jx.uuid());
//             }
//             // var _onRenderComplete = gridOptions.onRenderComplete;
//             // gridOptions.onRenderComplete = function (datas) {
//             //     if (_onRenderComplete) {
//             //         _onRenderComplete.call(this, datas);
//             //     }
//             // };
//
//             $element.jfGrid(options);
//
//             if (options.url && options.autuLoad === true) {
//                 reload();
//             }
//             initFilterBox();
//         };
//
//         /**
//          * 初始化表单
//          */
//         var initForm = function () {
//             if (!options.form) return;
//
//             options.form.jxform({
//                 highlightElement: function ($ele) {
//                     return $ele.closest('.form-group');
//                 }
//             });
//
//             options.form.on('beforesubmit', function () {
//                 var ps = jx.serialize(options.form);
//                 reload(ps);
//                 return false;
//             })
//
//             // options.form.find(':submit:first').on('click', function () {
//             //     var ps = jx.serialize(options.form);
//             //     reload(ps);
//             //     return false;
//             // });
//         };
//
//         var initFilterBox = function () {
//             if (!options.filterBox) return;
//             options.filterBox.on('input', function (e) {
//                 var val = $(this).val().trim();
//                 delayExec(val, 500, function () {
//                     reload({filter: val});
//                 });
//             });
//         };
//
//         /**
//          * 指定延迟时间进行本地过滤
//          * @param val
//          * @param delayTime
//          * @param callback
//          */
//         var delayExec = function (val, delayTime, callback) {
//             if (!delayTime) {
//                 delayTime = 500;
//             }
//             if (filterTimeoutId && filterTimeoutId > 0) {
//                 clearTimeout(filterTimeoutId);
//             }
//             filterTimeoutId = setTimeout(function () {
//                 if (jx.debug) {
//                     console.log('过滤grid数据，关键字：' + val);
//                 }
//                 if (callback) {
//                     callback();
//                 }
//             }, delayTime);
//         };
//
//         /**
//          * 刷新数据
//          * @param params 提交给后台参数
//          */
//         var reload = function (params) {
//             $element.jfGridSet("reload", {param: params})
//         };
//
//         /**
//          * 清除所有行
//          */
//         var empty = function () {
//             var setting = $element.jfGridGet("settingInfo");
//             setting.rowdatas = [];
//             $element.jfGridSet("refreshdata");
//         };
//
//         var removeSelectedRow = function () {
//             $element.jfGridSet("removeRow");
//         };
//
//         /**
//          * 选中行
//          * @param values 主键数组
//          * @param separator 分割符
//          */
//         var selectRows = function (values, separator) {
//             if (!values) return;
//             if (!separator) {
//                 separator = ',';
//             }
//             var id, rowid, $et;
//             var gridOptions = getOptions();
//             var ids = values.split(separator);
//             var rows = gridOptions.rowdatas;
//             for (var i = 0; i < rows.length; i++) {
//                 var row = rows[i];
//                 if (gridOptions.isMultiselect === true) {
//                     id = row[gridOptions.mainId];
//                     for (var j = 0; j < ids.length; j++) {
//                         var _id = ids[j];
//                         if (_id == id) {
//                             rowid = 'rownum_' + gridOptions.id + '_' + i;
//                             $et = $element.find('[rownum="' + rowid + '"]:first');
//                             $.jfGrid.selectRow($element, $et, gridOptions);
//                             break;
//                         }
//                     }
//                 }
//                 else {
//                     id = row[gridOptions.mainId];
//                     if (values == id) {
//                         rowid = 'rownum_' + gridOptions.id + '_' + i;
//                         $et = $element.find('[rownum="' + rowid + '"]:first');
//                         $.jfGrid.selectRow($element, $et, gridOptions);
//                         break;
//                     }
//                 }
//             }
//         };
//
//         /**
//          * 获取总行数
//          */
//         var getRowCount = function () {
//             return getRows().length;
//         };
//
//         /**
//          * 获取选中的主键数组
//          */
//         var getSelectedIds = function () {
//             var setting = $element.jfGridGet("settingInfo");
//             var idName = setting['mainId'];
//             var ids = [];
//             var selectedRow = $element.jfGridGet("rowdata");
//             if (jx.isArray(selectedRow)) {
//                 for (var i = 0; i < selectedRow.length; i++) {
//                     ids.push(selectedRow[i][idName]);
//                 }
//                 return ids;
//             }
//             if (jx.isObj(selectedRow)) {
//                 ids.push(selectedRow[idName]);
//                 return ids;
//             }
//             return ids;
//         };
//
//         /**
//          * 获取表格配置
//          */
//         var getOptions = function () {
//             return $element.jfGridGet("settingInfo");
//         };
//
//         /**
//          * 获取选中的行数组
//          */
//         var getSelectedRows = function () {
//             var rows = [];
//             var selectedRow = $element.jfGridGet("rowdata");
//             if (jx.isArray(selectedRow)) {
//                 return selectedRow;
//             }
//             if (jx.isObj(selectedRow)) {
//                 rows.push(selectedRow);
//                 return rows;
//             }
//             return rows;
//         };
//
//         /**
//          * 获取选中的行对象(只取第一个选中行)
//          */
//         var getSelectedRow = function () {
//             var selectedRow = $element.jfGridGet("rowdata");
//             if (jx.isArray(selectedRow)) {
//                 return selectedRow[0];
//             }
//             if (jx.isObj(selectedRow)) {
//                 return selectedRow;
//             }
//             return selectedRow;
//         };
//
//         /**
//          * 获取指定主键的行对象
//          */
//         var getRowById = function (id) {
//             var setting = $element.jfGridGet("settingInfo");
//             var idName = setting['mainId'];
//             var rows = $element.jfGridGet('rowdatas');
//             for (var i = 0; i < rows.length; i++) {
//                 var row = rows[i];
//                 if (row[idName] == id) {
//                     return row;
//                 }
//             }
//             return null;
//         };
//
//         /**
//          * 获取所有数据行
//          */
//         var getRows = function () {
//             return $element.jfGridGet('rowdatas');
//         };
//
//         /**
//          * 获取选中或者复选行的值
//          * @param separator 分隔符
//          */
//         var getSelectedOrCheckedData = function (separator) {
//             var kv = {text: null, value: null};
//             var gridOptions = getOptions();
//             if (options.isMultiselect === true) {
//                 var rows = getSelectedRows();
//                 kv = {text: [], value: []};
//                 for (var i = 0; i < rows.length; i++) {
//                     var n = rows[i];
//                     kv.text.push(n[gridOptions.mainText]);
//                     kv.value.push(n[gridOptions.mainId]);
//                 }
//                 kv = {text: kv.text.join(separator), value: kv.value.join(separator)};
//             }
//             else {
//                 var row = getSelectedRow();
//                 if (row) {
//                     kv = {text: row[gridOptions.mainText], value: row[gridOptions.mainId]};
//                 }
//             }
//             return kv;
//         };
//
//         /**
//          * 滚动到选中节点或者复选节点
//          */
//         var scrollToSelectedOrCheckedNode = function () {
//             var gridOptions = getOptions();
//             var $r = $element.find('.jfgrid_selected_' + gridOptions.id).eq(2);
//             if ($r.length > 0) {
//                 // $element.mCustomScrollbar("scrollTo", $r, {
//                 //     scrollInertia: 0,
//                 //     timeout: 0
//                 // });
//                 $('#jfgrid_scrollarea_' + gridOptions.id).mCustomScrollbar("scrollTo", $r, {
//                     scrollInertia: 0,
//                     timeout: 0
//                 })
//             }
//         };
//
//         /**
//          * 清除节点选中节点或者复选框
//          */
//         var clearSelectedOrChecked = function () {
//             var gridOptions = getOptions();
//             var cls = '.jfgrid_selected_' + gridOptions.id;
//             $element.find(cls).removeClass('jfgrid-head-cell-selected ' + cls);
//         };
//
//         //初始化插件
//         init();
//
//         return {
//             /**
//              * 刷新数据
//              * @param params 提交给后台参数
//              */
//             reload: function (params) {
//                 reload(params);
//             },
//
//             /**
//              * 清除所有行
//              */
//             empty: function () {
//                 empty();
//             },
//
//             /**
//              * 移除选中行
//              */
//             removeSelectedRow: function () {
//                 removeSelectedRow();
//             },
//
//             /**
//              * 选中行
//              * @param values 主键数组
//              * @param separator 分割符
//              */
//             selectRows: function (values, separator) {
//                 selectRows(values, separator);
//             },
//
//             /**
//              * 获取总行数
//              */
//             getRowCount: function () {
//                 return getRowCount();
//             },
//
//             /**
//              * 获取选中的主键数组
//              */
//             getSelectedIds: function () {
//                 return getSelectedIds();
//             },
//
//             /**
//              * 获取选中的行数组
//              */
//             getSelectedRows: function () {
//                 return getSelectedRows();
//             },
//
//             /**
//              * 获取选中的行对象(只取第一个选中行)
//              */
//             getSelectedRow: function () {
//                 return getSelectedRow();
//             },
//
//             /**
//              * 获取指定主键的行对象
//              */
//             getRowById: function (id) {
//                 return getRowById(id);
//             },
//
//             /**
//              * 获取所有数据行
//              */
//             getRows: function () {
//                 return getRows();
//             },
//
//             /**
//              * 获取表格配置
//              */
//             getOptions: function () {
//                 return getOptions();
//             },
//
//             /**
//              * 获取选中或者复选行的值
//              * @param separator 分隔符
//              */
//             getSelectedOrCheckedData: function (separator) {
//                 return getSelectedOrCheckedData(separator);
//             },
//
//             /**
//              * 滚动到选中节点或者复选节点
//              */
//             scrollToSelectedOrCheckedNode: function () {
//                 scrollToSelectedOrCheckedNode();
//             },
//
//             /**
//              * 清除节点选中节点或者复选框
//              */
//             clearSelectedOrChecked: function () {
//                 clearSelectedOrChecked();
//             }
//         }
//     };
//
//     //插件定义
//     jx.plugin({
//         name: 'jfgrid',
//         instance: function ($ele, ops) {
//             return JX.UI.JFGrid($ele, ops);
//         },
//         options: function ($ele) {
//             return jx.parseOptions($ele, [
//                 'url', 'multiselectfield', 'sidx', 'sord', 'mainId', 'mainText', 'parentId',
//                 {
//                     form: 'jquery',
//                     autuLoad: 'boolean', isShowNum: 'boolean', isMultiselect: 'boolean',
//                     isSubGrid: 'boolean', isPage: 'boolean', isTree: 'boolean', isLastBorder: 'boolean',
//                     reloadSelected: 'boolean', isAutoHeight: 'boolean', footerrow: 'boolean',
//                     isEidt: 'boolean', isStatistics: 'boolean', rows: 'number',
//                     param: 'object', headData: 'array', minheight: 'number', height: 'number'
//                 }
//             ]);
//         },
//         defaults: {
//             /**
//              * 自动加载数据(指定url的情况下才自动加载)
//              */
//             autuLoad: true,
//
//             /**
//              * 过滤文本框
//              */
//             filterBox: null,
//
//             /**
//              * 查询表单对象
//              */
//             form: false
//         },
//         onBeforeInit:function (e) {//注册依赖
//             if (document.querySelector('.jfgrid')) {
//                 jx.depend('jfgrid');
//             }
//         },
//         onInit:function (e) {//实例化
//             $(e.target).find('div.jfgrid').jfgrid();
//         }
//     });
//
//
//     // region GridFormat
//
//     if (!jx.gf) {
//         jx.gf = {};
//     }
//
//     /**
//      * bool转换
//      * @return {string}
//      */
//     jx.gf.bool = function (v) {
//         if (jx.toBoolean(v)) {
//             return '<i class="fa fa-toggle-on"></i>';
//         }
//         return '<i class="fa fa-toggle-off"></i>';
//     };
//
//     /**
//      * 日期转换
//      * @return {string}
//      */
//     jx.gf.date = function (v) {
//         if (v) {
//             return jx.formatDate(new Date(v));
//         }
//         return v;
//     };
//     /**
//      * 日期转换
//      * @return {string}
//      */
//     jx.gf.datetime = function (v) {
//         if (v) {
//             return jx.formatDateTime(new Date(v));
//         }
//         return v;
//     };
//
//     jx.gf.decimal = function (v) {
//         if (v) {
//             return jx.toDecimal(v);
//         }
//         return v;
//     };
//
//     // endregion
//
// }(jQuery));
