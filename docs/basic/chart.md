# chart (图表)

图表控件集成封装了[`echarts`](http://echarts.baidu.com/option.html#title)插件。

!> [演示](demo/basic/chart.html)

## 使用方法

```html
<div id="mainChart" class="jxchart"></div>
```

```js
jx.ready(function () {
    var $chart = $('#mainChart');
    var instance = $chart.jxchart({
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            itemStyle: {
                color: 'green'
            },
            data: [5, 20, 36, 10, 10, 20]
        }]
    });
    
    $('#btnRefresh').click(function () {
        //刷新
        $chart.jxchart().setOptions({
            series: [{
                name: '销量',
                type: 'bar',
                itemStyle: {
                    color: 'green'
                },
                data: [15, 30, 46, 20, 20, 40]
            }]
        });
    });

    //事件
    instance.on('click', function (p) {
        jx.msg(p.name);
    });
});
```

## 方法

### getOptions 获取当前配置选项

### setOptions(ops) 设置配置选项
      
### getChart() 获取Chart对象

### on(ename, callback) 设置事件
- ename 事件名称
    鼠标事件包括'click'，'dblclick'，'mousedown'，'mouseup'，'mouseover'，'mouseout'，'globalout'，'contextmenu'
    更多事件，请参考：http://echarts.baidu.com/api.html#events
- callback 回调函数