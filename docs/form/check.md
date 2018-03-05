# 单选/复选控件

!> [演示](demo/form/check.html)

单选/复选控件扩展自控件[iCheck](https://github.com/fronteed/icheck)。

## 使用方法

### 自动初始化

```html
<!--单选框-->
<div class="input-group">
    <div class="icheck-inline">
        <label>
            <input type="radio" name="radio1" class="icheck jxcheck" data-star="false" data-validate="{required: true}"> 单选 1 
        </label>
        <label>
            <input type="radio" name="radio1"  class="icheck jxcheck" data-validate="{required: true}" 
                data-color="blue" data-star="false"> 单选 2 
        </label>
        <label>
            <input type="radio" name="radio1" class="icheck jxcheck" data-validate="{required: true}"> 单选 3 
        </label>
    </div>
</div>
```

```html
<!--复选框-->
<div class="input-group">
    <div class="icheck-inline">
        <label>
            <input type="checkbox" name="checkbox1" class="icheck jxcheck"> 复选 1 
        </label>
        <label>
            <input type="checkbox" name="checkbox1" class="icheck jxcheck" checked> 复选 2 
        </label>
        <label>
            <input type="checkbox" name="checkbox1" class="icheck jxcheck"> 复选 3 
        </label>
    </div>
</div>
```

### 手动初始化

支持任意选择器，但是只能处理单选框和复选框。

```js
//自定义配置选项
$('input').options({
  // 配置选项
});

//手动初始化
jx.ready('icheck',function() {
    $('input').jxcheck({
        // 配置选项
    });
});
```

## 控件颜色

![](img/jx-check/00edc4be.png)

系统默认定义为红色。

| 名称 | 说明 |
|------|------|
| `red`     |   红色   |
| `green`   |   绿色   |
| `blue`    |   蓝色   |
| `aero`    |   毛玻璃 |
| `grey`    |   灰色   |
| `orange`  |   橘色   |
| `yellow`  |   黄色   |
| `pink`    |   粉红   |
| `purple`  |   紫色   |
| `空`      |   黑色   |

### 全局定义控件颜色
```js
$.fn.jxcheck.defaults.color = 'red';
```

### 局部定义控件颜色
```html
<input type="radio" data-color="blue"> 单选框
```


## 选项

These options are default:

```js
{
  // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
  handle: '',

  // base class added to customized checkboxes
  checkboxClass: 'icheckbox',

  // base class added to customized radio buttons
  radioClass: 'iradio',

  // class added on checked state (input.checked = true)
  checkedClass: 'checked',

  // if not empty, used instead of 'checkedClass' option (input type specific)
  checkedCheckboxClass: '',
  checkedRadioClass: '',

  // if not empty, added as class name on unchecked state (input.checked = false)
  uncheckedClass: '',

  // if not empty, used instead of 'uncheckedClass' option (input type specific)
  uncheckedCheckboxClass: '',
  uncheckedRadioClass: '',

  // class added on disabled state (input.disabled = true)
  disabledClass: 'disabled',

  // if not empty, used instead of 'disabledClass' option (input type specific)
  disabledCheckboxClass: '',
  disabledRadioClass: '',

  // if not empty, added as class name on enabled state (input.disabled = false)
  enabledClass: '',

  // if not empty, used instead of 'enabledClass' option (input type specific)
  enabledCheckboxClass: '',
  enabledRadioClass: '',

  // class added on indeterminate state (input.indeterminate = true)
  indeterminateClass: 'indeterminate',

  // if not empty, used instead of 'indeterminateClass' option (input type specific)
  indeterminateCheckboxClass: '',
  indeterminateRadioClass: '',

  // if not empty, added as class name on determinate state (input.indeterminate = false)
  determinateClass: '',

  // if not empty, used instead of 'determinateClass' option (input type specific)
  determinateCheckboxClass: '',
  determinateRadioClass: '',

  // class added on hover state (pointer is moved onto input)
  hoverClass: 'hover',

  // class added on focus state (input has gained focus)
  focusClass: 'focus',

  // class added on active state (mouse button is pressed on input)
  activeClass: 'active',

  // adds hoverClass to customized input on label hover and labelHoverClass to label on input hover
  labelHover: true,

  // class added to label if labelHover set to true
  labelHoverClass: 'hover',

  // increase clickable area by given % (negative number to decrease)
  increaseArea: '',

  // true to set 'pointer' CSS cursor over enabled inputs and 'default' over disabled
  cursor: false,

  // set true to inherit original input's class name
  inheritClass: false,

  // if set to true, input's id is prefixed with 'iCheck-' and attached
  inheritID: false,

  // set true to activate ARIA support
  aria: false,

  // add HTML code or text inside customized input
  insert: ''
}
```

There's no need to copy and paste all of them, you can just mention the ones you need:

```js
$('input').jxcheck({
  labelHover: false,
  cursor: true
});
```

You can choose any class names and style them as you want.

## Indeterminate

HTML5 allows specifying [indeterminate](http://css-tricks.com/indeterminate-checkboxes/) ("partially" checked) state for checkboxes. iCheck supports this for both checkboxes and radio buttons.

You can make an input indeterminate through HTML using additional attributes (supported by iCheck). Both do the same job, but `indeterminate="true"` may not work in some browsers (like IE7):

```html
indeterminate="true"
<input type="checkbox" indeterminate="true">
<input type="radio" indeterminate="true">

determinate="false"
<input type="checkbox" determinate="false">
<input type="radio" determinate="false">
```

`indeterminate` and `determinate` [方法](#方法) can be used to toggle indeterminate state.

## 事件

iCheck provides plenty callbacks, which may be used to handle changes.

| Callback name | When used |
|--------------------|--------------------|
|  ifClicked  |  user clicked on a customized input or an assigned label  |
|  ifChanged  |  input's "checked", "disabled" or "indeterminate" state is changed  |
|  ifChecked  |  input's state is changed to "checked"  |
|  ifUnchecked  |  "checked" state is removed  |
|  ifToggled  |  input's "checked" state is changed  |
|  ifDisabled  |  input's state is changed to "disabled"  |
|  ifEnabled  |   "disabled" state is removed |
|  ifIndeterminate  |  input's state is changed to "indeterminate"  |
|  ifDeterminate  |  "indeterminate" state is removed  |
|  ifCreated  |  input is just customized  |
|  ifDestroyed  |  customization is just removed  |

Use `on()` method to bind them to inputs:

```js
$('input').on('ifChecked', function(event){
  alert(event.type + ' callback');
});
```

`ifCreated` callback should be binded before plugin init.

## 方法

These methods can be used to make changes programmatically (any selectors can be used):

```js
// change input's state to 'checked'
$('input').iCheck('check');

// remove 'checked' state
$('input').iCheck('uncheck');

// toggle 'checked' state
$('input').jxcheck('toggle');

// change input's state to 'disabled'
$('input').jxcheck('disable');

// remove 'disabled' state
$('input').jxcheck('enable');

// change input's state to 'indeterminate'
$('input').jxcheck('indeterminate');

// remove 'indeterminate' state
$('input').jxcheck('determinate');

// apply input changes, which were done outside the plugin
$('input').jxcheck('update');

// remove all traces of iCheck
$('input').jxcheck('destroy');
```

You may also specify some function, that will be executed on each method call:

```js
$('input').jxcheck('check', function(){
  alert('Well done, Sir');
});
```

Feel free to fork and submit pull-request or submit an issue if you find something not working.

