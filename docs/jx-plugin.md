# 插件开发

框架封装了一些函数和事件，用来简化插件的开发。

## 定义

插件定义使用`jx.plugin(options)`函数。插件配置选项如下：

- `name`  指定插件名称

- `instance` 指定插件具体实现类

```js
{
    instance: function ($ele, ops) {
        // $ele  当前jQuery对象
        // ops   解析到的插件配置选项   
        return Form($ele, ops);
    }
}
```

- `options` 解析插件配置选项

```js
{
    options: function ($ele) {
        // $ele 当前`jQuery`对象
        return jx.parseOptions($ele, ['maskMsg', 'maskDelay',
            {maskTarget: 'object'}, {protip: 'boolean'}, {msgtip: 'boolean'}]);
    }
}
```

- `defaults` 指定插件配置选项默认值

```js
{
    defaults: {
        showSelect: true,
        showClear: true
        ...
    }
}
```

- `onBeforeInit` 插件实例化之前，用于声明模块依赖

- `onInit` 插件实例化

- `onAfterInit` 插件实例化之后
## 示例

```js
/**
 * 自定义插件
 */

(function ($) {

    //实现类
    var Plugin = function ($ele, ops) {
        var $element = $ele; //当前jQuery对象
        var options = ops || {};//当前配置选项

        var init = function () {
            //插件初始化
        };

        //执行初始化
        init();

        return {
            //公共属性
            version:'0.0.1',
            debug:true,
            //公共方法
            show:function() {
              
            }
        }
    };

    //插件定义
    jx.plugin({
        name: 'jxui',//插件名称
        instance: function ($ele, ops) {
            return Plugin($ele, ops);//返回插件实现类
        },
        options: function ($ele) {
            // $ele 当前`jQuery`对象
            return jx.parseOptions($ele);//解析插件配置选项
        },
        defaults: { //指定插件配置选项默认值
            showSelect: true,
            showClear: true,
            autoclose: true,
            todayHighlight: true,
            changeValidate: true
        },
        onBeforeInit:function (e) {
             //根据具体情况，声明模块依赖
             /*if (document.querySelector('.jxui')) {
                 jx.depend('jxui');
             }*/
         },
         onInit:function (e) { //插件实例化
            $(e.target).find('.jxui').jxui();
         },
         onAfterInit:function(e) { //初始化之后
           
         }
    });

}(jQuery));
```

## 配置选项解析机制

框架中所有组件的解析默认采用`jx.parseOptions($target, [array]);`函数。同时强烈建议大家自定义插件时尽量使用此函数，此函数功能强大，可以满足绝大多数的场景。

解析函数解析配置选项的逻辑：

- 读取`$target`目标元素中`data-options`中的值，`data-options`属性值为一个对象字符串，框架自动转换为`JavaScript`对象。
- 读取`$target`目标元素中`data-*`中的值，如果要解析此属性需要指定`properties`参数。
- 读取`$target`目标元素中`$target.data('jxoptions')`属性的值。
  
`data-options`中只适合编写简单的配置选项，如果配置选项中需要编写大量的选项以及一些回调函数，那么用这种办法会很乱，不建议使用这种方式。推荐使用`$element.jxoptions(options)`函数来指定，在`jx.ready(callback)`函数中编写。
可以把`data-options`和`$target.data('jxoptions')`结合起来，`data-options`写简单参数，`$target.data('jxoptions')`编写复杂参数，解析函数会自动合并。

解析函数有两个参数，具体使用方法：

- $target 指定需要解析的`jQuery`对象

- properties 指定解析的`html`元素中`data-*`的属性名称

此属性是一个数组，每个数组元素可以是一个字符串，用来解析`data-*`的属性值，默认解析到的值是字符串，如果不解析`data-*`的属性值，此参数可以省略。

如果需要的解析的属性值不是字符串，而是`boolean`、`number`、`object`、`array`等值，那么数组元素需要定义为对象。

```js
jx.ready(function () {
    //组件初始化之前设置组件配置选项
    $target.jxoptions({
        multiple: true,
        editable:false,
        gridOptions: {
            url: '../mock/grid.json',
            mainId: "F_CustomerId",
            mainText: "F_FullName",
            headData: [
                {label: '客户编号', name: 'F_EnCode', width: 130, align: 'center', sort: true},
                {label: '客户名称', name: 'F_FullName', width: 200, align: 'left', sort: true},
                {label: '客户类别', name: 'F_CustTypeId', width: 100, align: 'center'},
                {label: '客户程度', name: 'F_CustDegreeId', width: 100, align: 'center'},
                {label: '联系人', name: 'F_Contact', width: 100, align: 'center'},
                {label: '跟进人员', name: 'F_TraceUserName', width: 100, align: 'center'}
            ]
        }
    });
    
    //解析以下属性的值
    // data-options 中的配置选项
    // data-jxoptions 中的配置选项
    jx.parseOptions($target);
    
    //解析以下属性的值
    // data-options 中的配置选项
    // data-jxoptions 中的配置选项
    // data-id(string) data-title(string) data-fit(boolean) data-border(boolean) data-min(number)
    jx.parseOptions($target, ['id','title',{fit:'boolean',border:'boolean'},{min:'number'}]);
});
```