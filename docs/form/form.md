# 表单

表单控件集成了[`jquery-validation`](https://github.com/jquery-validation/jquery-validation)和[`jquery-form`](https://github.com/jquery-form/form)两个第三方插件。

!> [示例](demo/form/form.html)

## 使用方法

1. `form`标签使用`jxform`类标注.

1. 控件使用`data-validate`设置验证规则

1. `form`标签内使用`submit`按钮进行提交

1. 示例

```html
<div class="jxform-wrap">
    <div class="jxform-container">
        <form class="jxform" method="post" action="form.php">
            <div class="jxform-header">
                <div class="jxform-title"><strong>表单示例</strong></div>
            </div>
            <table class="table jxtable-form">
                <tr>
                    <th class="w-110px">姓名</th>
                    <td>
                        <input name="name" class="form-control" maxlength="5" 
                            data-validate="{required: [true,'请输入姓名'],maxlength: [5,'姓名长度不能超过{0}个字符']}">
                    </td>
                </tr>
                <tr>
                    <th>身份证</th>
                    <td>
                        <input name="idnum" class="form-control" maxlength="18"
                            data-validate="{required: true,idNumber:true}">
                    </td>
                </tr>
            </table>
            <div class="jxform-footer pl-130">
                <button class="btn btn-primary" type="submit"><i class="fa fa-save"></i> 提交</button>
            </div>
        </form>
    </div>
</div>
```

## 验证规则

!> 控件要启用验证规则,必须要设置name属性,否则将会被忽略.name不能重复,否则规则会被覆盖.

验证规则采用与`jquery-validation`插件一致的规则,为了简化规则声明,框架提供了简单方式来声明验证规则,主要分以下两种情况:

1. 不指定错误消息:`data-validate="{规则1: 规则值1,规则2:规则值2,...}"`,此时使用验证规则默认设置的错误消息.
```html
<input name="idnum" data-validate="{required: true,maxlength:18,idNumber:true}">
```
1. 指定错误消息:`data-validate="{规则1: [规则值1,'规则1错误消息'],规则2:[规则值2,'规则2错误消息'],...}"`
```html
<input name="idnum" data-validate="{required: [true,'请输入身份证号码'],
        idNumber:[true,'请输入正确的身份证号码'],
        maxlength: [18,'身份证号码长度不能超过{0}个字符']}">
```

## 框架内置规则

### `jQuery-validation` 内置规则
```
required:true               这是必填字段
remote:"remote-valid.jsp"   使用ajax方法调用remote-valid.jsp验证输入值,请修正此字段
email:true                  请输入有效的电子邮件地址
url:true                    请输入有效的网址
date:true                   请输入有效的日期
dateISO:true                请输入有效的日期 (YYYY-MM-DD)
number:true                 请输入有效的数字
digits:true                 只能输入数字
creditcard:true             请输入有效的信用卡号码
equalTo:"#password"         输入值必须和#password相同,你的输入不相同
extension:                  请输入有效的后缀
accept:                     输入拥有合法后缀名的字符串（上传文件的后缀）
maxlength:5                 $.validator.format( "最多可以输入 {0} 个字符" )
minlength:10                $.validator.format( "最少要输入 {0} 个字符" )
rangelength:[5,10]          $.validator.format( "请输入长度在 {0} 到 {1} 之间的字符串" )
range:[5,10]                $.validator.format( "请输入范围在 {0} 到 {1} 之间的数值" )
max:5                       $.validator.format( "请输入不大于 {0} 的数值" )
min:10                      $.validator.format( "请输入不小于 {0} 的数值" )
```

### 框架扩展规则
```
compareEqualDate:"#startDate"            结束日期必须大于等于开始日期
compareDate:"#startDate"                 结束日期必须大于开始日期
compareEqualNowDate:"#startDate"         必须大于等于当前日期
compareNumber                            当前数字必须大于等于指定的数字
idNumber:true                            请输入正确的身份证号码
carNumber                                请输入正确的车牌号码
phone:true                               请输入正确的手机号码
len:10                                   $.validator.format("必须输入 {0} 个字符")
```

## 扩展验证规则

```js
/**
 * 表单验证规则扩展
 */
(function ($) {
    /**
     * 必须大于等于当前日期
     */
    $.validator.methods.compareEqualNowDate = function (value, element, param) {
        if (value.trim() === '') {
            return true;
        }
        var startDate = new Date(value.replace(/[-.,]/g, "/"));
        var endDate = new Date(jx.formatDate(new Date()).replace(/[-.,]/g, "/"));
        return this.optional(element) || startDate >= endDate;
    };
        
    /**
     * 等于指定长度验证
     */
    $.validator.methods.len = function (value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length === param;
    };
    
    //设置验证规则错误消息默认值
    $.extend($.validator.messages, {
        compareEqualNowDate: '必须大于等于当前日期',
        len: $.validator.format("必须输入 {0} 个字符")
    });
})(jQuery);
```


## 表单选项

### maskTarget
加载提示消息容器

默认:$(form)

### maskMsg
加载提示消息

默认值:正在提交数据,请稍等...
 
### maskDelay
加载提示延迟毫秒

默认:100

### protip
是否显示浮动提示

默认:true

![](./img/jx-form/d5d386c6.png)
 
### msgtip
是否显示消息提示

默认:true

![](./img/jx-form/de38c3e1.png)
 
### requiredStar
自动显示必填星号

默认:true

![](./img/jx-form/3a087e10.png)
 
### validateOptions
原生验证选项

默认:{}

### highlightElement($ele)
获取错误高亮元素
```js
//默认:
highlightElement: function ($ele) {
    return $ele.closest('td');
}
```
         
### protipElement($ele)
获取提示元素

```js
//默认:
protipElement: function ($ele) {
    if ($ele.is('select.jxchosen,select.jxselect2')) {
        return $ele.next();
    }
    return $ele;
}
```

## 表单方法

使用方法
```js
$('form').jxform('方法名称', arg1, arg2);
$('form').jxform().submit();
```

### serialize()
序列化表单值
eg:name=张三&idnum=610112&note=xx
 
### reset()
重置表单
 
### clear()
清空表单

### submit()
提交表单

## 表单事件

### beforesubmit
表单`验证通过之后`、`提交之前`执行,`return false` 可以阻止表单提交

### aftersubmit
表单提交成功,服务端成功响应后执行

### errorsubmit
表单提交失败后执行

```js
jx.ready(function () {
    $("form").on("beforesubmit", function () {
        console.log(jx.serialize($(this)));
        return false;//阻止表单提交
    }).on("aftersubmit", function (e, result) {
        if (result.success) {
            window.location.href = "grid.html";
        }
        else {
            jx.alert(result.message);
        }
    });
});
```

## `jquery-validation`原生验证方法

用法:
```js
var $form = $('form');
$form.validate();
$form.valid()
$form.rules()
```

### validate() – Validates the selected form.
### valid() – Checks whether the selected form or selected elements are valid.
### rules() – Read, add and remove rules for an element.

用法:
```js
var $form = $('form');
var validator = $form.validate();
validator.form();
validator.element();
validator.resetForm();
validator.showErrors();
validator.numberOfInvalids();
validator.destroy();
```

### Validator.form() – Validates the form.
### Validator.element() – Validates a single element.
### Validator.resetForm() – Resets the controlled form.
### Validator.showErrors() – Show the specified messages.
### Validator.numberOfInvalids() – Returns the number of invalid fields.
### Validator.destroy() – Destroys this instance of validator.

用法:
```js
jQuery.addMethod();
jQuery.format();
jQuery.validator.setDefaults();
jQuery.addClassRules();
```

### jQuery.validator.addMethod() – Add a custom validation method.
### jQuery.validator.format() – Replaces {n} placeholders with arguments.
### jQuery.validator.setDefaults() – Modify default settings for validation.
### jQuery.validator.addClassRules() – Add a compound class method.