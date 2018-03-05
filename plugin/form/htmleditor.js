/**
 * 超文本编辑器组件
 */

//插件类
jx.ui.HtmlEditor = function (element, options) {
    var $element = $(element);
    var editor;

    var init = function () {
        if (!options.basePath) {
            options.basePath = jx.libDir + 'kindeditor/';
        }
        if (!options.cssPath) {
            options.cssPath = jx.libDir + 'kindeditor/themes/iframe.css';
        }

        var afterCreate = options.afterCreate;
        options.afterCreate = function () {
            if (afterCreate) {
                afterCreate();
            }
        };

        KindEditor.ready(function (K) {
            editor = K.create($element, options);
        });
    }();

    return {
        getOptions: function () {
            return options;
        },
        setOptions: function (ops) {
            $.extend(options, ops);
        },
        getElement: function () {
            return element;
        },
        getEditor: function () {
            return editor;
        }
    };
};

//插件定义
jx.plugin({
    name: 'jxhtmleditor',
    depend:'kindeditor',
    create: jx.ui.HtmlEditor,
    defaults: {
        allowFileManager: true,
        allowPreviewEmoticons: true,
        allowImageUpload: true,
        resizeType: 1,
        width: '100%',
        // height: 320,
        syncType: '',
        themeType: 'simple',
        basePath: '',
        cssPath: '',
        afterFocus: function () {
            this.container.addClass('kindeditor-focus');
        },
        afterBlur: function () {
            this.container.removeClass('kindeditor-focus');
            this.sync();
            var $ele = $(this.srcElement[0]);
            var $form = $ele.closest('.jxform');
            if ($form) {
                $form.validate().element($ele);
            }
            // console.log(this);
        }
    },
    onLoad:function () {
        $.fn.jxform.defaults.validateOptions.ignore += ':not(.jxhtmleditor)';
    }
});