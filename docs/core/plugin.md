# 插件开发

框架封装了一些函数和事件，用来简化插件的开发。

## 定义

插件定义使用`jx.plugin(options)`函数。`options`选项如下：

- `name`                指定插件名称，必填项。
- `create`              指定插件管理函数，返回管理实例对象，必填项。
- `selector`            指定插件选择器，默认：`.{name}`，可选项。
- `depend`              指定插件依赖模块，依赖多个模块使用`逗号分割`、`空格分割`、`数组`指定，可选项。
- `auto`                是否自动实例化，默认：`true`，可选项。
- `defaults`            指定插件默认值，默认：`{}`，可选项。
- `options`: null       解析插件选项，默认：`return jx.parseOptions($(element));`，可选项。
- `onLoad`: null        插件加载事件，默认：`null`，可选项。
- `onInstance`: null    插件实例化事件，可选项。

## 返回值

插件返回插件管理函数的返回值

## 示例

### 定义插件
```js
/**
 * 自定义插件
 */
jx.ns('jx.ui');
jx.ui.Plugin = function ($element, options) {
    //$element 当前jQuery对象
    //options 当前配置选项

    //插件初始化
    var init = function () {
        
    }();

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
    create: jx.ui.Plugin,//插件管理函数
    options: function (element) {
        //element 当前dom对象
        return jx.parseOptions($(element), ['min', 'max', 'step',{mousewheel: 'boolean'}]);
    },
    defaults: { //指定插件配置选项默认值
        showSelect: true,
        showClear: true,
        autoclose: true,
        todayHighlight: true,
        changeValidate: true
    },
    onLoad:function () { //插件加载时做一些初始化操作
        $.fn.jxform.defaults.validateOptions.ignore += ':not(.jxhtmleditor)';
    },
    onInstance:function(e) { //插件实例化事件 默认情况下不需要自己实现
      $(e.target).find('.jxui').jxui();
    }
});
```

### 页面
```html
<div id="udiv" class="jxui"></div>
<script>
jx.ready(function() {
  var instance = $('#udiv').jxui();
  console.log(instance.version);//显示版本
  instance.show();//调用插件方法
});
</script>
```