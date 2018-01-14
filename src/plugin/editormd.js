/**
 * Markdown编辑器组件
 */

(function ($) {

    //插件类
    var MarkdownEditor = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        var editor;

        var init = function () {
            var id = $element.attr('id');
            if (!id) {
                id = jx.uuid();
                $element.attr('id', id);
            }

            if (!options.path) {
                options.path = jx.basePath + 'editormd/lib/';
            }
            var onload = options.onload;
            options.onload = function () {
                var self = this;
                self.cm.on('focus', function () {
                    self.editor.addClass('editormd-focus');
                });
                self.cm.on('blur', function () {
                    self.editor.removeClass('editormd-focus');
                });

                if (onload) {
                    onload();
                }
            };

            editor = editormd(id, options);
        };

        init();

        return {
            editor: editor
        };
    };

    //插件定义
    jx.plugin({
        name: 'jxeditormd',
        instance: function ($ele, ops) {
            return MarkdownEditor($ele, ops);
        },
        defaults: {
            placeholder: '',
            autoFocus: false,
            watch: false,
            emoji: true,
            styleActiveLine: false,
            lineNumbers: false,
            width: '100%',
            height: 320,
            syncScrolling: 'single',
            path:''
        }
    });

    //注册依赖
    jx.onBeforeInit(function (e) {
        if (document.querySelector('.jxeditormd')) {
            jx.depend('editormd');
            //调整验证选项回调
            jx.onFormValidateOptionsInit(function (validateOptions) {
                validateOptions.ignore += ':not(.editormd-markdown-textarea)';
            });
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxeditormd').jxeditormd();
    });

}(jQuery));