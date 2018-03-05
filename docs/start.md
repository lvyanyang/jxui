# 快速开始

## 目录结构

```tree
jxui/
├── font/            --框架使用到的css图标字体文件
├── lib/             --框架引用的第三功能插件
├── jx.css
├── jx.js            --框架核心样式文件、脚本文件，任何使用框架的地方都需要引用
├── doc.css
├── doc.js           --用来编写软件文档的样式文件、脚本文件，只有在编写软件文档的时候才需要引用
└── docs/            --框架文档目录
    └── demo/        --框架demo目录
```

## CDN引入

通过 http://124.115.168.58:1000/cdn/jx/ 可以看到`框架`最新版本的资源，在页面上引入 js 和 css 文件即可开始使用：

```html
<!-- 引入框架核心 -->
<link href="//124.115.168.58:1000/cdn/jx/1.0.0/jx.css" rel="stylesheet">
<script src="//124.115.168.58:1000/cdn/jx/1.0.0/jx.js"></script>
```
可以根据情况选择相应的版本

!> **推荐使用CDN引入的方式进行项目开发**

## 示例

### 空白页面

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8"/>
    <meta name="renderer" content="webkit"/>
    <meta name="force-rendering" content="webkit"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon"/>
    <link href="//124.115.168.58:1000/cdn/jx/1.0.0/jx.css" rel="stylesheet"/>
</head>
<body>
<!--页面内容-->
<script src="//124.115.168.58:1000/cdn/jx/1.0.0/jx.js"></script>
</body>
</html>
```