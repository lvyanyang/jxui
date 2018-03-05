/**
 * 布局组件
 */
jx.ui.Layout = function (element, options) {
    var $element = $(element);

    var init = function () {
        $element.layout(options);
    }();

    return {
        monitor:function (region, name) {
            jx.monitorLayoutPanel($element, region, name);
        },
        resize:function(param){
            return $element.layout('resize',param);
        },
        panel:function(region){
            return $element.layout('panel',region);
        },
        collapse:function(region){
            return $element.layout('collapse',region);
        },
        expand:function(region){
            return $element.layout('expand',region);
        },
        add:function(options){
            return $element.layout('add',options);
        },
        remove:function(region){
            return $element.layout('remove',region);
        },
        split:function(region){
            return $element.layout('split',region);
        },
        unsplit:function(region){
            return $element.layout('unsplit',region);
        }
    };
};

jx.plugin({
    name: 'jxlayout',
    create: jx.ui.Layout
});