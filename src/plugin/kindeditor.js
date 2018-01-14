/**
 * 超文本编辑器组件
 */

(function ($) {

    //插件类
    var KindEditorUI = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};
        var editor;

        var init = function () {
            if (!options.basePath) {
                options.basePath = jx.basePath + 'kindeditor/';
            }
            if (!options.cssPath) {
                options.cssPath = jx.basePath + 'kindeditor/themes/iframe.css';
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
        };

        init();

        return {
            editor: editor
        };
    };

    //插件定义
    jx.plugin({
        name: 'jxkindeditor',
        instance: function ($ele, ops) {
            return KindEditorUI($ele, ops);
        },
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
        }
    });

    //注册依赖
    jx.onBeforeInit(function (e) {
        if (document.querySelector('.jxkindeditor')) {
            jx.depend('kindeditor');
            //调整验证选项回调
            jx.onFormValidateOptionsInit(function (validateOptions) {
                validateOptions.ignore += ':not(.jxkindeditor)';
            });
        }
    });

    //实例化
    jx.onInit(function (e) {
        $(e.target).find('.jxkindeditor').jxkindeditor();
    });

}(jQuery));