// /**
//  * window.grid 编辑器组件
//  */
//
// (function ($) {
//     jx.ns('JX.UI');
//
//     //实现类
//     JX.UI.LookupGrid = function ($ele, ops) {
//         var $element = $ele;
//         var options = ops || {};
//         var lookup;
//         var $container, $gridContainer, gridOptions, gridInstance, gridWindow;
//         var isAccept = false, layerIndex;
//         lookup = JX.UI.Lookup($ele, ops);
//         $container = lookup.getContainer();
//
//         var init = function () {
//             if (!options.dialogOptions.url) {
//                 options.dialogOptions.type = 1;
//                 options.dialogOptions.content = '<pre>请指定对话框url属性</pre>';
//                 return;
//             }
//
//             options.dialogOptions.success = function ($layer, index) {
//                 layerIndex = index;
//                 isAccept = false;
//                 if($layer.find('iframe').length==0){
//                     options.dialogOptions.type = 1;
//                     options.dialogOptions.content = '<pre>对话框url属性无效</pre>';
//                     return;
//                 }
//                 gridWindow = $layer.find('iframe')[0].contentWindow;
//                 $gridContainer = gridWindow.$('.jfgrid');
//                 gridInstance = $gridContainer.data('jfgrid');
//                 gridOptions = gridInstance.getOptions();
//                 options.multiple = gridOptions.isMultiselect;
//
//                 gridOptions.onRenderComplete = function (datas) {
//                     gridInstance.selectRows(lookup.getValue().value, options.separator);
//                 };
//
//                 if (options.dblClickAccept === true) {
//                     $gridContainer.on('dblclick', function () {
//                         if (acceptAction() === true) {
//                             top.layer.close(layerIndex);
//                         }
//                     });
//                 }
//                 gridInstance.reload();
//             };
//             options.dialogOptions.callback = function (dwin, $layer, index) {
//                 return acceptAction();
//             };
//             if (options.autoAccept === true) {
//                 options.dialogOptions.end = function () {
//                     if (isAccept === false) {
//                         acceptAction();
//                     }
//                 }
//             }
//         };
//
//         var acceptAction = function () {
//             var kv = gridInstance.getSelectedOrCheckedData(options.separator);
//             if (options.multiple === true) {
//                 var v = kv.value.split(options.separator);
//                 if (options.requireSelect === true && v.length == 0) {
//                     gridWindow.toastr.error(options.noSelectMsg, '');
//                     return false;
//                 }
//                 if (options.maxSelectCount > 0 && v.length > options.maxSelectCount) {
//                     gridWindow.toastr.error(jx.formatString(options.maxSelectCountMsg, [options.maxSelectCount]), '');
//                     return false;
//                 }
//             }
//             else {
//                 if (options.requireSelect === true && !!kv.value) {
//                     gridWindow.toastr.error(options.noSelectMsg, '');
//                     return false;
//                 }
//             }
//
//             if (jx.debug) {
//                 console.log('LookupGrid选中的值:%o', kv);
//             }
//             lookup.setValue(kv);
//             isAccept = true;
//
//             //region accept 事件
//             var e = $.Event('accept');
//             $element.triggerHandler(e, [kv]);
//             return e.result !== false;
//             //endregion
//         };
//
//         //初始化插件
//         init();
//
//         return {
//             getContainer: function () {
//                 return $container;
//             },
//             getOptions: function () {
//                 return options;
//             },
//             setValue: function (kv) {
//                 lookup.setValue(kv);
//             },
//             getValue: function () {
//                 return lookup.getValue();
//             },
//             clearValue: function () {
//                 lookup.clearValue();
//             }
//         };
//     };
//
//     //插件定义
//     jx.plugin({
//         name: 'jxlookupgrid',
//         instance: function ($ele, ops) {
//             return JX.UI.LookupGrid($ele, ops);
//         },
//         options: function ($ele) {
//             return jx.parseOptions($ele, [
//                 'textField'
//             ]);
//         },
//         defaults: $.extend(true,{}, $.fn.jxlookup.defaults, {
//             requireSelect: false,
//             noSelectMsg: '请至少选择一项',
//             maxSelectCount: 0,
//             maxSelectCountMsg: '最多选择{0}项',
//             dblClickAccept: true,
//             autoAccept: false,
//             multiple: false,
//             separator: ',',
//             dialogOptions: {
//                 width: '80%',
//                 height: '80%'
//             },
//             gridOptions: {}
//         }),
//         onInit:function (e) {//实例化
//             $(e.target).find('.jxlookupgrid').jxlookupgrid();
//         }
//     });
//
// }(jQuery));