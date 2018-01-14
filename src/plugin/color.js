/**
 * 颜色组件
 */

(function ($) {

    //实现类
    var Color = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        $element.minicolors(options);

    };

    //插件定义
    jx.plugin({
        name: 'jxcolor',
        instance: function ($ele, ops) {
            return Color($ele, ops);
        },
        options: function ($ele) {
            var ops = {
                control: $ele.attr('data-control') || 'hue',
                defaultValue: $ele.attr('data-defaultValue') || '',
                format: $ele.attr('data-format') || 'hex',
                keywords: $ele.attr('data-keywords') || '',
                inline: $ele.attr('data-inline') === 'true',
                letterCase: $ele.attr('data-letterCase') || 'lowercase',
                opacity: $ele.attr('data-opacity'),
                position: $ele.attr('data-position') || 'bottom left',
                swatches: $ele.attr('data-swatches') ? $ele.attr('data-swatches').split('|') : [],
                theme: 'bootstrap'
            };
            return $.extend(ops,jx.parseOptions($ele));
        }
    });

    //注册依赖
    jx.onBeforeInit(function (e) {
        if (document.querySelector('.jxcolor')) {
            jx.depend('minicolor');
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxcolor').jxcolor();
    });

}(jQuery));
