/**
 * 界面章节控件
 */

(function ($) {
    jx.ns('JX.UI');
    /**
     * 界面章节控件实现类
     */
    JX.UI.Section = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        //私有函数
        var init = function () {
            if (!options.target) {
                alert('请指定target属性');
                return;
            }

            $element.addClass('jxsection-container');
            _render(!options.status);

            $element.click(function () {
                var status = !!$(this).data('status');
                _render(status);
            });
        };

        var _render = function (status) {
            var $target = options.target;
            if (status === true) {
                $element.html('<i class="fa fa-chevron-up"></i>&nbsp;' + options.text);
                $target.hide();
                $element.data('status', false);
                $element.triggerHandler('hide');
            } else {
                $element.html('<i class="fa fa-chevron-down"></i>&nbsp;' + options.text);
                $target.show();
                $element.data('status', true);
                $element.triggerHandler('show');
            }
        };

        //初始化
        init();

        //公共函数
        return {};
    };

    //定义插件
    jx.plugin({
        name: 'jxsection',//插件名称
        instance: function ($ele, ops) { //插件实例
            return JX.UI.Section($ele, ops);
        },
        options: function ($ele) {
            return jx.parseOptions($ele, ['text', {target: 'jquery'}, {status: 'boolean'}]);
        },
        defaults: {
            text: null,
            target: null,
            status: true
        },
        onInit: function (e) {//插件实例化
            $(e.target).find('.jxsection').jxsection();
        }
    });

}(jQuery));