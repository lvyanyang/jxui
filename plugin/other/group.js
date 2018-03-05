/**
 * 界面章节控件
 */

/**
 * 界面章节控件实现类
 */
jx.ui.Group = function (element, options) {
    var $element = $(element);

    //私有函数

    var _render = function (status) {
        var $target = options.target;
        if (status === true) {
            $element.html('<i class="fa fa-chevron-down"></i>&nbsp;' + options.text);
            $target.hide();
            $element.data('status', false);
            $element.triggerHandler('hide');
        } else {
            $element.html('<i class="fa fa-chevron-up"></i>&nbsp;' + options.text);
            $target.show();
            $element.data('status', true);
            $element.triggerHandler('show');
        }
    };

    //初始化
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
    }();

    //公共函数
    return {};
};

//定义插件
jx.plugin({
    name: 'jxgroup',
    create: jx.ui.Group,
    options: function (element) {
        return jx.parseOptions($(element), ['text', {target: 'jquery'}, {status: 'boolean'}]);
    },
    defaults: {
        text: null,
        target: null,
        status: true
    }
});
