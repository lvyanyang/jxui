# 时间控件

时间控件扩展自控件[`ClockPicker`](https://github.com/weareoutman/clockpicker)。

!> [示例](demo/form/time.html)

![Screenshot](http://weareoutman.github.io/clockpicker/assets/images/screenshot-1.png)
![clockpicker-12-hour-screenshot](https://cloud.githubusercontent.com/assets/5218249/3613434/03da9888-0db8-11e4-8bdb-dbabb5e91e5c.png)

## 使用方法

使用类`jxclock`标记的组件会自动引用依赖并初始化
```html
<!--组件模式-->
 <div class="input-group jxclock">
    <input class="form-control" name="atime1">
    <span class="input-group-addon"><span class="fa fa-clock-o"></span></span>
</div>

<!--文本框模式-->
<input class="form-control jxclock" name="atime2">
```

## 属性

使用方法

- `data-options` 方式
```html
<div class="input-group jxclock" data-options="{ donetext: '选好了' }">
    <input class="form-control" name="atime1"
           data-validate="{required: [true,'请输入时间1']}">
    <span class="input-group-addon">
            <span class="fa fa-clock-o"></span>
    </span>
</div>
```

- `options`方式
```js
$('.jxtime').options({
    donetext: 'OK',
    init: function () {
        console.log("colorpicker initiated");
    },
    beforeShow: function () {
        console.log("before show");
    },
    afterShow: function () {
        console.log("after show");
    },
    beforeHide: function () {
        console.log("before hide");
    },
    afterHide: function () {
        console.log("after hide");
    },
    beforeHourSelect: function () {
        console.log("before hour selected");
    },
    afterHourSelect: function () {
        console.log("after hour selected");
    },
    beforeDone: function () {
        console.log("before done");
    },
    afterDone: function () {
        console.log("after done");
    }
});
```


| Name | Default | Description |
| :---- | :------- | :----------- |
| default | '' | default time, 'now' or '13:14' e.g. |
| placement | 'bottom' | popover placement |
| align | 'left' | popover arrow align |
| donetext | '完成' | done button text |
| autoclose | false | auto close when minute is selected |
| twelvehour | false | enables twelve hour mode with AM & PM buttons |
| vibrate | true | vibrate the device when dragging clock hand |
| fromnow | 0 | set default time to * milliseconds from now (using with default = 'now') |
| init | | callback function triggered after the colorpicker has been initiated |
| beforeShow | | callback function triggered before popup is shown |
| afterShow | | callback function triggered after popup is shown |
| beforeHide | | callback function triggered before popup is hidden Note:will be triggered between a beforeDone and afterDone |
| afterHide | | callback function triggered after popup is hidden Note:will be triggered between a beforeDone and afterDone |
| beforeHourSelect | | callback function triggered before user makes an hour selection |
| afterHourSelect | | callback function triggered after user makes an hour selection |
| beforeDone | | callback function triggered before time is written to input |
| afterDone | | callback function triggered after time is written to input |

## 方法

使用方法
```js
$('.jxtime').jxclock('show');
$('.jxtime').jxclock('toggleView', 'minutes');
```

| operation | Arguments | Description |
| --------- | --------- | ----------- |
| show |   | show the clockpicker |
| hide |   | hide the clockpicker |
| remove |   | remove the clockpicker (and event listeners) |
| toggleView | 'hours' or 'minutes' | toggle to hours or minutes view |
