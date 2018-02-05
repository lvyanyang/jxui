/**
 * 颜色组件
 */
jx.plugin({
    name: 'jxcolor',
    instance: function ($ele, ops) {
        return function ($e, o) {
            $e.minicolors(o);
            return {};
        }($ele, ops);
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
        return $.extend(ops, jx.parseOptions($ele));
    },
    onBeforeInit: function (e) {  //注册依赖
        if (document.querySelector('.jxcolor')) {
            jx.depend('minicolor');
        }
    },
    onInit: function (e) { //实例化
        $(e.target).find('.jxcolor').jxcolor();
    }
});