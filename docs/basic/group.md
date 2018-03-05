# group（控件分组)

!> [示例](demo/form/group.html)

## 使用方法

```html
 <div class="jxgroup" data-target="$('#basic')" data-text="基本信息"></div>
 <div id="extend_section" class="jxgroup" data-status="false" data-target="$('#extend')" data-text="扩展信息"></div>
```

## 属性

### text
显示文本，默认:null

### status
初始状态，默认:true；true：展开；false：隐藏

### target
设置显示或者隐藏的目标对象，默认：null；

## 事件

```js
$('#extend_section').on('hide',function () {
    console.log('隐藏');
}).on('show',function () {
    console.log('显示');
});
```

### show
显示后触发

### hide
隐藏后触发

## 方法

```js
//显示和隐藏切换
$('#extend_section').triggerHandler('click');
```