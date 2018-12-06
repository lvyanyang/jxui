/**
 * 文件组件
 */
jx.plugin({
    name: 'jxupload',
    depend: 'fileinput',
    create: function (element, options) {
        var ops = {
            language: 'zh',
            showCaption: true,
            showRemove: false,
            showUpload: false,
            showPreview: false,
            showClose: false,
            uploadAsync: false,
            theme: 'fa'
        };
        $(element).fileinput($.extend({}, ops, options));
    }
});