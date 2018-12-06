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
                afterCreate.call(this);
            }
        };

        // KindEditor.ready(function (K) {
            editor = KindEditor.create($element, options);
        // });
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
        htmlTags : {
            code : [],
            font : ['id', 'class', 'color', 'size', 'face', '.background-color'],
            span : [
                'id', 'class', '.color', '.background-color', '.font-size', '.font-family', '.background',
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
            ],
            div : [
                'id', 'class', 'align', '.border', '.margin', '.padding', '.text-align', '.color',
                '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
                '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
            ],
            table: [
                'id', 'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
                '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
                '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
                '.width', '.height', '.border-collapse'
            ],
            'td,th': [
                'id', 'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
                '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
                '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
            ],
            a : ['id', 'class', 'href', 'target', 'name'],
            embed : ['id', 'class', 'src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', 'wmode'],
            img : ['id', 'class', 'src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
            'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
                'id', 'class', 'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
            ],
            pre : ['id', 'class'],
            hr : ['id', 'class', '.page-break-after'],
            'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : ['id', 'class'],
            iframe : ['id', 'class', 'src', 'frameborder', 'width', 'height', '.width', '.height']
        },
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