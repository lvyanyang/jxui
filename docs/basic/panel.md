# panel（面板）

!> [演示](demo/basic/panel.html)

## 使用方法

1. 全屏工具条
```html
<div class="jxpanel" title="面板标题" data-options="fit:true" style="padding: 5px">
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <!--底部工具条-->
    <div class="panel-footer text-right">
        <button class="btn btn-primary" type="submit">
            <i class="fa fa-save"></i> 保存
        </button>
        <button class="btn btn-default" type="button">
            <i class="fa fa-sign-in"></i> 返回
        </button>
    </div>
</div>
```

2. 自适应工具条
```html
<div class="jxpanel" title="面板标题" data-options="fit:true" style="padding: 5px">
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <p>content</p>
    <!--底部工具条-->
    <div class="jxpanel-footer text-right">
        <button class="btn btn-primary" type="submit">
            <i class="fa fa-save"></i> 保存
        </button>
        <button class="btn btn-default" type="button">
            <i class="fa fa-sign-in"></i> 返回
        </button>
    </div>
</div>
```

## 属性

| **属性名**        | **属性值类型**      | **描述**                                   | **默认值**  |
| -------------- | -------------- | ---------------------------------------- | -------- |
| id             | string         | 面板的ID属性。                                 | null     |
| title          | string         | 在面板头部显示的标题文本。                            | null     |
| iconCls        | string         | 设置一个16x16图标的CSS类ID显示在面板左上角。              | null     |
| width          | number         | 设置面板宽度。                                  | auto     |
| height         | number         | 设置面板高度。                                  | auto     |
| left           | number         | 设置面板距离左边的位置（即X轴位置）。                      | null     |
| top            | number         | 设置面板距离顶部的位置（即Y轴位置）。                      | null     |
| cls            | string         | 添加一个CSS类ID到面板。                           | null     |
| headerCls      | string         | 添加一个CSS类ID到面板头部。                         | null     |
| bodyCls        | string         | 添加一个CSS类ID到面板正文部分。                       | null     |
| style          | object         | 添加一个当前指定样式到面板。 如下代码示例更改面板边框宽度：`<div class="easyui-panel" style="width:200px;height:100px"        data-options="style:{borderWidth:2}"></div>` | {}       |
| fit            | boolean        | 当设置为true的时候面板大小将自适应父容器。下面的例子显示了一个面板，可以自动在父容器的最大范围内调整大小。 `<div style="width:200px;height:100px;padding:5px">	<div class="easyui-panel" style="width:200px;height:100px"			data-options="fit:true,border:false">		Embedded Panel	</div></div>` | false    |
| border         | boolean        | 定义是否显示面板边框。                              | true     |
| doSize         | boolean        | 如果设置为true，在面板被创建的时候将重置大小和重新布局。           | true     |
| noheader       | boolean        | 如果设置为true，那么将不会创建面板标题。                   | false    |
| content        | string         | 面板主体内容。                                  | null     |
| halign         | string         | 定义面板头部对齐方式。可用值有：'top', 'left', 'right'。**（该属性自1.5.2版开始可用）** | top      |
| titleDirection | string         | 定义面板标题方向。可用值有：'up', 'down'。该属性仅在halign值为'left'或'right'时有效。**（该属性自1.5.2版开始可用）** | down     |
| collapsible    | boolean        | 定义是否显示可折叠按钮。                             | false    |
| minimizable    | boolean        | 定义是否显示最小化按钮。                             | false    |
| maximizable    | boolean        | 定义是否显示最大化按钮。                             | false    |
| closable       | boolean        | 定义是否显示关闭按钮。                              | false    |
| tools          | array,selector | 自定义工具菜单，可用值：1) 数组，每个元素都包含'iconCls'和'handler'属性。2) 指向工具菜单的选择器。面板工具菜单可以声明在已经存在的<div>标签上：`<div class="easyui-panel" style="width:300px;height:200px"		title="My Panel" data-options="iconCls:'icon-ok',tools:'#tt'"></div><div id="tt">	<a href="#" class="icon-add" onclick="javascript:alert('add')"></a>	<a href="#" class="icon-edit" onclick="javascript:alert('edit')"></a></div>`面板工具菜单也可以通过数组定义：`<div class="easyui-panel" style="width:300px;height:200px"		title="My Panel" data-options="iconCls:'icon-ok',tools:[				{					iconCls:'icon-add',					handler:function(){alert('add')}				},{					iconCls:'icon-edit',					handler:function(){alert('edit')}				}]"></div>` | []       |
| header         | selector       | 定义面板标题。**（该属性自1.4.2版开始可用）**代码示例：`<div class="easyui-panel" style="width:300px;height:200px"		title="我的面板">	<header>面板标题</header></div>` |          |
| footer         | selector       | 定义面板页脚。**（该属性自1.4.1版开始可用）**代码示例：`<div class="easyui-panel" style="width:300px;height:200px"            title="我的面板" data-options="iconCls:'icon-ok',tools:[                        {                                    iconCls:'icon-add',                                    handler:function(){alert('添加')}                        },{                                    iconCls:'icon-edit',                                    handler:function(){alert('编辑')}                        }]"></div>` | null     |
| openAnimation  | string         | 定义打开面板的动画，可用值有：'slide','fade','show'。**（该属性自1.4.1版开始可用）** |          |
| openDuration   | number         | 定义打开面板的持续时间。**（该属性自1.4.1版开始可用）**         | 400      |
| closeAnimation | string         | 定义关闭面板的动画，可用值有：'slide','fade','show'。**（该属性自1.4.1版开始可用）** |          |
| closeDuration  | number         | 定义关闭面板的持续时间。**（该属性自1.4.1版开始可用）**         | 400      |
| collapsed      | boolean        | 定义是否在初始化的时候折叠面板。                         | false    |
| minimized      | boolean        | 定义是否在初始化的时候最小化面板。                        | false    |
| maximized      | boolean        | 定义是否在初始化的时候最大化面板。                        | false    |
| closed         | boolean        | 定义是否在初始化的时候关闭面板。                         | false    |
| href           | string         | 从URL读取远程数据并且显示到面板。注意：内容将不会被载入，直到面板打开或扩大，在创建延迟加载面板时是非常有用的：`<div id="pp" class="easyui-panel" style="width:300px;height:200px"		data-options="href='get_content.php',closed:true"></div><a href="#" onclick="javascript:$('#pp').panel('open')">Open</a>` | null     |
| cache          | boolean        | 如果为true，在超链接载入时缓存面板内容。                   | true     |
| loadingMessage | string         | 在加载远程数据的时候在面板内显示一条消息。                    | Loading… |
| extractor      | function       | 定义如何从ajax应答数据中提取内容，返回提取数据。`extractor: function(data){	var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;	var matches = pattern.exec(data);	if (matches){		return matches[1];	// 仅提取主体内容	} else {		return data;	}}` |          |
| method         | string         | 使用HTTP的哪一种方法读取内容页。可用值：'get','post'。**（该属性自1.3.6版开始可用）** | get      |
| queryParams    | object         | 在加载内容页的时候添加的请求参数。**（该属性自1.3.6版开始可用）**    | {}       |
| loader         | function       | 定义了如何从远程服务器加载内容页，该函数接受以下参数：param：参数对象发送给远程服务器。success(data)：在检索数据成功的时候调用的回调函数。error()：在检索数据失败的时候调用的回调函数。**（该属性自1.3.6版开始可用）** |          |


## 事件

使用`options`方式

| **事件名**          | **事件参数**      | **描述**                                   |
| ---------------- | ------------- | ---------------------------------------- |
| onBeforeLoad     | none          | 在加载内容页之前触发，返回false将忽略该动作。**（该事件自1.3.6版开始可用）** |
| onLoad           | none          | 在加载远程数据时触发。                              |
| onLoadError      | none          | 在加载内容页发生错误时触发。**（该事件自1.3.6版开始可用）**       |
| onBeforeOpen     | none          | 在打开面板之前触发，返回false可以取消打开操作。               |
| onOpen           | none          | 在打开面板之后触发。                               |
| onBeforeClose    | none          | 在关闭面板之前触发，返回false可以取消关闭操作。下列的面板将不能关闭。`<div class="easyui-panel" style="width:300px;height:200px;"		title="My Panel" data-options="onBeforeClose:function(){return false}">    面板将不能关闭</div>` |
| onClose          | none          | 在面板关闭之后触发。                               |
| onBeforeDestroy  | none          | 在面板销毁之前触发，返回false可以取消销毁操作。               |
| onDestroy        | none          | 在面板销毁之后触发。                               |
| onBeforeCollapse | none          | 在面板折叠之前触发，返回false可以终止折叠操作。               |
| onCollapse       | none          | 在面板折叠之后触发。                               |
| onBeforeExpand   | none          | 在面板展开之前触发，返回false可以终止展开操作。               |
| onExpand         | none          | 在面板展开之后触发。                               |
| onResize         | width, height | 在面板改变大小之后触发。width：新的宽度。height：新的高度。      |
| onMove           | left,top      | 在面板移动之后触发。left：新的左边距位置。top：新的上边距位置。      |
| onMaximize       | none          | 在窗口最大化之后触发。                              |
| onRestore        | none          | 在窗口恢复到原始大小以后触发。                          |
| onMinimize       | none          | 在窗口最小化之后触发。                              |

## 方法

| **方法名**  | **方法参数**     | **描述**                                   |
| -------- | ------------ | ---------------------------------------- |
| options  | none         | 返回属性对象。                                  |
| panel    | none         | 返回面板对象。                                  |
| header   | none         | 返回面板头对象。                                 |
| footer   | none         | 返回面板页脚对象。**（该方法自1.4.1版开始可用）**            |
| body     | none         | 返回面板主体对象。                                |
| setTitle | title        | 设置面板头的标题文本。                              |
| open     | forceOpen    | 在'forceOpen'参数设置为true的时候，打开面板时将跳过'onBeforeOpen'回调函数。 |
| close    | forceClose   | 在'forceClose'参数设置为true的时候，关闭面板时将跳过'onBeforeClose'回调函数。 |
| destroy  | forceDestroy | 在'forceDestroy'参数设置为true的时候，销毁面板时将跳过'onBeforeDestory'回调函数。 |
| clear    | none         | 清除面板内容。**（该方法自1.4版开始可用）**                |
| refresh  | href         | 刷新面板来装载远程数据。如果'href'属性有了新配置，它将重写旧的'href'属性。 代码示例：`// 打开面板且刷新其内容。$('#pp').panel('open').panel('refresh');// 刷新一个新的URL内容$('#pp').panel('open').panel('refresh','new_content.php');` |
| resize   | options      | 设置面板大小和布局。参数对象包含下列属性：width：新的面板宽度。height：新的面板高度。left：新的面板左边距位置。top：新的面板上边距位置。 代码示例：`$('#pp').panel('resize',{	width: 600,	height: 400});` |
| doLayout | none         | 设置面板内子组件的大小。**（该方法自1.4版开始可用）**           |
| move     | options      | 移动面板到一个新位置。参数对象包含下列属性：left：新的左边距位置。top：新的上边距位置。 |
| maximize | none         | 最大化面板到容器大小。                              |
| minimize | none         | 最小化面板。                                   |
| restore  | none         | 恢复最大化面板回到原来的大小和位置。                       |
| collapse | animate      | 折叠面板主题。                                  |
| expand   | animate      | 展开面板主体。                                  |