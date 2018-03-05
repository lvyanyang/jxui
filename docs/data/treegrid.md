# TreeGrid（树形表格）

树形表格用于显示分层数据表格。它是基于数据表格、组合树控件和可编辑表格。树形表格允许用户创建可定制的、异步展开行和显示在多列上的分层数据。

!> [示例](demo/data/treegrid.html)

## 属性

树形表格扩展自[jxgrid](data/grid.md)(数据表格)，树形表格新增的属性如下：

| **属性名**       | **属性值类型**                     | **描述**                                   | **默认值**     |
| ------------- | ----------------------------- | ---------------------------------------- | ----------- |
| idField       | string                        | 定义关键字段来标识树节点。**（必须的）**                   | null        |
| treeField     | string                        | 定义树节点字段。**（必须的）**                        | null        |
| animate       | boolean                       | 定义在节点展开或折叠的时候是否显示动画效果。                   | false       |
| checkbox      | boolean,function              | 定义在每一个节点前显示复选框，也可以指定一个函数来动态指定是否显示复选框，但函数返回true的时候则显示，否则不显示。**（该属性自1.4.5版开始可用）**代码示例：`$('#tg').treegrid({	checkbox: function(row){		var names = ['Java','eclipse.exe','eclipse.ini'];		if ($.inArray(row.name, names)>=0){			return true;		}	}})` | false       |
| cascadeCheck  | boolean                       | 定义是否级联检查。**（该属性自1.4.5版开始可用）**            | true        |
| onlyLeafCheck | boolean                       | 定义是否仅在叶子节点前显示复选框。**（该属性自1.4.5版开始可用）**    | false       |
| lines         | boolean                       | 定义是否显示treegrid行。**（该属性自1.4.5版开始可用）**     | false       |
| loader        | function(param,success,error) | 定义以何种方式从远程服务器读取数据。返回false可以忽略该动作。该函数具有一下参数：param：传递到远程服务器的参数对象。success(data)：当检索数据成功的时候调用的回调函数。error()：当检索数据失败的时候调用的回调函数。 | json loader |
| loadFilter    | function(data,parentId)       | 返回过滤后的数据进行展示。                            |             |

## 事件

树形表格的事件扩展自[datagrid](data/grid.md)(数据表格)，树形表格新增的时间如下：

| **事件名**           | **事件参数**    | **描述**                                   |
| ----------------- | ----------- | ---------------------------------------- |
| onClickRow        | row         | 在用户点击节点的时候触发。                            |
| onDblClickRow     | row         | 在用户双击节点的时候触发。                            |
| onClickCell       | field,row   | 在用户点击单元格的时候触发。                           |
| onDblClickCell    | field,row   | 在用户双击单元格的时候触发。                           |
| onBeforeLoad      | row, param  | 在请求数据加载之前触发，返回false可以取消加载动作。             |
| onLoadSuccess     | row, data   | 数据加载完成之后触发。                              |
| onLoadError       | arguments   | 数据加载失败的时候触发，参数和jQuery的$.ajax()函数的'error'回调函数一样。 |
| onBeforeSelect    | row         | 在用户选择一行之前触发，返回false则取消该动作。**（该事件自1.4版开始可用）** |
| onSelect          | row         | 在用户选择的时候触发，返回false则取消该动作。**（该****事件****自1.4版开始可用）** |
| onBeforeUnselect  | row         | 在用户取消选择一行之前触发，返回false则取消该动作。**（该****事件****自1.4版开始可用）** |
| onUnselect        | row         | 在用户取消选择的时候触发，返回false则取消该动作。**（该****事件****自1.4版开始可用）** |
| onBeforeCheckNode | row,checked | 在用户选中一行节点之前触发，返回false则取消该动作。**（该****事件****自1.4.5版开始可用）** |
| onCheckNode       | row,checked | 在用户选中一行节点的时候触发，返回false则取消该动作。**（该****事件****自1.4.5版开始可用）** |
| onBeforeExpand    | row         | 在节点展开之前触发，返回false可以取消展开节点的动作。            |
| onExpand          | row         | 在节点被展开的时候触发。                             |
| onBeforeCollapse  | row         | 在节点折叠之前触发，返回false可以取消折叠节点的动作。            |
| onCollapse        | row         | 在节点被折叠的时候触发。                             |
| onContextMenu     | e, row      | 在右键点击节点的时候触发。                            |
| onBeforeEdit      | row         | 在用户开始编辑节点的时候触发。                          |
| onAfterEdit       | row,changes | 在用户完成编辑的时候触发。                            |
| onCancelEdit      | row         | 在用户取消编辑节点的时候触发。                          |

## 方法

很多方法都使用'id'命名参数，而'id'参数代表树节点的值。 

| **方法名**         | **方法参数** | **描述**                                   |
| --------------- | -------- | ---------------------------------------- |
| options         | none     | 返回树形表格的属性。                               |
| resize          | options  | 设置树形表格大小，options包含2个属性：width：树形表格的新宽度。height：树形表格的新高度。 |
| fixRowHeight    | id       | 修正指定的行高。                                 |
| load            | param    | 读取并显示首页内容。**（该方法自1.3.4版开始可用）** 代码示例：`// 读取并发送请求参数$('#tg').treegrid('load', {	q: 'abc',	name: 'name1'});` |
| loadData        | data     | 读取树形表格数据。                                |
| reload          | id       | 重新加载树形表格数据。如果'id'属性有值，将重新载入指定树形行，否则重新载入所有行。 代码示例：`$('#tt').treegrid('reload', 2);	// 重新载入值为2的行$('#tt').treegrid('reload');	// 重新载入所有行` |
| reloadFooter    | footer   | 重新载入页脚数据。                                |
| getData         | none     | 获取载入数据。                                  |
| getFooterRows   | none     | 获取页脚数据。                                  |
| getRoot         | none     | 获取根节点，返回节点对象。                            |
| getRoots        | none     | 获取所有根节点，返回节点数组。                          |
| getParent       | id       | 获取父节点。                                   |
| getChildren     | id       | 获取子节点。                                   |
| getSelected     | none     | 获取选择的节点并返回它，如果没有节点被选中则返回null。            |
| getSelections   | none     | 获取所有选择的节点。                               |
| getCheckedNodes | none     | 获取所有选中的行。**（该方法自1.4.5版开始可用）**            |
| getLevel        | id       | 获取指定节点等级。                                |
| find            | id       | 查找指定节点并返回节点数据。                           |
| select          | id       | 选择一个节点。                                  |
| unselect        | id       | 反选一个节点。                                  |
| selectAll       | none     | 选择所有节点。                                  |
| unselectAll     | none     | 反选所有节点。                                  |
| checkNode       | id       | 选中指定行节点。**（该方法自1.4.5版开始可用）**             |
| uncheckNode     | id       | 反选指定行节点。**（该方法自1.4.5版开始可用）**             |
| collapse        | id       | 折叠一个节点。                                  |
| expand          | id       | 展开一个节点。                                  |
| collapseAll     | id       | 折叠所有节点。                                  |
| expandAll       | id       | 展开所有节点。                                  |
| expandTo        | id       | 打开从根节点到指定节点之间的所有节点。                      |
| toggle          | id       | 节点展开/折叠状态触发器。                            |
| append          | param    | 追加节点到一个父节点，'param'参数包含如下属性：parent：父节点ID，如果未指定则追加到根节点。data：数组，节点数据。代码示例： `// 追加若干节点到选中节点的后面var node = $('#tt').treegrid('getSelected');$('#tt').treegrid('append',{	parent: node.id,  // the node has a 'id' value that defined through 'idField' property	data: [{		id: '073',		name: 'name73'	}]});` |
| insert          | param    | 插入一个新节点到指定节点。'param'参数包含一下参数：before：插入指定节点ID值之前。after：插入指定节点ID值之后。data：新节点数据。 代码示例：`// 插入一个新节点到选择的节点之前var node = $('#tt').treegrid('getSelected');if (node){	$('#tt').treegrid('insert', {		before: node.id,		data: {			id: 38,			name: 'name38'		}	});}`**（该方法自1.3.1版开始可用）** |
| remove          | id       | 移除一个节点和他的所有子节点。                          |
| pop             | id       | 弹出并返回节点数据以及它的子节点之后删除。**（该方法自1.3.1版开始可用）** |
| refresh         | id       | 刷新指定节点。                                  |
| update          | param    | 更新指定节点。'param'参数包含以下属性：id：要更新的节点的ID。row：新的行数据。 代码示例：`$('#tt').treegrid('update',{	id: 2,	row: {		name: '新名称',		iconCls: 'icon-save'	}});`**（该方法自1.3.1版开始可用）** |
| beginEdit       | id       | 开始编辑一个节点。                                |
| endEdit         | id       | 结束编辑一个节点。                                |
| cancelEdit      | id       | 取消编辑一个节点。                                |
| getEditors      | id       | 获取指定行编辑器。每个编辑器都包含以下属性：actions：编辑器执行的动作。target：目标编辑器的jQuery对象。field：字段名称。type：编辑器类型。 |
| getEditor       | param    | 获取指定编辑器，'param'参数包含2个属性：id：行节点ID。field：字段名称。 |
| showLines       | none     | 显示treegrid行。                             |