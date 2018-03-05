# grid（表格）

扩展自$.fn.jxpanel.defaults。使用$.fn.jxgrid.defaults重写默认值对象。

DataGrid以表格形式展示数据，并提供了丰富的选择、排序、分组和编辑数据的功能支持。DataGrid的设计用于缩短开发时间，并且使开发人员不需要具备特定的知识。它是轻量级的且功能丰富。单元格合并、多列标题、冻结列和页脚只是其中的一小部分功能。

!> [示例](demo/data/grid.html)

## 使用方法

从现有的表格元素创建DataGrid，在HTML中定义列、行和数据。

```html
<table class="jxgrid">  
    <thead>  
        <tr>  
            <th data-options="field:'code'">编码</th>  
            <th data-options="field:'name'">名称</th>  
            <th data-options="field:'price'">价格</th>  
        </tr>  
    </thead>  
    <tbody>  
        <tr>  
            <td>001</td><td>名称1</td><td>2323</td>  
        </tr>  
        <tr>  
            <td>002</td><td>名称2</td><td>4612</td>  
        </tr>  
    </tbody>  
</table>  
```

通过`<table>`标签创建DataGrid控件。在表格内使用`<th>`标签定义列。

```html
<table class="jxgrid" style="width:400px;height:250px"  
        data-options="url:'datagrid_data.json',fitColumns:true,singleSelect:true">  
    <thead>  
        <tr>  
            <th data-options="field:'code',width:100">编码</th>  
            <th data-options="field:'name',width:100">名称</th>  
            <th data-options="field:'price',width:100,align:'right'">价格</th>  
        </tr>  
    </thead>  
</table>  
```

此外，也允许使用Javascript去创建DataGrid控件。

```html
<table id="dg"></table>  
```

```js
$('#dg').jxgrid({   
    url:'datagrid_data.json',   
    columns:[[   
        {field:'code',title:'代码',width:100},   
        {field:'name',title:'名称',width:100},   
        {field:'price',title:'价格',width:100,align:'right'}   
    ]]   
});  
```

使用一些参数查询数据。

```js
$('#dg').jxgrid('load', {   
    name: 'easyui',   
    address: 'ho'  
});  
```

改变的数据保存到服务器之后，刷新当前数据。

```js
$('#dg').jxgrid('reload');    // 重新载入当前页面数据  
```

- 不分页

返回结构:
```
{
    total : 20,           //
    rows : []            //数据集合
}
```  

- 分页

请求参数:
```
{
    page: 1,              // 当前页
    rows: 10,             // 每页行数
    sort: '',             // 排序列名称
    order: '',            // 排序类型 asc/desc
}
```

返回结构:
```
{
    rows : [],           //数据集合
    total : 5            //总记录数
}
```  


## 选项

该属性扩展自[Panel](basic/panel.md)(面板)，[Pagination](data/pagination.md)(面板),下面是DataGrid控件添加的属性。

| **属性名**        | **属性值类型**      | **描述**                                   | **默认值**                   |
| -------------- | -------------- | ---------------------------------------- | ------------------------- |
| columns        | array          | DataGrid列配置对象，详见列属性说明中更多的细节。             | undefined                 |
| frozenColumns  | array          | 同列属性，但是这些列将会被冻结在左侧。                      | undefined                 |
| fitColumns     | boolean        | 真正的自动展开/收缩列的大小，以适应网格的宽度，防止水平滚动。          | false                     |
| resizeHandle   | string         | 调整列的位置，可用的值有：'left','right','both'。在使用'right'的时候用户可以通过拖动右侧边缘的列标题调整列，等等。**（该属性自1.3.2版开始可用）** | right                     |
| autoRowHeight  | boolean        | 定义设置行的高度，根据该行的内容。设置为false可以提高负载性能。       | true                      |
| toolbar        | array,selector | 顶部工具栏的DataGrid面板。可能的值：1) 一个数组，每个工具属性都和linkbutton一样。2) 选择器指定的工具栏。 在<div>标签上定义工具栏： `$('#dg').datagrid({	toolbar: '#tb'});<div id="tb"><a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-edit',plain:true"/a><a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-help',plain:true"/a></div>`通过数组定义工具栏：`$('#dg').datagrid({	toolbar: [{		iconCls: 'icon-edit',		handler: function(){alert('编辑按钮')}	},'-',{		iconCls: 'icon-help',		handler: function(){alert('帮助按钮')}	}]});` | null                      |
| striped        | boolean        | 是否显示斑马线效果。                               | false                     |
| method         | string         | 该方法类型请求远程数据。                             | post                      |
| nowrap         | boolean        | 如果为true，则在同一行中显示数据。设置为true可以提高加载性能。      | true                      |
| idField        | string         | 指明哪一个字段是标识字段。                            | null                      |
| url            | string         | 一个URL从远程站点请求数据。                          | null                      |
| data           | array,object   | 数据加载**（该属性自1.3.2版开始可用）**代码示例：`$('#dg').datagrid({	data: [		{f1:'value11', f2:'value12'},		{f1:'value21', f2:'value22'}	]});` | null                      |
| loadMsg        | string         | 在从远程站点加载数据的时候显示提示消息。                     | Processing, please wait … |
| pagination     | boolean        | 如果为true，则在DataGrid控件底部显示分页工具栏。           | false                     |
| rownumbers     | boolean        | 如果为true，则显示一个行号列。                        | false                     |
| singleSelect   | boolean        | 如果为true，则只允许选择一行。                        | false                     |
| ctrlSelect     | boolean        | 在启用多行选择的时候允许使用Ctrl键+鼠标点击的方式进行多选操作。**（该属性自1.3.6版开始可用）** | false                     |
| checkOnSelect  | boolean        | 如果为true，当用户点击行的时候该复选框就会被选中或取消选中。如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。**（该属性自1.3版开始可用）** | true                      |
| selectOnCheck  | boolean        | 如果为true，单击复选框将永远选择行。如果为false，选择行将不选中复选框。**（该属性自1.3版开始可用）** | true                      |
| scrollOnSelect | boolean        | 如果为true，在选择行的时候将自动定位到行所在的位置。**（该属性自1.5.2版开始可用）** | true                      |
| pagePosition   | string         | 定义分页工具栏的位置。可用的值有：'top','bottom','both'。**（该属性自1.3版开始可用）** | bottom                    |
| pageNumber     | number         | 在设置分页属性的时候初始化页码。                         | 1                         |
| pageSize       | number         | 在设置分页属性的时候初始化页面大小。                       | 10                        |
| pageList       | array          | 在设置分页属性的时候 初始化页面大小选择列表。                  | [10,20,30,40,50]          |
| queryParams    | object         | 在请求远程数据的时候发送额外的参数。 代码示例：`$('#dg').datagrid({	queryParams: {		name: 'easyui',		subject: 'datagrid'	}});` | {}                        |
| sortName       | string         | 定义哪些列可以进行排序。                             | null                      |
| sortOrder      | string         | 定义列的排序顺序，只能是'asc'或'desc'。                | asc                       |
| multiSort      | boolean        | 定义是否允许多列排序。**（该属性自1.3.4版开始可用）**          | false                     |
| remoteSort     | boolean        | 定义从服务器对数据进行排序。                           | true                      |
| showHeader     | boolean        | 定义是否显示行头。                                | true                      |
| showFooter     | boolean        | 定义是否显示行脚。                                | false                     |
| scrollbarSize  | number         | 滚动条的宽度(当滚动条是垂直的时候)或高度(当滚动条是水平的时候)。       | 18                        |
| rownumberWidth | number         | 行号列宽度。**（该属性自1.5版开始可用）**                 | 30                        |
| editorHeight   | number         | 编辑器默认高度。**译者注（该属性官方未标注出可用版本号，译者是在1.5版本中发现新增的属性，姑且认为是1.5新增属性。1.5之前的版本可自行尝试，如果无效请删除。）** | 24                        |
| rowStyler      | function       | 返回样式如'background:red'。带2个参数的函数：index：该行索引从0开始row：与此相对应的记录行。 代码示例：`$('#dg').datagrid({	rowStyler: function(index,row){		if (row.listprice>80){			return 'background-color:#6293BB;color:#fff;';		}	}});``**译者注（1.3.4新增方式）：**$('#dg').datagrid({	rowStyler: function(index,row){		if (row.listprice>80){			return 'rowStyle';    // rowStyle是一个已经定义了的ClassName(类名)		}	}});` |                           |
| loader         | function       | 定义如何从远程服务器加载数据。返回false可以放弃本次请求动作。该函数接受以下参数：param：参数对象传递给远程服务器。success(data)：当检索数据成功的时候会调用该回调函数。error()：当检索数据失败的时候会调用该回调函数。 | json loader               |
| loadFilter     | function       | 返回过滤数据显示。该函数带一个参数'data'用来指向源数据（即：获取的数据源，比如Json对象）。您可以改变源数据的标准数据格式。这个函数必须返回包含'total'和'rows'属性的标准数据对象。 代码示例：`// 从Web Service（asp.net、java、php等）输出的JSON对象中移除'd'对象$('#dg').datagrid({	loadFilter: function(data){		if (data.d){			return data.d;		} else {			return data;		}	}});` |                           |
| editors        | object         | 定义在编辑行的时候使用的编辑器。                         | 预定义编辑器                    |
| view           | object         | 定义DataGrid的视图。                           | 默认视图                      |


## 列选项

DataGrid列是一个数组对象，该元素也是一个数组对象。元素数组里面的元素是一个配置对象，它用来定义每一个列字段。 

代码示例：

```js
columns:[[   
    {field:'itemid',title:'Item ID',rowspan:2,width:80,sortable:true},   
    {field:'productid',title:'ProductID',rowspan:2,width:80,sortable:true},   
    {title:'Item Details',colspan:4}   
],[   
    {field:'listprice',title:'List Price',width:80,align:'right',sortable:true},   
    {field:'unitcost',title:'Unit Cost',width:80,align:'right',sortable:true},   
    {field:'attr1',title:'Attribute',width:100},   
    {field:'status',title:'Status',width:60}   
]]  
```

| **属性名称**  | **属性值类型**     | **描述**                                   | **默认值**   |
| --------- | ------------- | ---------------------------------------- | --------- |
| title     | string        | 列标题文本。                                   | undefined |
| field     | string        | 列字段名称。                                   | undefined |
| width     | number        | 列的宽度。如果没有定义，宽度将自动扩充以适应其内容。               | undefined |
| rowspan   | number        | 指明将占用多少行单元格（合并行）。                        | undefined |
| colspan   | number        | 指明将占用多少列单元格（合并列）。                        | undefined |
| align     | string        | 指明如何对齐列数据。可以使用的值有：'left','right','center'。 | undefined |
| halign    | string        | 指明如何对齐列标题。可以使用的值有：'left','right','center'。如果没有指定，则按照align属性进行对齐。**（该属性自1.3.2版开始可用）** | undefined |
| sortable  | boolean       | 如果为true，则允许列使用排序。                        | undefined |
| order     | string        | 默认排序数序，只能是'asc'或'desc'。**（该属性自1.3.2版开始可用）** | undefined |
| resizable | boolean       | 如果为true，允许列改变大小。                         | undefined |
| fixed     | boolean       | 如果为true，在"fitColumns"设置为true的时候阻止其自适应宽度。 | undefined |
| hidden    | boolean       | 如果为true，则隐藏列。                            | undefined |
| checkbox  | boolean       | 如果为true，则显示复选框。该复选框列固定宽度。                | undefined |
| formatter | function      | 单元格formatter(格式化器)函数，带3个参数：value：字段值。row：行记录数据。index: 行索引。 代码示例：`$('#dg').datagrid({	columns:[[		{field:'userId',title:'User', width:80,			formatter: function(value,row,index){				if (row.user){					return row.user.name;				} else {					return value;				}			}		}	]]});` | undefined |
| styler    | function      | 单元格styler(样式)函数，返回如'background:red'这样的自定义单元格样式字符串。该函数带3个参数：value：字段值。row：行记录数据。index: 行索引。 代码示例：`$('#dg').datagrid({	columns:[[		{field:'listprice',title:'List Price', width:80, align:'right',			styler: function(value,row,index){				if (value < 20){					return 'background-color:#ffee00;color:red;';				}			}		}	]]});` | undefined |
| sorter    | function      | 用来做本地排序的自定义字段排序函数，带2个参数：a：第一个字段值。b：第二个字段值。 代码示例：`$('#dg').datagrid({	remoteSort: false,	columns: [[		{field:'date',title:'Date',width:80,sortable:true,align:'center',  			sorter:function(a,b){  				a = a.split('/');  				b = b.split('/');  				if (a[2] == b[2]){  					if (a[0] == b[0]){  						return (a[1]>b[1]?1:-1);  					} else {  						return (a[0]>b[0]?1:-1);  					}  				} else {  					return (a[2]>b[2]?1:-1);  				}  			}  		}	]]});` | undefined |
| editor    | string,object | 指明编辑类型。当字符串指明编辑类型的时候，对象包含2个属性：type：字符串，该编辑类型可以使用的类型有：text,textarea,checkbox,numberbox,validatebox,datebox,combobox,combotree。options：对象，object, 该编辑器属性对应于编辑类型。 | undefined |


## DataGrid View

使用$.fn.jxgrid.defaults.view重写默认值对象。

该视图是一个对象，将告诉DataGrid如何渲染行。该对象必须定义下列函数：

| **名称**         | **参数**                             | **描述**                                   |
| -------------- | ---------------------------------- | ---------------------------------------- |
| render         | target, container, frozen          | 数据加载时调用。target：DOM对象，DataGrid对象。container：行容器。frozen：指明如何渲染冻结容器。 |
| renderFooter   | target, container, frozen          | 这是一个选择函数来渲染行页脚。                          |
| renderRow      | target, fields, frozen, index, row | 这是一个属性功能，将调用render函数。                    |
| refreshRow     | target, index                      | 定义如何刷新指定的行。                              |
| onBeforeRender | target, rows                       | 在视图被呈现之前触发。                              |
| onAfterRender  | target                             | 在视图呗呈现之后触发。                              |

## 事件

事件继承自[panel](easy-panel.md#事件)(面板)，以下是DataGrid新增的事件。

| **事件名**             | **参数**              | **描述**                                   |
| ------------------- | ------------------- | ---------------------------------------- |
| onLoadSuccess       | data                | 在数据加载成功的时候触发。                            |
| onLoadError         | none                | 在载入远程数据产生错误的时候触发。                        |
| onBeforeLoad        | param               | 在载入请求数据数据之前触发，如果返回false可终止载入数据操作。        |
| onClickRow          | index, row          | 在用户点击一行的时候触发，参数包括：index：点击的行的索引值，该索引值从0开始。row：对应于点击行的记录。 |
| onDblClickRow       | index, row          | 在用户双击一行的时候触发，参数包括：index：点击的行的索引值，该索引值从0开始。row：对应于点击行的记录。 |
| onClickCell         | index, field, value | 在用户点击一个单元格的时候触发。                         |
| onDblClickCell      | index, field, value | 在用户双击一个单元格的时候触发。 代码示例：`// 在双击一个单元格的时候开始编辑并生成编辑器，然后定位到编辑器的输入框上$('#dg').datagrid({	onDblClickCell: function(index,field,value){		$(this).datagrid('beginEdit', index);		var ed = $(this).datagrid('getEditor', {index:index,field:field});		$(ed.target).focus();	}});` |
| onBeforeSortColumn  | sort, order         | 在用户排序一个列之前触发，返回false可以取消排序。**（该事件自1.3.6版开始可用）** |
| onSortColumn        | sort, order         | 在用户排序一列的时候触发，参数包括：sort：排序列字段名称。order：排序列的顺序(ASC或DESC) |
| onResizeColumn      | field, width        | 在用户调整列大小的时候触发。                           |
| onBeforeSelect      | index, row          | 在用户选择一行之前触发，返回false则取消该动作。**（该事件自1.4.1版开始可用）** |
| onSelect            | index, row          | 在用户选择一行的时候触发，参数包括：index：选择的行的索引值，索引从0开始。row：对应于取消选择行的记录。 |
| onBeforeUnselect    | index, row          | 在用户取消选择一行之前触发，返回false则取消该动作。**（该事件自1.4.1版开始可用）** |
| onUnselect          | index, row          | 在用户取消选择一行的时候触发，参数包括：index：选择的行的索引值，索引从0开始。row：对应于取消选择行的记录。 |
| onSelectAll         | rows                | 在用户选择所有行的时候触发。                           |
| onUnselectAll       | rows                | 在用户取消选择所有行的时候触发。                         |
| onBeforeCheck       | index, row          | 在用户校验一行之前触发，返回false则取消该动作。**（该事件自1.4.1版开始可用）** |
| onCheck             | index, row          | 在用户勾选一行的时候触发，参数包括：index：选中的行索引，索引从0开始。row：对应于所选行的记录。**（该事件自1.3版开始可用）** |
| onBeforeUncheck     | index, row          | 在用户取消校验一行之前触发，返回false则取消该动作。**（该事件自1.4.1版开始可用）** |
| onUncheck           | index, row          | 在用户取消勾选一行的时候触发，参数包括：index：选中的行索引，索引从0开始。row：对应于取消勾选行的记录。**（该事件自1.3版开始可用）** |
| onCheckAll          | rows                | 在用户勾选所有行的时候触发。**（该事件自1.3版开始可用）**         |
| onUncheckAll        | rows                | 在用户取消勾选所有行的时候触发。**（该事件自1.3版开始可用）**       |
| onBeforeEdit        | index, row          | 在用户开始编辑一行的时候触发，参数包括：index：编辑行的索引，索引从0开始。row：对应于编辑行的记录。 |
| onBeginEdit         | index, row          | 在一行进入编辑模式的时候触发。**（该事件自1.3.6版开始可用）**      |
| onEndEdit           | index, row, changes | 在完成编辑但编辑器还没有销毁之前触发。**（该事件自1.3.6版开始可用）**  |
| onAfterEdit         | index, row, changes | 在用户完成编辑一行的时候触发，参数包括：index：编辑行的索引，索引从0开始。row：对应于完成编辑的行的记录。changes：更改后的字段(键)/值对。 |
| onCancelEdit        | index,row           | 在用户取消编辑一行的时候触发，参数包括：index：编辑行的索引，索引从0开始。row：对应于编辑行的记录。 |
| onHeaderContextMenu | e, field            | 在鼠标右击DataGrid表格头的时候触发。                   |
| onRowContextMenu    | e, index, row       | 在鼠标右击一行记录的时候触发。                          |

## 方法

| **方法名**         | **参数**  | **描述**                                   |
| --------------- | ------- | ---------------------------------------- |
| options         | none    | 返回属性对象。                                  |
| getPager        | none    | 返回页面对象。                                  |
| getPanel        | none    | 返回面板对象。                                  |
| getColumnFields | frozen  | 返回列字段。如果设置了frozen属性为true，将返回固定列的字段名。代码示例：`var opts = $('#dg').datagrid('getColumnFields');               // 获取解冻列var opts = $('#dg').datagrid('getColumnFields', true);       // 获取冻结列` |
| getColumnOption | field   | 返回指定列属性。                                 |
| resize          | param   | 做调整和布局。                                  |
| load            | param   | 加载和显示第一页的所有行。如果指定了'param'，它将取代'queryParams'属性。通常可以通过传递一些参数执行一次查询，通过调用这个方法从服务器加载新数据。`$('#dg').datagrid('load',{	code: '01',	name: 'name01'});` |
| reload          | param   | 重载行。等同于'load'方法，但是它将保持在当前页。              |
| reloadFooter    | footer  | 重载页脚行。代码示例： `// 更新页脚行的值并刷新var rows = $('#dg').datagrid('getFooterRows');rows[0]['name'] = 'new name';rows[0]['salary'] = 60000;$('#dg').datagrid('reloadFooter');// 更新页脚行并载入新数据$('#dg').datagrid('reloadFooter',[	{name: 'name1', salary: 60000},	{name: 'name2', salary: 65000}]);` |
| loading         | none    | 显示载入状态。                                  |
| loaded          | none    | 隐藏载入状态。                                  |
| fitColumns      | none    | 使列自动展开/收缩到合适的DataGrid宽度。                 |
| fixColumnSize   | field   | 固定列大小。如果'field'参数未配置，所有列大小将都是固定的。 代码示例：`$('#dg').datagrid('fixColumnSize', 'name');        // 固定'name'列大小$('#dg').datagrid('fixColumnSize');                    // 固定所有列大小` |
| fixRowHeight    | index   | 固定指定列高度。如果'index'参数未配置，所有行高度都是固定的。       |
| freezeRow       | index   | 冻结指定行，当DataGrid表格向下滚动的时候始终保持被冻结的行显示在顶部。**（该方法自1.3.2版开始可用）** |
| autoSizeColumn  | field   | 自动调整列宽度以适应内容。**（该方法自1.3版开始可用）**          |
| loadData        | data    | 加载本地数据，旧的行将被移除。                          |
| getData         | none    | 返回加载完毕后的数据。                              |
| getRows         | none    | 返回当前页的所有行。                               |
| getFooterRows   | none    | 返回页脚行。                                   |
| getRowIndex     | row     | 返回指定行的索引号，该行的参数可以是一行记录或一个ID字段值。          |
| getChecked      | none    | 在复选框呗选中的时候返回所有行。**（该方法自1.3版开始可用）**       |
| getSelected     | none    | 返回第一个被选中的行或如果没有选中的行则返回null。              |
| getSelections   | none    | 返回所有被选中的行，当没有记录被选中的时候将返回一个空数组。           |
| clearSelections | none    | 清除所有选择的行。                                |
| clearChecked    | none    | 清除所有勾选的行。**（该方法自1.3.2版开始可用）**            |
| scrollTo        | index   | 滚动到指定的行。**（该方法自1.3.3版开始可用）**             |
| gotoPage        | param   | 跳转到指定页。 **（该方法自1.4.4版开始可用）**  代码示例：`// 跳转到第3页$('#dg').datagrid('gotoPage', 3);// 跳转到第3页并执行回调函数$('#dg').datagrid('gotoPage', {	page: 3,	callback: function(page){		console.log(page)	}})` |
| highlightRow    | index   | 高亮一行。**（该方法自1.3.3版开始可用）**                |
| selectAll       | none    | 选择当前页中所有的行。                              |
| unselectAll     | none    | 取消选择所有当前页中所有的行。                          |
| selectRow       | index   | 选择一行，行索引从0开始。                            |
| selectRecord    | idValue | 通过ID值参数选择一行。                             |
| unselectRow     | index   | 取消选择一行。                                  |
| checkAll        | none    | 勾选当前页中的所有行。**（该方法自1.3版开始可用）**            |
| uncheckAll      | none    | 取消勾选当前页中的所有行。**（该方法自1.3版开始可用）**          |
| checkRow        | index   | 勾选一行，行索引从0开始。**（该方法自1.3版开始可用）**          |
| uncheckRow      | index   | 取消勾选一行，行索引从0开始。**（该方法自1.3版开始可用）**        |
| beginEdit       | index   | 开始编辑行。                                   |
| endEdit         | index   | 结束编辑行。                                   |
| cancelEdit      | index   | 取消编辑行。                                   |
| getEditors      | index   | 获取指定行的编辑器。每个编辑器都有以下属性：actions：编辑器可以执行的动作，同编辑器定义。target：目标编辑器的jQuery对象。field：字段名称。type：编辑器类型，比如：'text','combobox','datebox'等。 |
| getEditor       | options | 获取指定编辑器，options包含2个属性：index：行索引。field：字段名称。 代码示例：`// 获取日期输入框编辑器并更改它的值var ed = $('#dg').datagrid('getEditor', {index:1,field:'birthday'});$(ed.target).datebox('setValue', '5/4/2012');` |
| refreshRow      | index   | 刷新行。                                     |
| validateRow     | index   | 验证指定的行，当验证有效的时候返回true。                   |
| updateRow       | param   | 更新指定行，参数包含下列属性：index：执行更新操作的行索引。row：更新行的新数据。 代码示例：`$('#dg').datagrid('updateRow',{	index: 2,	row: {		name: '新名称',		note: '新消息'	}});` |
| appendRow       | row     | 追加一个新行。新行将被添加到最后的位置。 `$('#dg').datagrid('appendRow',{	name: '新名称',	age: 30,	note: '新消息'});` |
| insertRow       | param   | 插入一个新行，参数包括一下属性：index：要插入的行索引，如果该索引值未定义，则追加新行。row：行数据。代码示例：`// 在第二行的位置插入一个新行$('#dg').datagrid('insertRow',{	index: 1,	// 索引从0开始	row: {		name: '新名称',		age: 30,		note: '新消息'	}});` |
| deleteRow       | index   | 删除行。                                     |
| getChanges      | type    | 从上一次的提交获取改变的所有行。类型参数指明用哪些类型改变的行，可以使用的值有：inserted,deleted,updated等。当类型参数未配置的时候返回所有改变的行。 |
| acceptChanges   | none    | 提交所有从加载或者上一次调用acceptChanges函数后更改的数据。     |
| rejectChanges   | none    | 回滚所有从创建或者上一次调用acceptChanges函数后更改的数据。     |
| mergeCells      | options | 合并单元格，options包含以下属性：index：行索引。field：字段名称。rowspan：合并的行数。colspan：合并的列数。 |
| showColumn      | field   | 显示指定的列。                                  |
| hideColumn      | field   | 隐藏指定的列。                                  |
| sort            | param   | 排序datagrid表格。**（该方法自1.3.6版开始可用）**代码示例：`$('#dg').datagrid('sort', 'itemid');    // 排序一个列$('#dg').datagrid('sort', {	        // 指定了排序顺序的列	sortName: 'productid',	sortOrder: 'desc'});` |


              
