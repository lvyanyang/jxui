/**
 * 颜色组件
 */
jx.plugin({
    name: 'jxcolor',
    depend: 'minicolor',
    create: function (element, ops) {
        $(element).minicolors(ops);
        return {};
    },
    options: function (element) {
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
        return $.extend(ops, jx.parseOptions($(element)));
    }
});