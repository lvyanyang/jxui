/**
 * Markdown编辑器组件
 */

//插件类
jx.ui.MdEditor = function (element, options) {
    var $element = $(element);
    var editor;

    var init = function () {
        var id = $element.attr('id');
        if (!id) {
            id = jx.uuid();
            $element.attr('id', id);
        }

        if (!options.path) {
            options.path = jx.libDir + 'editormd/lib/';
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
    }();

    return {
        getOptions: function () {
            return options;
        },
        setOptions: function (ops) {
            $.extend(options, ops);
        },
        getEditor: function () {
            return editor;
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxmdeditor',
    depend:'editormd',
    create: jx.ui.MdEditor,
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
        path: ''
    },
    onLoad:function () {
        $.fn.jxform.defaults.validateOptions.ignore += ':not(.editormd-markdown-textarea)';
    }
});