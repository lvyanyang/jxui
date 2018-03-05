# 组件

框架中所有组件的初始化方式都是一致的，对于UI组件都需要初始化才能使用。

## 组件配置选项

每个UI组件都支持配置选项，支持以下三种方式.

- `data-options`

在html元素的`data-options`属性中指定配置选项.属性值为一个对象字符串,框架自动转换为`JavaScript`对象.
    
```html
<a class="btn btn-default jxdialog" data-options="{title:'业务新增',url:'page/grid.html', width:'100%',height:'100%'}">
    新增
 </a>
```
    
- `data-*`

根据插件中的定义,可以读取`data-*`中定义的配置属性值,具体情况请查看[`jx.parseOptions`](core/core.md?#parseoptionstarget-properties)

- 手动初始化，指定配置选项

`data-options`中只适合编写简单的配置选项，如果配置选项中需要编写大量的选项以及一些回调函数，那么用这种办法会很乱，不建议使用这种方式。

此时可以手动初始化，在`jx.ready(callback)`函数中编写。两种写法会自动合并，手动编写的配置选项优先级高。
    
```js
jx.ready(function () {
    //组件初始化之前设置组件配置选项
    $('#user_grid').plugin({
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

## 组件初始化

框架中的组件默认都支持`自动初始化`和`手动初始化`。

- 自动初始化
只需要给html元素的`class`属性添加`插件选择器`,即可自动初始化组件.
    
```html
<a class="jxdialog">
    新增
 </a>
```
    
- 手动初始化
需要在js脚本中初始化组件,建议在`jx.ready(callback)`函数中初始化,一旦手动进行初始化,自动初始化将不再处理.

```html
jx.ready({
   $('#mdate').插件名称({
      //配置属性
   });
});
```

## 组件事件

- 事件采用`on('event_name')`的方式来实现

```js
//表单事件
$('form').on('beforesubmit', function () {
    
}).on('aftersubmit', function (e, result) {
    
});
```

- 事件采用`options`的方式来实现

```js
$('.jxtree').jxtree({
    maskMsg: $tree.data('maskMsg') || '正在加载菜单...',
    onLoadSuccess: function () {},
    onClick: function (node) {}
});
```

## 组件方法

```js
var $chart = $('#mainChart');
var instance = $chart.jxchart({});

instance.show();
```

## 组件默认值

修改 `$.fn.{plugin}.defaults`

## 页面启动函数

`jx.ready(deps, callback)` 在页面dom加载完成,页面依赖加载完成,在所有组件初始化之前执行

```js
jx.ready(function () {
    //页面初始化代码
});

//指定依赖模块：mod1和mod2
jx.ready('mod1,mod2',function () {
    //页面初始化代码
});
