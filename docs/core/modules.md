# 模块对象

模块是指一组样式文件或者脚本文件的集合，框架允许提前定义模块，在需要的时候动态加载，从而提高加载速度。

## 模块定义

模块是一个`Javascript`对象，键名为模块名称，键值为模块对应的样式文件或者脚本文件集合，键值可以是字符串、数组、对象三种类型。

!> 模块对应的样式文件或者脚本文件可以使用以下三种方式定义。

!> 样式文件或者脚本文件的路径建议使用完整路径，
如：`http://124.115.168.58:1000/cdn/jquery-sortable.js`或者`/cdn/jquery-sortable.js`。


## 字符串
模块中多个文件路径可以用`逗号`、`空格`分割的方式。

```js
{
    mod1: 'mo1/css/m1.css,mo1/css/m2.css,mo1/js/m1.js,mo1/js/m2.js',
    mod2: 'mo2/css/m1.css mo2/js/m1.js'
}
```

## 数组
模块中多个文件路径可以用`数组`的方式。

```js
{
    clockpicker: [
            'bootstrap-clockpicker/bootstrap-clockpicker.css',
            'bootstrap-clockpicker/bootstrap-clockpicker.js'
        ]
}
```

## 对象
模块中多个文件路径可以用`对象`的方式，这种方式适用于当前模块依赖于其他模块的时候。

对象包括以下属性:

- depend 用于定义依赖的模块名称，依赖多个模块名称使用`逗号分割`、`空格分割`、`数组`定义
- url 用于定义当前模块的样式文件或者脚本文件，多个路径使用`逗号分割`、`空格分割`、`数组`定义

```js
{
    jxcolor: {depend: 'animate,jqminicolors', url: 'jx/jxcolor.js'}
}
```

!> 以上三种定义方式可以混合使用。

模块对象定义完成后使用`jx.regModules`函数进行注册。

```js
jx.regModules({
    //时间控件
    clockpicker: [
        jx.libDir + 'bootstrap-clockpicker/bootstrap-clockpicker.css',
        jx.libDir + 'bootstrap-clockpicker/bootstrap-clockpicker.js'
    ],
    //日期时间控件
    datetime: [
        jx.libDir + 'bootstrap-datetimepicker/bootstrap-datetimepicker.css',
        jx.libDir + 'bootstrap-datetimepicker/bootstrap-datetimepicker.js'
    ]
});
```

## 模块引用

模块引用主要使用以下两种方式：

- `jx.require(deps, callback)`
    - deps 依赖的模块对象
    - callback 加载完成后回调函数

动态加载模块，在任何时刻都可以调用此函数动态加载模块。

```js
jx.require('sweetalert', function () {
    alert('模块加载完成');
});
```

- `jx.depend(deps)`
    - deps 依赖的模块对象

声明模块依赖，只是声明依赖并不加载。为保证声明的依赖模块能顺利加载，此声明语句需要在`jx.ready`事件中执行。

```js
jx.ready(function (e) {
    if (document.querySelector('.jxdatetime')) {
        jx.depend('datetime');
    }
});
```