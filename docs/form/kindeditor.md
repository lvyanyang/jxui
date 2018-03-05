# 富文本编辑器

富文本编辑器扩展自控件[`kindeditor`](https://github.com/kindsoft/kindeditor)

[官方演示地址](http://kindeditor.net/demo.php)

[官方文档地址](http://kindeditor.net/doc.php)

!> [示例](demo/form/editor.html)

## 使用方法

使用类`jxkindeditor`标记的组件会自动引用依赖并初始化
```html
<textarea name="htmlContent" class="form-control jxkindeditor" style="height:150px;"
    data-validate="required: [true,'请输入Html内容']">
</textarea>
```

## 选项

###  width

编辑器的宽度，可以设置px或%，比textarea输入框样式表宽度优先度高。

- 数据类型: String
- 默认值: textarea输入框的宽度

示例:

```
K.create('#id', {
        width : '700px'
});

```

###  height

编辑器的高度，只能设置px，比textarea输入框样式表高度优先度高。

- 数据类型: String
- 默认值: textarea输入框的高度

###  minWidth

指定编辑器最小宽度，单位为px。

- 数据类型: Int
- 默认值: 650

###  minHeight

指定编辑器最小高度，单位为px。

- 数据类型: Int
- 默认值: 100

###  items

配置编辑器的工具栏，其中”/”表示换行，”|”表示分隔符。

- 数据类型: Array
- 默认值:

```
[
        'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
        'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        'anchor', 'link', 'unlink', '|', 'about'
]

```

| source              | HTML代码   |
| ------------------- | -------- |
| preview             | 预览       |
| undo                | 后退       |
| redo                | 前进       |
| cut                 | 剪切       |
| copy                | 复制       |
| paste               | 粘贴       |
| plainpaste          | 粘贴为无格式文本 |
| wordpaste           | 从Word粘贴  |
| selectall           | 全选       |
| justifyleft         | 左对齐      |
| justifycenter       | 居中       |
| justifyright        | 右对齐      |
| justifyfull         | 两端对齐     |
| insertorderedlist   | 编号       |
| insertunorderedlist | 项目符号     |
| indent              | 增加缩进     |
| outdent             | 减少缩进     |
| subscript           | 下标       |
| superscript         | 上标       |
| formatblock         | 段落       |
| fontname            | 字体       |
| fontsize            | 文字大小     |
| forecolor           | 文字颜色     |
| hilitecolor         | 文字背景     |
| bold                | 粗体       |
| italic              | 斜体       |
| underline           | 下划线      |
| strikethrough       | 删除线      |
| removeformat        | 删除格式     |
| image               | 图片       |
| flash               | Flash    |
| media               | 视音频      |
| table               | 表格       |
| hr                  | 插入横线     |
| emoticons           | 插入表情     |
| link                | 超级链接     |
| unlink              | 取消超级链接   |
| fullscreen          | 全屏显示     |
| about               | 关于       |
| print               | 打印       |
| code                | 插入程序代码   |
| map                 | Google地图 |
| baidumap            | 百度地图     |
| lineheight          | 行距       |
| clearhtml           | 清理HTML代码 |
| pagebreak           | 插入分页符    |
| quickformat         | 一键排版     |
| insertfile          | 插入文件     |
| template            | 插入模板     |
| anchor              | 插入锚点     |

### noDisableItems

[designMode](http://kindeditor.net/docs/option.html#designmode) 为false时，要保留的工具栏图标。

- 数据类型: Array
- 默认值: [‘source’, ‘fullscreen’]

###  filterMode

true时根据 [htmlTags](http://kindeditor.net/docs/option.html#htmltags) 过滤HTML代码，false时允许输入任何代码。

- 数据类型: Boolean
- 默认值: true

Note

4.1.1版本开始默认值为true。

###  htmlTags

指定要保留的HTML标记和属性。Object的key为HTML标签名，value为HTML属性数组，”.”开始的属性表示style属性。

- 数据类型: Object
- 默认值:

```
{
        font : ['color', 'size', 'face', '.background-color'],
        span : [
                '.color', '.background-color', '.font-size', '.font-family', '.background',
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
        ],
        div : [
                'align', '.border', '.margin', '.padding', '.text-align', '.color',
                '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
                '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
        ],
        table: [
                'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
                '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
                '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
                '.width', '.height', '.border-collapse'
        ],
        'td,th': [
                'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
                '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
                '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
        ],
        a : ['href', 'target', 'name'],
        embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
        img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
        'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
                'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
        ],
        pre : ['class'],
        hr : ['class', '.page-break-after'],
        'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : []
}

```

###  wellFormatMode

true时美化HTML数据。

- 数据类型: Boolean
- 默认值: true

###  resizeType

2或1或0，2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动。

- 数据类型: Int
- 默认值: 2

###  themeType

指定主题风格，可设置”default”、”simple”，指定simple时需要引入simple.css。

- 数据类型: String
- 默认值: “default”

示例:

```
<link rel="stylesheet" href="../themes/default/default.css" />
<link rel="stylesheet" href="../themes/simple/simple.css" />
<script charset="utf-8" src="../kindeditor.js"></script>
<script charset="utf-8" src="../lang/zh-CN.js"></script>
<script>
        var editor;
        KindEditor.ready(function(K) {
                editor = K.create('#editor_id', {
                        themeType : 'simple'
                });
        });
</script>

```

###  langType

指定语言，可设置”en”、”zh-CN”，需要引入lang/[langType].js。

- 数据类型: String
- 默认值: “zh-CN”

示例:

```
<link rel="stylesheet" href="../themes/default/default.css" />
<script charset="utf-8" src="../kindeditor.js"></script>
<script charset="utf-8" src="../lang/en.js"></script>
<script>
        var editor;
        KindEditor.ready(function(K) {
                editor = K.create('#editor_id', {
                        langType : 'en'
                });
        });
</script>

```

###  designMode

可视化模式或代码模式

- 数据类型: Boolean
- 默认值: true

###  fullscreenMode

true时加载编辑器后变成全屏模式。

- 数据类型: Boolean
- 默认值: false

###  basePath

指定编辑器的根目录路径。

- 数据类型: String
- 默认值: 根据kindeditor.js文件名自动获取

###  themesPath

指定编辑器的themes目录路径。

- 数据类型: String
- 默认值: basePath + ‘themes/’

###  pluginsPath

指定编辑器的plugins目录路径。

- 数据类型: String
- 默认值: basePath + ‘plugins/’

###  langPath

指定编辑器的lang目录路径。

- 数据类型: String
- 默认值: basePath + ‘lang/’

###  minChangeSize

undo/redo文字输入最小变化长度，当输入的文字变化小于这个长度时不会添加到undo记录里。

- 数据类型: String
- 默认值: 5

###  urlType

改变站内本地URL，可设置”“、”relative”、”absolute”、”domain”。空为不修改URL，relative为相对路径，absolute为绝对路径，domain为带域名的绝对路径。

- 数据类型: String
- 默认值: “”

###  newlineTag

设置回车换行标签，可设置”p”、”br”。

- 数据类型: String
- 默认值: “p”

###  pasteType

设置粘贴类型，0:禁止粘贴, 1:纯文本粘贴, 2:HTML粘贴

- 数据类型: Int
- 默认值: 2

###  dialogAlignType

设置弹出框(dialog)的对齐类型，可设置”“、”page”，指定page时按当前页面居中，指定空时按编辑器居中。

- 数据类型: String
- 默认值: “page”

###  shadowMode

true时弹出层(dialog)显示阴影。

- 数据类型: Boolean
- 默认值: true

###  zIndex

指定弹出层的基准z-index。

- 数据类型: Int
- 默认值: 811213

###  useContextmenu

true时使用右键菜单，false时屏蔽右键菜单。

- 数据类型: Boolean
- 默认值: true

###  syncType

同步数据的方式，可设置”“、”form”，值为form时提交form时自动同步，空时不会自动同步。

- 数据类型: String
- 默认值: “form”

###  indentChar

[wellFormatMode](#wellformatmode) 为true时，HTML代码缩进字符。

- 数据类型: String
- 默认值: “\t”

###  cssPath

指定编辑器iframe document的CSS文件，用于设置可视化区域的样式。

- 数据类型: String或Array
- 默认值: 空

###  cssData

指定编辑器iframe document的CSS数据，用于设置可视化区域的样式。

- 数据类型: String
- 默认值: 空

###  bodyClass

指定编辑器iframe document body的className。

- 数据类型: String
- 默认值: “ke-content”

###  colorTable

指定取色器里的颜色。

- 数据类型: Array
- 默认值:

```
[
        ['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
        ['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
        ['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
        ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
]

```

###  afterCreate

设置编辑器创建后执行的回调函数。

- 数据类型: Function
- 默认值: 无

###  afterChange

编辑器内容发生变化后执行的回调函数。

- 数据类型: Function
- 默认值: 无

###  afterTab

按下TAB键后执行的的回调函数。

- 数据类型: Function
- 默认值: 插入4个空格的函数

###  afterFocus

编辑器聚焦(focus)时执行的回调函数。

- 数据类型: Function
- 默认值: 无

###  afterBlur

编辑器失去焦点(blur)时执行的回调函数。

- 数据类型: Function
- 默认值: 无

###  afterUpload

上传文件后执行的回调函数。

- 数据类型: Function
- 默认值: 无

```
KindEditor.ready(function(K) {
        K.create('#id', {
                afterUpload : function(url) {
                        alert(url);
                }
        });
});

```

###  uploadJson

指定上传文件的服务器端程序。

- 数据类型: String
- 默认值: basePath + ‘php/upload_json.php’

###  fileManagerJson

指定浏览远程图片的服务器端程序。

- 数据类型: String
- 默认值: basePath + ‘php/file_manager_json.php’

###  allowPreviewEmoticons

true时鼠标放在表情上可以预览表情。

- 数据类型: Boolean
- 默认值: true

###  allowImageUpload

true时显示图片上传按钮。

- 数据类型: Boolean
- 默认值: true

###  allowFlashUpload

true时显示Flash上传按钮。

- 数据类型: Boolean
- 默认值: true

###  allowMediaUpload

true时显示视音频上传按钮。

- 数据类型: Boolean
- 默认值: true

###  allowFileUpload

true时显示文件上传按钮。

- 数据类型: Boolean
- 默认值: true

Note

4.0.6版本开始支持。

###  allowFileManager

true时显示浏览远程服务器按钮。

- 数据类型: Boolean
- 默认值: false

###  fontSizeTable

指定文字大小。

- 数据类型: Array
- 默认值:

```
['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px']

```

###  imageTabIndex

图片弹出层的默认显示标签索引。

- 数据类型: Int
- 默认值: 0

Note

4.0.6版本开始支持。

###  formatUploadUrl

false时不会自动格式化上传后的URL。

- 数据类型: Boolean
- 默认值: true

Note

4.1版本开始支持。

###  fullscreenShortcut

false时禁用ESC全屏快捷键。

- 数据类型: Boolean
- 默认值: false

Note

4.1版本开始支持，从4.1.2版本开始默认值为false。

###  extraFileUploadParams

上传图片、Flash、视音频、文件时，支持添加别的参数一并传到服务器。

- 数据类型: Array
- 默认值: {}

```
KindEditor.ready(function(K) {
        K.create('#id', {
                extraFileUploadParams : {
                        item_id : 1000,
                        category_id : 1
                }
        });
});

```

Note

4.1.1版本开始支持。

###  filePostName

指定上传文件form名称。

- 数据类型: String
- 默认值: imgFile

Note

4.1.2版本开始支持。

###  fillDescAfterUploadImage

true时图片上传成功后切换到图片编辑标签，false时插入图片后关闭弹出框。

- 数据类型: Boolean
- 默认值: false

Note

4.1.2版本开始支持。

###  afterSelectFile

从图片空间选择文件后执行的回调函数。

- 数据类型: Function
- 默认值: 无

Note

4.1.2版本开始支持。

###  pagebreakHtml

可指定分页符HTML。

- 数据类型: String
- 默认值: <hr style=”page-break-after: always;” class=”ke-pagebreak” />

Note

4.1.3版本开始支持。

###  allowImageRemote

true时显示网络图片标签，false时不显示。

- 数据类型: Boolean
- 默认值: true

Note

4.1.6版本开始支持。

###  autoHeightMode

值为true，并引入autoheight.js插件时自动调整高度。

- 数据类型: Boolean
- 默认值: false

Note

4.1.8版本开始支持。

###  fixToolBar

值为true，并引入fixtoolbar.js插件时固定工具栏位置。

- 数据类型: Boolean
- 默认值: false


## 方法

### K.create(expr [, options\])

创建编辑器，返回第一个KEditor对象。4.1版本开始expr支持多个textarea，之前版本只在第一个textarea上创建。

创建编辑器后可以用 KindEditor.instances 数组取得已创建的所有KEditor对象。

- - 参数:

    mixed expr: element或选择器object options: [编辑器初始化参数](http://kindeditor.net/docs/option.html)

- 返回: KEditor

示例:

```
// 1
// editor 等于 KindEditor.instances[0]
editor = K.create('textarea[name="content"]');
editor.html('HTML code');

// 2
editor = K.create('#editor_id', {
        filterMode : true,
        langType : 'en'
});

```

Note

4.1.2版本开始expr可以直接传入jQuery对象。

### K.remove(expr)

移除多个编辑器。

- - 参数:

    mixed expr: element或选择器

- 返回: undefined

示例:

```
// 移除ID为editor_id的编辑器
K.remove('#editor_id');

// 移除class为editor-class的编辑器
K.remove('.editor-class');

```

Note

4.1.2版本开始支持。

### K.sync(expr)

将多个编辑器的内容设置到原来的textarea控件里。。

- - 参数:

    mixed expr: element或选择器

- 返回: undefined

示例:

```
// 同步ID为editor_id的编辑器
K.sync('#editor_id');

// 同步class为editor的编辑器
K.sync('.editor');

```

Note

4.1.2版本开始支持。

### K.html(expr, val)

设置多个编辑器的HTML内容。

- - 参数:

    mixed expr: element或选择器string val: HTML内容

- 返回: undefined

示例:

```
K.html('#editor_id', '<div>HTML</div>');

```

Note

4.1.8版本开始支持。

### K.appendHtml(expr, val)

将指定的HTML内容添加到多个编辑器的最后位置。

- - 参数:

    mixed expr: element或选择器string val: 内容

- 返回: undefined

示例:

```
K.appendHtml('#editor_id', '<div>HTML</div>');

```

Note

4.1.8版本开始支持。

### K.insertHtml(expr, val)

将指定的HTML内容插入到多个编辑器的光标处。

- - 参数:

    mixed expr: element或选择器string val: 内容

- 返回: undefined

示例:

```
K.insertHtml('#editor_id', '<strong>HTML</strong>');

```

Note

4.1.8版本开始支持。

### remove()

移除编辑器。

- 参数: 无
- 返回: KEditor

示例:

```
editor.remove();

```

### html()

取得编辑器的HTML内容。

- 参数: 无
- 返回: string

示例:

```
var html = editor.html();

```

### html(val)

设置编辑器的HTML内容。

- - 参数:

    string val: HTML

- 返回: KEditor

示例:

```
editor.html('<strong>HTML</strong> code');

```

### fullHtml()

取得完整的HTML内容，HTML包含<html>标签。

- 参数: 无
- 返回: string

示例:

```
var fullHtml = editor.fullHtml();

```

### text()

取得编辑器的纯文本内容。(包含img和embed)

- 参数: 无
- 返回: string

示例:

```
var text = editor.text();

```

### text(val)

设置编辑器的内容，直接显示HTML代码。

- - 参数:

    string val: 文本

- 返回: KEditor

示例:

```
editor.text('<strong>HTML</strong> code');

```

### selectedHtml()

取得当前被选中的HTML内容。

- 参数: 无
- 返回: string

示例:

```
var html = editor.selectedHtml();

```

### count([mode\])

取得当前被选中的HTML内容。

- - 参数:

    string mode: 可选参数，默认值为”html”，mode为”html”时取得字数包含HTML代码，mode为”text”时只包含纯文本、IMG、EMBED。

- 返回: Int

示例:

```
htmlCount = editor.count();
textCount = editor.count('text');

```

### isEmpty()

判断编辑器是否有可见内容，比如文本、图片、视频。

- 参数: 无
- 返回: Boolean

示例:

```
if (editor.isEmpty()) {
        alert('请输入内容。');
}

```

### insertHtml(val)

将指定的HTML内容插入到编辑区域里的光标处。

- - 参数:

    string val: HTML

- 返回: KEditor

示例:

```
editor.insertHtml('<strong>HTML</strong> code');

```

### appendHtml(val)

将指定的HTML内容添加到编辑区域的最后位置。

- - 参数:

    string val: HTML

- 返回: KEditor

示例:

```
editor.appendHtml('<strong>HTML</strong> code');

```

### focus()

编辑器聚焦。

- 参数: 无
- 返回: KEditor

示例:

```
editor.focus();

```

### blur()

编辑器失去焦点。

- 参数: 无
- 返回: KEditor

示例:

```
editor.blur();

```

### sync()

将编辑器的内容设置到原来的textarea控件里。

- 参数: 无
- 返回: KEditor

示例:

```
editor.sync();

```

### exec(commandName)

执行编辑命令，替代document.execCommmand接口。

- - 参数:

    string commandName: 命令名

- 返回: KEditor

目前可用的命令:

| commandName         | 描述               | 示例                                       |
| ------------------- | ---------------- | ---------------------------------------- |
| bold                | 粗体               | editor.exec(‘bold’);                     |
| italic              | 斜体               | editor.exec(‘italic’);                   |
| underline           | 下划线              | editor.exec(‘underline’);                |
| strikethrough       | 删除线              | editor.exec(‘strikethrough’);            |
| forecolor           | 文字颜色             | editor.exec(‘forecolor’, ‘#333’);        |
| hilitecolor         | 文字背景             | editor.exec(‘hilitecolor’, ‘#eee’);      |
| fontsize            | 文字大小             | editor.exec(‘fontsize’, ‘14px’);         |
| fontfamily          | 字体               | editor.exec(‘fontfamily’, ‘SimHei’);     |
| fontname            | 字体，fontfamily的别名 | editor.exec(‘fontname’, ‘SimHei’);       |
| removeformat        | 删除inline样式       | editor.exec(‘removeformat’);             |
| inserthtml          | 插入HTML           | editor.exec(‘inserthtml’, ‘<strong>HTML</strong>’); |
| hr                  | 插入水平线            | editor.exec(‘hr’);                       |
| print               | 弹出打印窗口           | editor.exec(‘print’);                    |
| insertimage         | 插入图片             | editor.exec(‘insertimage’, ‘1.jpg’, ‘title’, 200, 100, 1, ‘right’); |
| createlink          | 超级链接             | editor.exec(‘createlink’, ‘1.html’, ‘_blank’); |
| unlink              | 取消超级链接           | editor.exec(‘unlink’);                   |
| formatblock         | 段落               | editor.exec(‘formatblock’, `‘<h1>’`);      |
| selectall           | 全选               | editor.exec(‘selectall’);                |
| justifyleft         | 左对齐              | editor.exec(‘justifyleft’);              |
| justifycenter       | 居中               | editor.exec(‘justifycenter’);            |
| justifyright        | 右对齐              | editor.exec(‘justifyright’);             |
| justifyfull         | 两端对齐             | editor.exec(‘justifyfull’);              |
| insertorderedlist   | 编号               | editor.exec(‘insertorderedlist’);        |
| insertunorderedlist | 项目符号             | editor.exec(‘insertunorderedlist’);      |
| indent              | 增加缩进             | editor.exec(‘indent’);                   |
| outdent             | 减少缩进             | editor.exec(‘outdent’);                  |
| subscript           | 下标               | editor.exec(‘subscript’);                |
| superscript         | 上标               | editor.exec(‘superscript’);              |
| cut                 | 剪切               | editor.exec(‘cut’);                      |
| copy                | 复制               | editor.exec(‘copy’);                     |
| paste               | 粘贴               | editor.exec(‘paste’);                    |

### lang(name)

取得语言。

- - 参数:

    string name: language key

- 返回: string

示例:

```
str = editor.lang('table'); // return '表格'

```

### loadPlugin(name , fn)

动态加载插件。

- - 参数:

    string name: 插件名function fn: 加载成功后执行的回调函数

- 返回: KEditor

示例:

```
editor.loadPlugin('table', function() {
        alert('加载成功。');
});

```

### clickToolbar(name)

执行绑定在工具栏上的点击事件函数。

- - 参数:

    string name: item name

- 返回: KEditor

示例:

```
editor.clickToolbar('bold'); // 对选中文本进行加粗

```

### clickToolbar(name [, fn\])

绑定工具栏的点击事件函数。

- - 参数:

    string name: item namefunction fn: 点击工具栏时执行的回调函数。

- 返回: fn的return value

示例:

```
editor.clickToolbar('bold', function() {
        editor.exec('bold');
});

```

### addBookmark()

将当前数据添加到undo/redo记录里。

- 参数: 无
- 返回: KEditor

示例:

```
editor.addBookmark();

```

### undo()

后退。

- 参数: 无
- 返回: KEditor

示例:

```
editor.undo();

```

### redo()

撤销后退。(前进)

- 参数: 无
- 返回: KEditor

示例:

```
editor.redo();

```

### fullscreen([bool\])

切换全屏模式。

- - 参数:

    Boolean bool: 默认切换(toggle)全屏模式，false时取消全屏，true时变成全屏。

- 返回: KEditor

示例:

```
editor.fullscreen();

```

### readonly(isReadonly)

设置成只读状态，或取消只读状态。

- - 参数:

    Boolean isReadonly: false时取消只读状态，true时设置成只读状态。

- 返回: KEditor

示例:

```
editor.readonly(false);

```

### createMenu(options)

显示下拉菜单。

- - 参数:

    object options: 初始化参数

- 返回: KMenu ( [下拉菜单(Menu) API](http://kindeditor.net/docs/menu.html) )

示例:

```
var menu = editor.createMenu({
        name : 'example1',
        width : 150
});
menu.addItem({
        title : '红色',
        click : function() {
                alert('red');
        }
});
menu.addItem({
        title : '白色',
        click : function() {
                alert('white');
        }
});

```

### hideMenu()

隐藏下拉菜单。

- 参数: 无
- 返回: KEditor

示例:

```
editor.hideMenu();

```

### addContextmenu(item)

添加自定义右键菜单。

- - 参数:

    object item: 请参考 KMenu.addItem(item)的item参数

- 返回: KEditor

示例:

```
editor.addContextmenu({
        title : 'test',
        click : function() {
                alert('clicked');
        },
        cond : true,
        width : 150,
});
// 插入分割线
editor.addContextmenu({ title : '-' });

```

### hideContextmenu()

隐藏自定义右键菜单。

- 参数: 无
- 返回: KEditor

示例:

```
editor.hideContextmenu();

```

### createDialog(options)

显示弹出窗口(dialog)。

- - 参数:

    object options: 初始化参数

- 返回: KDialog ( [弹出窗口(Dialog) API](http://kindeditor.net/docs/dialog.html) )

示例:

```
var dialog = editor.createDialog({
        name : 'about',
        width : 300,
        title : self.lang('about'),
        body : '<div style="margin:20px;">Hello</div>'
});

```

### hideDialog()

隐藏弹出窗口(dialog)。

- 参数: 无
- 返回: KMenu

示例:

```
editor.hideDialog();
```

