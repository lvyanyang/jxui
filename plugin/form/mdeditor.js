/**
 * Markdown编辑器组件
 */

//插件类
jx.ui.MdEditor = function (element, options) {
    var $element = $(element);
    var editor;

    var doPasteImg = function (editor, uploadUrl) {
        // debugger;
        var file = null;
        if (window.clipboardData) {//ie
            if (clipboardData.files && clipboardData.files.length)//IE11
                file = clipboardData.files[0];
            else if (!clipboardData.getData("text") && !clipboardData.getData("url")) {
                alert("不能粘贴文件或图片,请使用IE11或者Chrome浏览器,或使用上传功能");
                return true;
            }
        } else {
            if (event.clipboardData.items)//chrome
                for (var i = 0; i < event.clipboardData.items.length; i++) {
                    if (event.clipboardData.items[i].kind === "file") {
                        file = event.clipboardData.items[i];
                        break;
                    }
                }
            if (file == null) {
                if (!event.clipboardData.getData("url") && !event.clipboardData.getData("text")) {
                    alert("不能粘贴文件或图片,请使用IE11或者Chrome浏览器,或使用上传功能");
                    return true;
                }
            }
        }
        if (file) {
            //获取File Blob
            //debugger;
            var blb;
            if (file.getAsFile) {//Chrome
                blb = file.getAsFile();
                if(blb==null){
                    return true;
                }
                if (blb.size === 0) {
                    alert("不能获取剪切板中的" + (file.type.indexOf("image/") === 0 ? "图像" : "文件")
                        + "\n如果是从OutLook中复制的,请换其他程序,如Word");
                    return true;
                }
                sendfile(blb, file.type);
            } else {
                var fr = new FileReader();
                if (fr.readAsArrayBuffer) {//ie
                    fr.onloadend = function (evt) {
                        blb = evt.target.result;
                        if(blb==null){
                            return true;
                        }
                        sendfile(blb, file.type);
                    };
                    fr.readAsArrayBuffer(file);
                }
            }

            function sendfile(b, t) {
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                var isImg = t.indexOf("image/") === 0;
                var myBlob = new Blob([b], {"type": t});
                formData.append('imgFile', myBlob, "untitled." + t.split('/')[1]);
                formData.append('dir', isImg ? 'image' : 'file');
                xhr.open('POST', uploadUrl);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var data = xhr.responseText;
                        data = JSON.parse(data);
                        if (data.success === false || data.success === 0) {
                            alert(data.message || data.msg);
                        } else {
                            //新一行的图片显示
                            editor.insertValue("![](" + data.url + ")");
                        }
                    }
                };
                xhr.send(formData);
            }

            return true;
        }
    };

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
                onload.call(this);
            }
        };

        editor = editormd(id, options);

        $element.on('paste', function (e) {
            if (editor.settings.imageUpload === false) return;
            var uploadUrl = editor.settings.imageUploadURL;
            doPasteImg(editor, uploadUrl);
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
    name: 'jxmdeditor',
    depend: 'editormd',
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
        path: '',
        codeFold: true,
        searchReplace: true,
        htmlDecode: 'script,iframe|on*',
        taskList: true,
        flowChart : true,
        sequenceDiagram: true,
        tocm: true,          // Using [TOCM]
        tex: false,           // 开启科学公式 TeX 语言支持，默认关闭
        //previewCodeHighlight : false,  // 关闭预览窗口的代码高亮，默认开启
        imageUpload: true,
        imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp']
    },
    onLoad: function () {
        $.fn.jxform.defaults.validateOptions.ignore += ':not(.editormd-markdown-textarea)';
    }
});