# 配置选项

框架中所有组件的初始化方式都是一致的,对于UI组件都需要初始化才能使用.框架中的组件默认都支持`自动初始化`和`手动初始化`.对于`自动初始化`需要指定组件的配置选项.对于配置选项支持一下三种方式.

## 组件配置选项

1. `data-options`

    在html元素的`data-options`属性中指定配置选项.属性值为一个对象字符串,框架自动转换为`JavaScript`对象.
    
    ```html
    <a class="btn btn-default jxdialog" data-options="{title:'业务新增',url:'page/grid.html', width:'100%',height:'100%'}">
        新增
     </a>
    ```

1. `$(.jxui).jxoptions({})`

    `data-options`中只适合编写简单的配置选项，如果配置选项中需要编写大量的选项以及一些回调函数，那么用这种办法会很乱，不建议使用这种方式。推荐使用`$('#user_grid').jxoptions(options)`函数来指定，在`jx.ready(callback)`函数中编写。
    可以把`data-options`和`$('#user_grid').data('jxoptions')`结合起来，`data-options`写简单参数，`$('#user_grid').data('jxoptions')`编写复杂参数，解析函数会自动合并。
    
    ```js
    jx.ready(function () {
        //组件初始化之前设置组件配置选项
        $('#user_grid').jxoptions({
            multiple: true,
            editable:false,
            gridOptions: {
                url: '../mock/grid.json',
                mainId: "F_CustomerId",
                mainText: "F_FullName"
            }
        });
    });
    ```

1. `data-*`

    根据插件中的定义,可以读取`data-*`中定义的配置属性值,具体情况请查看[配置选项解析机制](jx-plugin.md?#配置选项解析机制)

## 组件初始化

1. 自动初始化
    
    只需要给html元素的`class`属性添加`插件名称`,即可自动初始化组件.
    
    ```html
    <a class="jxdialog">
        新增
     </a>
    ```
    
1. 手动初始化
    
    需要在js脚本中初始化组件,建议在`jx.ready(callback)`函数中初始化,一旦手动进行初始化,自动初始化将不再处理.
    
    ```html
    jx.ready({
       $('#mdate').插件名称({
          //配置属性
       });
    });
    ```

## 组件事件

组件事件采用`on('event_name')`的方式来实现.

```js
//表单事件
$('form').on('beforesubmit', function () {
    
}).on('aftersubmit', function (e, result) {
    
});
```

## 系统内置组件

| 名称 | 组件名称 |
| :----------------------------------------------------------------------: | :----------------------------: |
| 数据表格                                                                   | [`jxgrid`](jx-grid.md)  |
| 表单                                                                      | [`jxform`](jx-form.md)   |
| [对话框](https://github.com/sentsin/layer/)                                | [`jxdialog`](jx-dialog.md) |
| 树控件                                                                     | [`jxtree`](jx-tree.md)   |
| [日期控件](https://github.com/uxsolutions/bootstrap-datepicker)            | [`jxdate`](jx-date.md)    |
| [时间控件](https://github.com/weareoutman/clockpicker)                     | [`jxtime`](jx-time.md)    |
| [日期时间控件](https://github.com/smalot/bootstrap-datetimepicker)          | [`jxdatetime`](jx-datetime.md) |
| [颜色控件](https://github.com/claviska/jquery-minicolors)                  | [`jxcolor`](jx-color.md)     |
| [输入掩码控件](https://github.com/RobinHerbots/Inputmask)                   | [`jxinputmask`]() |
| [富文本编辑器](https://github.com/kindsoft/kindeditor)                      | [`jxkindeditor`](jx-kindeditor.md)|
| [Markdown编辑器](https://github.com/pandao/editor.md)                      | [`jxeditormd`](jx-editormd.md) |
| 页面跳转                                                                    | [`jxlink`](jx-link.md)      |
| [下拉控件select2](https://github.com/select2/select2)                       | [`jxselect2`]()   |
| [下拉控件chosen](https://github.com/harvesthq/chosen)                       | [`jxchosen`]()    |
| lookup                                                                    | [`jxlookup`]()    |
| lookup.tree                                                               | [`jxlookuptree`]() |
| lookup.grid                                                               | [`jxlookupgrid`]() |
| combo                                                                     | [`jxcombo`]()      |
| combo.tree                                                                | [`jxcombotree`]()  |
| combo.grid                                                                | [`jxcombogrid`]()  |
