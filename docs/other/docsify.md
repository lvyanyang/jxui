# 文档编写

docsify 是一个动态生成文档网站的工具。不同于 GitBook、Hexo 的地方是它不会生成将 `.md` 转成 `.html` 文件，所有转换工作都是在运行时进行。

这将非常实用，如果只是需要快速的搭建一个小型的文档网站，或者不想因为生成的一堆 `.html` 文件“污染” commit 记录，只需要创建一个 `index.html` 就可以开始写文档而且直接[部署在 GitHub Pages](https://docsify.js.org/#/zh-cn/deploy)。

查看[快速开始](https://docsify.js.org/#/zh-cn/quickstart)了解详情。

文档编写工具使用[`docsify`](https://github.com/QingWei-Li/docsify/)

[官方使用说明](https://docsify.js.org/#/zh-cn/)

## 1.创建`index.html`

此页面是文档入口.

```html
<!DOCTYPE html>
<html>
<head>
    <title>西交投前端框架</title>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit">
    <meta name="force-rendering" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="西交投前端框架">
    <meta name="description" content="西交投前端框架">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="//124.115.168.58:1000/cdn/jx/1.0.0/doc.css">
</head>
<body>
<div id="app">正在加载...</div>
<script>
    window.$docsify = {
        name: '西交投前端框架',
        auto2top: true,
        executeScript: true,
        loadSidebar: true,
        maxLevel: 4,
        subMaxLevel: 2,
        search: {
            maxAge: 86400000,
            paths: [],
            depth: 1
        },
        markdown: {
            smartypants: true,
            breaks:true
        },
        noCompileLinks: [
            '../demo/.*'
        ]
    };
</script>
<script src="//124.115.168.58:1000/cdn/jx/1.0.0/doc.js"></script>
</body>
</html>
```

## 2.创建说明文档`readme.md`

编写文档总体介绍文档

## 3.创建左边导航栏`_sidebar.md`

列出文档目录结构

```markdown
- 入门
    - [快速开始](quick-start.md)
- 进阶
    - [核心库](jx-core.md)
    - [Dialog控件](jx-dialog.md)
- 控件
    - [日期控件](jx-date.md)
    - [时间控件](jx-time.md)
    - [日期时间控件](jx-datetime.md)
- 拓展
    - [构建工具](jx-fis3.md)
    - [文档编写](jx-docsify.md)
```

## 4.根据文档结构,编写对应的markdown文档

```markdown
# 快速开始

如果快速开始...
 
```

## 5.直接将文档目录复制到服务器,使用`nginx`直接部署即可.