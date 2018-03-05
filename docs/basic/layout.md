# layout（布局）

使用$.fn.jxlayout.defaults重写默认值对象。

布局容器有5个区域：北、南、东、西和中间。中间区域面板是必须的，边缘的面板都是可选的。每个边缘区域面板都可以通过拖拽其边框改变大小，也可以点击折叠按钮将面板折叠起来。布局可以进行嵌套，用户可以通过组合布局构建复杂的布局结构。

## 使用案例

### 创建布局

- 通过标签创建布局

为`<div/>`标签增加名为`jxlayout`的类。

```html
<div id="cc" class="jxlayout" style="width:600px;height:400px;">  
    <div data-options="region:'north',title:'North Title',split:true" style="height:100px;"></div>  
    <div data-options="region:'south',title:'South Title',split:true" style="height:100px;"></div>  
    <div data-options="region:'east',iconCls:'icon-reload',title:'East',split:true" style="width:100px;"></div>  
    <div data-options="region:'west',title:'West',split:true" style="width:100px;"></div>  
    <div data-options="region:'center',title:'center title'" style="padding:5px;background:#eee;"></div>  
</div>  
```

- 使用完整页面创建布局

```html
<body class="jxlayout">  
    <div data-options="region:'north',title:'North Title',split:true" style="height:100px;"></div>  
    <div data-options="region:'south',title:'South Title',split:true" style="height:100px;"></div>  
    <div data-options="region:'east',iconCls:'icon-reload',title:'East',split:true" style="width:100px;"></div>  
    <div data-options="region:'west',title:'West',split:true" style="width:100px;"></div>  
    <div data-options="region:'center',title:'center title'" style="padding:5px;background:#eee;"></div>  
</body> 
```

- 创建嵌套布局

注意：嵌套在内部的布局面板的左侧(西面)面板是折叠的。

```html
<body class="jxlayout">  
    <div data-options="region:'north'" style="height:100px"></div>  
    <div data-options="region:'center'">  
        <div class="jxlayout" data-options="fit:true">  
            <div data-options="region:'west',collapsed:true" style="width:180px"></div>  
            <div data-options="region:'center'"></div>  
        </div>  
    </div>  
</body> 
```

- 通过ajax读取内容

布局是以面板为基础创建的。所有的布局面板都支持异步加载URL内容。使用异步加载技术，用户可以使自己的布局页面显示的内容更多更快。

```html
<body class="jxlayout">  
    <div data-options="region:'west',href:'west_content.php'" style="width:180px" ></div>  
    <div data-options="region:'center',href:'center_content.php'" ></div>  
</body>  
``` 

### 折叠布局面板

```js
$('#cc').jxlayout();   
// collapse the west panel   
$('#cc').jxlayout('collapse','west');  
```  

### 添加西侧区域面板和工具菜单按钮

```js
$('#cc').jxlayout('add',{   
    region: 'west',   
    width: 180,   
    title: 'West Title',   
    split: true,   
    tools: [{   
        iconCls:'icon-add',   
        handler:function(){alert('add')}   
    },{   
        iconCls:'icon-remove',   
        handler:function(){alert('remove')}   
    }]   
});  
```

## 布局属性

| **属性名** | **属性值类型** | **描述**                                   | **默认值** |
| ------- | --------- | ---------------------------------------- | ------- |
| fit     | boolean   | 如果设置为true，布局组件将自适应父容器。当使用'body'标签创建布局的时候，整个页面会自动最大。 | false   |


## 事件

使用`options`方式

| **事件名**    | **事件参数** | **描述**                                   |
| ---------- | -------- | ---------------------------------------- |
| onCollapse | region   | 在折叠区域面板的时候触发。**（该事件自1.4.4版开始可用）**        |
| onExpand   | region   | 在展开区域面板的时候触发。**（该****事件****自1.4.4版开始可用）** |
| onAdd      | region   | 在新增区域面板的时候触发。**（该****事件****自1.4.4版开始可用）** |
| onRemove   | region   | 在移除区域面板的时候触发。**（该****事件****自1.4.4版开始可用）** |

 
## 区域面板属性

区域面板属性定义与[panel](basic/panel.md)组件类似，下面的是公共的和新增的属性： 

| **属性名**              | **属性值类型**              | **描述**                                   | **默认值** |
| -------------------- | ---------------------- | ---------------------------------------- | ------- |
| title                | string                 | 布局面板标题文本。                                | null    |
| region               | string                 | 定义布局面板位置，可用的值有：north, south, east, west, center。 |         |
| border               | boolean                | 为true时显示布局面板边框。                          | true    |
| split                | boolean                | 为true时用户可以通过分割栏改变面板大小。                   | false   |
| iconCls              | string                 | 一个包含图标的CSS类ID，该图标将会显示到面板标题上。             | null    |
| href                 | string                 | 用于读取远程站点数据的URL链接                         | null    |
| collapsible          | boolean                | 定义是否显示折叠按钮。**（该属性自1.3.3版开始可用）**          | true    |
| minWidth             | number                 | 最小面板宽度。**（该属性自1.3.3版开始可用）**              | 10      |
| minHeight            | number                 | 最小面板高度。**（该属性自1.3.3版开始可用）**              | 10      |
| maxWidth             | number                 | 最大面板宽度。**（该属性自1.3.3版开始可用）**              | 10000   |
| maxHeight            | number                 | 最大面板高度。**（该属性自1.3.3版开始可用）**              | 10000   |
| expandMode           | string                 | 在点击折叠面板时候的扩展模式。可用值有：“float”、“dock”和nullfloat：区域面板将展开并浮动在顶部，在鼠标焦点离开面板时会自动隐藏。dock：区域面板将展开并钉在面板上，在鼠标焦点离开面板时不会自动隐藏。null：什么也不会发生。**（该属性自1.****4.4****版开始可用）** | float   |
| collapsedSize        | number                 | 折叠后的面板大小。**（该属性自1.****4.4****版开始可用）**    | 28      |
| hideExpandTool       | boolean                | 为true时隐藏折叠面板上的扩展面板工具。**（该属性自1.****4.4****版开始可用）** | false   |
| hideCollapsedContent | boolean                | 为true时隐藏折叠面板上的标题栏。**（该属性自1.****4.4****版开始可用）** | true    |
| collapsedContent     | string,function(title) | 定义在折叠面板上要显示标题内容。1. 标题字符串；2. 通过函数返回标题内容。**（该方法自1.4.4版开始可用）**代码示例：`collapsedContent: function(title){	var region = $(this).panel('options').region;	if (region == 'north' || region == 'south'){		return title;	} else {		return '<div class="mytitle">'+title+'</div>';	}}` |         |


## 方法

| **方法名**  | **方法属性** | **描述**                                   |
| -------- | -------- | ---------------------------------------- |
| resize   | param    | 设置布局大小。param对象包含如下属性：width：布局宽度。height：布局高度。代码示例：`$('#cc').layout('resize', {	width:'80%',	height:300})` |
| panel    | region   | 返回指定面板，'region'参数可用值有：'north','south','east','west','center'。 |
| collapse | region   | 折叠指定面板。'region'参数可用值有：'north','south','east','west'。 |
| expand   | region   | 展开指定面板。'region'参数可用值有：'north','south','east','west'。 |
| add      | options  | 添加指定面板。属性参数是一个配置对象，更多细节请查看选项卡面板属性。       |
| remove   | region   | 移除指定面板。'region'参数可用值有：'north','south','east','west'。 |
| split    | region   | 分割区域面板。'region'参数可用值有：'north','south','east','west'。**（该方法自1.4.2版开始可用）**代码示例：$("#layout").layout("split", "west");![img](itss://70DC0A6A-F7E6-448B-8491-D481ADB6CB9D/536ac27ad9dd84e522d2c8457d32af7a_68_files/4073125.png) |
| unsplit  | region   | 移除指定面板。'region'参数可用值有：'north','south','east','west'。**（该方法自1.4.2版开始可用）**代码示例：$("#layout").layout("unsplit", "west");![img](itss://70DC0A6A-F7E6-448B-8491-D481ADB6CB9D/536ac27ad9dd84e522d2c8457d32af7a_68_files/4091000.png) |