/**
 * 链接组件
 */

(function ($) {

    jx.ns('JX.UI');
    //插件类
    JX.UI.Link = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        $element.on('click', function () {
            jx.stope();
            var $this = $(this);
            var title = $this.attr('title') || $this.data('title');
            var url = $this.attr('href') || $this.data('url');
            top.app.loadPage(url, title);
        });

        return {};
    };

    //插件定义
    jx.plugin({
        name: 'jxlink',
        instance: function ($ele, ops) {
            return JX.UI.Link($ele, ops);
        },
        onInit:function (e) { //实例化
            $(e.target).find('.jxlink').jxlink();
        }
    });

}(jQuery));