# Pagination（分页）

该分页控件允许用户导航页面的数据。它支持页面导航和页面长度选择的选项设置。用户可以在分页控件上添加自定义按钮，以增强其功能。

## 属性

| **属性名**        | **属性值类型** | **描述**                                   | **默认值**                                  |
| -------------- | --------- | ---------------------------------------- | ---------------------------------------- |
| total          | number    | 总记录数，在分页控件创建时初始的值。                       | 1                                        |
| pageSize       | number    | 页面大小。                                    | 10                                       |
| pageNumber     | number    | 在分页控件创建的时候显示的页数。                         | 1                                        |
| pageList       | array     | 用户可以改变页面大小。pageList属性定义了页面导航展示的页码。 代码示例：`$('#pp').pagination({	pageList: [10,20,50,100]});` | [10,20,30,50]                            |
| loading        | boolean   | 定义数据是否正在载入。                              | false                                    |
| buttons        | array     | 自定义按钮，可用值有：①. 每个按钮都有2个属性：iconCls：显示背景图片的CSS类IDhandler：当按钮被点击时调用的一个句柄函数。 ②. 页面已存在元素的选择器对象（例如：buttons:'#btnDiv'）**（该属性值自1.3.4版开始可用）**自定义按钮可以通过标签创建：`<div class="easyui-pagination" style="border:1px solid #ccc" data-options="		total: 114,		buttons: [{			iconCls:'icon-add',			handler:function(){alert('add')}		},'-',{			iconCls:'icon-save',			handler:function(){alert('save')}		}]"></div>`自定义按钮也可以通过Javascript创建：`$('#pp').pagination({	total: 114,	buttons: [{		iconCls:'icon-add',		handler:function(){alert('add')}	},'-',{		iconCls:'icon-save',		handler:function(){alert('save')}	}]});` | null                                     |
| layout         | array     | 分页控件布局定义。**（该属性值自1.3.5版开始可用）**布局选项可以包含一个或多个值：1) list：页面显示条数列表。2) sep：页面按钮分割线。3) first：首页按钮。4) prev：上一页按钮。5) next：下一页按钮。6) last：尾页按钮。7) refresh：刷新按钮。8) manual：手工输入当前页的输入框。9) links：页面数链接。示例代码：`$('#pp').pagination({	layout:['first','links','last']});` |                                          |
| links          | number    | 该链接数仅在“links”项包含在“layout”中的时候有效。**（该属性值自1.3.5版开始可用）** | 10                                       |
| showPageList   | boolean   | 定义是否显示页面导航列表。                            | true                                     |
| showRefresh    | boolean   | 定义是否显示刷新按钮。                              | true                                     |
| showPageInfo   | boolean   | 定义是否显示页面信息。**（该属性值自1.5.2版开始可用）**         | true                                     |
| beforePageText | string    | 在输入组件之前显示一个label标签。                      | Page                                     |
| afterPageText  | string    | 在输入组件之后显示一个label标签。                      | of {pages}                               |
| displayMsg     | string    | 显示页面信息。                                  | Displaying {from} to {to} of {total} items |


## 事件

| **事件名**          | **事件参数**             | **描述**                                   |
| ---------------- | -------------------- | ---------------------------------------- |
| onSelectPage     | pageNumber, pageSize | 用户选择一个新页面的时候触发。回调函数包含2个参数：pageNumber：新的页数。pageSize: 页面大小（每页显示的条数）。 代码示例：`$('#pp').pagination({	onSelectPage:function(pageNumber, pageSize){		$(this).pagination('loading');		alert('pageNumber:'+pageNumber+',pageSize:'+pageSize);		$(this).pagination('loaded');	}});` |
| onBeforeRefresh  | pageNumber, pageSize | 在点击刷新按钮刷新之前触发，返回false可以取消刷新动作。           |
| onRefresh        | pageNumber, pageSize | 刷新之后触发。                                  |
| onChangePageSize | pageSize             | 在页面更改页面大小的时候触发。                          |

## 方法

| **方法名** | **方法参数** | **描述**                                   |
| ------- | -------- | ---------------------------------------- |
| options | none     | 返回参数对象。                                  |
| loading | none     | 提醒分页控件正在加载中。                             |
| loaded  | none     | 提醒分页控件加载完成。                              |
| refresh | options  | 刷新并显示分页栏信息。**（该方法自1.3版开始可用）**代码示例：`$('#pp').pagination('refresh');	// 刷新分页栏信息$('#pp').pagination('refresh',{	// 改变选项并刷新分页栏信息	total: 114,	pageNumber: 6});` |
| select  | page     | 选择一个新页面，页面索引从1开始。**（该方法自1.3版开始可用）**代码示例：`$('#pp').pagination('select');            // 刷新当前页$('#pp').pagination('select', 2);        // 选择第二页` |