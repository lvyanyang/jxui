# tabs（标签页)

Tabs控件扩展自[`Bootstrap Tabs`](https://getbootstrap.com/docs/3.3/javascript/#tabs)

!> [演示](demo/basic/tabs.html)

|   线型标签页  | 卡片标签页    |
|----------------------------------|-----------------------------------|
|  ![](./img/jx-tabs/fff8198e.png) |  ![](./img/jx-tabs/a5b125b9.png)  |
| 使用`jxtabs-line`类标记 | 使用`jxtabs-custom`类标记  |

!> 线型标签页使用`jxtabs-line`类标记，卡片标签页使用`jxtabs-custom`类标记。标签页标题如果要放到底部，添加`tabs-below`类标记，同时`tab-content`和`nav nav-tabs`调整上下位置。
标签颜色分为：`默认颜色`、`line-primary`、`line-success`、`line-warning`、`line-info`、`line-danger` 使用时加到`jxtabs-line`类后面。

## 标记
```html
<div class="jxtabs-line">
    <ul class="nav nav-tabs">
        <li class="active">
            <a id="basic" href="#tab_1_1" data-toggle="tab"> 基本信息 </a>
        </li>
        <li>
            <a id="extend" href="#tab_1_2" data-toggle="tab"> 扩展资料 </a>
        </li>
        <li>
            <a id="other" href="#tab_1_3" data-toggle="tab"> 其他信息 </a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab_1_1">
            标签1
        </div>
        <div class="tab-pane fade" id="tab_1_2">
            标签2
        </div>
        <div class="tab-pane fade" id="tab_1_3">
            标签3
        </div>
    </div>
</div>
```

## 动画
标签页切换动画，需要在`.tab-pane`上添加`.fade`，第一个激活的标签页还需要增加`.in`。
```html
<div class="tab-content">
  <div role="tabpanel" class="tab-pane fade in active" id="home">...</div>
  <div role="tabpanel" class="tab-pane fade" id="profile">...</div>
  <div role="tabpanel" class="tab-pane fade" id="messages">...</div>
  <div role="tabpanel" class="tab-pane fade" id="settings">...</div>
</div>
```

## 标签页方法
- show - 手动显示指定的标签页

```js
//标签页id
$('#other').tab('show');
```

## 标签页事件

- show.bs.tab - 在标签页显示之前触发

- shown.bs.tab - 在标签页显示之后触发

- hide.bs.tab - 在标签页隐藏之前触发

- hidden.bs.tab - 在标签页隐藏之后触发

* 标签页事件对象

    `e.target` 新激活的标签页
    `e.relatedTarget` 前一个标签页

```js
//从当前标签页切换到另一个标签页的执行顺序如下：
$('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
    console.log('hide.bs.tab'+this.hash);//当前标签页隐藏之前
}).on('show.bs.tab', function (e) {
    console.log('show.bs.tab'+this.hash);//另一个标签页显示之前
}).on('hidden.bs.tab', function (e) {
    console.log('hidden.bs.tab'+this.hash);//当前标签页隐藏之后
}).on('shown.bs.tab', function (e) {
    console.log('shown.bs.tab'+this.hash);//另一个标签页显示之后
});
```

## 自定义标签颜色

```css
/*region 自定义标签颜色名称：line-primary 自定义颜色：#337ab7 */

.jxtabs-line.line-primary > .nav-tabs > li.active,
.jxtabs-custom.tabs-below.line-primary > .nav-tabs > li.active{
    border-bottom-color: #337ab7;
}
.jxtabs-line.tabs-below.line-primary > .nav-tabs > li.active,
.jxtabs-custom.line-primary > .nav-tabs > li.active {
    border-top-color: #337ab7;
}

.jxtabs-line.line-primary > .nav-tabs > li.active > a,
.jxtabs-line.tabs-below.line-primary > .nav-tabs > li.active > a,
.jxtabs-custom.line-primary > .nav-tabs > li.active > a,
.jxtabs-custom.tabs-below.line-primary > .nav-tabs > li.active > a{
    color: #337ab7;
}

.jxtabs-line.line-primary > .nav-tabs > li.open,
.jxtabs-line.line-primary > .nav-tabs > li:hover {
    border-bottom-color: #337ab7;
}
.jxtabs-line.tabs-below.line-primary > .nav-tabs > li:hover {
    border-top-color: #337ab7;
}

.jxtabs-line.line-primary > .nav-tabs > li.open > a,
.jxtabs-line.line-primary > .nav-tabs > li:hover > a,
.jxtabs-line.tabs-below.line-primary > .nav-tabs > li:hover > a {
    color: #337ab7;
}
/*endregion*/
```