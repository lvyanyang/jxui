/**
 * Tabs组件
 */
jx.plugin({
    name: 'jxtabs',
    create: function (ele, ops) {
        var $ele = $(ele);
        if (ops.urlnav === true) {
            $ele.find('li').click(function () {
                var url = $(this).data('url') || '';
                if (url) {
                    window.location.href = url;
                }
            });
        }
        //Panel高度自适应组件
        if (ops.fit === true) {
            var $content = $ele.find('.tab-content');
            var top = parseInt($content.css('padding-top'));
            var bottom = parseInt($content.css('padding-bottom'));
            $ele.find('.tab-pane').height($ele.parent().height() - $ele.find('.nav-tabs').height() - top - bottom);
        }
    }
});