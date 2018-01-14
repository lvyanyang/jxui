/**
 * 链接组件
 */

(function ($) {

    //插件类
    var Link = function ($ele, ops) {
        $ele.on('click', function () {
            jx.stope();
            var $this = $(this);
            var title = $this.attr('title') || $this.data('title');
            var url = $this.attr('href') || $this.data('url');
            top.app.loadPage(url, title);
        });
    };

    //插件定义
    jx.plugin({
        name: 'jxlink',
        instance: function ($ele, ops) {
            return Link($ele, ops);
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxlink').jxlink();
    });

}(jQuery));