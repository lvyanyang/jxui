/**
 * ECharts组件
 */

/**
 * ECharts控件实现类
 */
jx.ui.Chart = function (element, options) {
    var $element = $(element);
    var chart;

    //初始化
    var init = function () {
        chart = echarts.init(element);
        chart.setOption(options);
    }();

    //公共函数
    return {
        getOptions: function () {
            return options;
        },
        setOptions: function (ops) {
            chart.setOption(ops);
        },
        getElement: function () {
            return element;
        },
        getChart: function () {
            return chart;
        },
        on: function (ename, callback) {
            chart.on('click', callback);
        }
    };
};

jx.plugin({
    name: 'jxchart',
    depend: 'echarts',
    create: jx.ui.Chart
});