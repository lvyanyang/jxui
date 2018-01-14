# 快速开始

## 本地引入

目录结构

```tree
├── demo                --框架demo目录
├── docs                --框架文档目录
├── jx                  --框架核心类库目录
    ├── font            --框架使用到的css图标字体文件
    ├── lib             --框架引用的第三功能插件
    ├── jx.css          
    ├── jx.js           --框架核心样式文件、脚本文件，任何使用框架的地方都需要引用
    ├── login.css       
    ├── login.js        --框架实现的登录界面样式文件、脚本文件，使用之前需要引入`jx.css`、`jx.js`，非必须
    ├── app.css         
    ├── app.js          --框架实现的主界面样式文件、脚本文件，使用之前需要引入`jx.css`、`jx.js`，非必须
    ├── doc.css         
    └── doc.js          --用来编写软件文档的样式文件、脚本文件，只有在编写软件文档的时候才需要引用
```


## CDN引入

通过 http://47.94.175.234/cdn/jx/ 可以看到`框架`最新版本的资源，在页面上引入 js 和 css 文件即可开始使用：

```html
<!-- 引入框架核心 -->
<link href="//47.94.175.234/cdn/jx/1.0.1/jx.css" rel="stylesheet">
<script src="//47.94.175.234/cdn/jx/1.0.1/jx.js"></script>
```
可以根据情况选择相应的版本

!> **推荐使用CDN引入的方式进行项目开发**

## 示例

### 空白页面

```html
<!DOCTYPE html>
<html>
<head>
    <title>标题</title>
    <meta charset="utf-8"/>
    <meta name="renderer" content="webkit"/>
    <meta name="force-rendering" content="webkit"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon"/>
    <link href="//47.94.175.234/cdn/jx/1.0.1/jx.css" rel="stylesheet"/>
</head>
<body>
<!--页面内容-->
<script src="//47.94.175.234/cdn/jx/1.0.1/jx.js"></script>
</body>
</html>
```

### 登录界面

[登录界面演示](../demo/login.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>登录西交投软件开发平台</title>
  <meta charset="utf-8"/>
  <meta name="renderer" content="webkit"/>
  <meta name="force-rendering" content="webkit"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
  <link href="//47.94.175.234/cdn/jx/1.0.1/jx.css" rel="stylesheet" />
  <link href="//47.94.175.234/cdn/jx/1.0.1/login.css" rel="stylesheet" />
</head>
<body>
<div class="container">
  <form id="login_form" class="form-horizontal col-md-6 col-md-offset-3"
        data-url="mock/login.php">
    <div class="form-group">
      <img src="asset/img/logo.svg"/>
    </div>
    <div class="form-group title font-kai">
      西交投软件开发平台
    </div>
    <div class="form-group">
      <div class="col-md-8 col-md-offset-2 has-feedback">
        <input id="account" name="account" class="form-control input-lg"
               placeholder="账号" data-msg="请输入账号" autofocus autocomplete="off"/>
        <i class="form-control-feedback icon-user"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-md-8 col-md-offset-2 has-feedback">
        <input id="password" name="password" class="form-control input-lg" type="password"
               placeholder="密码" data-msg="请输入密码" autocomplete="off"/>
        <i class="form-control-feedback box-icon icon-lock"></i>
      </div>
    </div>
    <div class="form-group captcha-container" style="display: block;">
      <div class="col-md-8 col-md-offset-2 has-feedback">
        <input id="captcha" name="captcha" class="form-control input-lg"
               placeholder="验证码" data-msg="请输入验证码" autocomplete="off"/>
        <img id="captcha_img" src="" class="captcha-img" data-url="mock/captcha.php">
      </div>
    </div>
    <div class="form-group">
      <div class="col-md-8 col-md-offset-2 has-feedback">
        <div class="checkbox-container">
          <label>
            <input id="auto_login" name="auto_login" class="checkbox-check" type="checkbox" value="true">
            <span></span>
            <span>下次自动登录</span>
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="col-md-8 col-md-offset-2">
        <input id="btn_login" name="btn_login" class="btn btn-default btn-block btn-lg"
               type="button" value="登 录"/>
      </div>
    </div>
  </form>
</div>
<div class="footer">
  西交投公司 版权所有&copy;2007-2018
</div>
<script src="//47.94.175.234/cdn/jx/1.0.1/jx.js"></script>
<script src="//47.94.175.234/cdn/jx/1.0.1/login.js"></script>
</body>
</html>
```

### 主界面

[主界面演示](../demo/index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>西交投软件开发平台</title>
  <meta charset="utf-8"/>
  <meta name="renderer" content="webkit"/>
  <meta name="force-rendering" content="webkit"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
  <link href="//47.94.175.234/cdn/jx/1.0.1/jx.css" rel="stylesheet" />
  <link href="//47.94.175.234/cdn/jx/1.0.1/app.css" rel="stylesheet" />
</head>
<body class="easyui-layout" style="display: none;">
<div id="layout-north" data-options="region:'north'">
  <div class="logo">
    <img src="asset/img/logo.svg">
  </div>
  <div class="title font-kai" style="color: greenyellow;">
    西交投软件开发平台
    <div class="subtitle">
      测试版
    </div>
  </div>
  <div class="nav">
    <ul>
      <li>
        <a id="nav_home">
          <i class="icon-home"></i><br>系统主页
        </a>
      </li>
      <li>
        <a>
          <i class="icon-user"></i><br>个人中心
        </a>
      </li>
      <li id="user_message">
        <a>
          <i class="icon-bubbles"></i><br>消息通知
        </a>
      </li>
      <li>
        <a id="user_feedback">
          <i class="icon-note"></i><br>用户反馈
        </a>
      </li>
      <li>
        <a>
          <i class="icon-key"></i><br>修改密码
        </a>
      </li>
      <li>
        <a id="nav_logout" data-url="mock/logout.php">
          <i class="icon-login"></i><br>安全退出
        </a>
      </li>
    </ul>
  </div>
</div>
<div id="layout-west" data-options="region:'west',split:true"
     title="导航菜单">
  <div class="m-5">
    <input class="form-control jxtree-filter" placeholder="请输入关键字模糊查询">
  </div>
  <div class="jxtree" data-url="mock/menu.json"></div>
</div>
<div id="layout-center" data-options="region:'center'"
     title=" " data-title="系统主页" data-url="home.html">
</div>
<div id="layout-south" data-options="region:'south'">
  <div class="left">
    欢迎您：
    <span id="layout-south-name">管理员</span>
    <span id="layout-south-time"></span>
  </div>
  <div class="right">
    西交投公司 版权所有&copy;2007-2018
  </div>
</div>
<script src="//47.94.175.234/cdn/jx/1.0.1/jx.js"></script>
<script src="//47.94.175.234/cdn/jx/1.0.1/app.js"></script>
</body>
</html>
```

### 软件文档

```html
<!DOCTYPE html>
<html>
<head>
    <title>西交投前端框架</title>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="renderer" content="webkit"/>
    <meta name="force-rendering" content="webkit"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="keywords" content="西交投前端框架">
    <meta name="description" content="西交投前端框架">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
    <link rel="stylesheet" href="//192.168.1.239:1000/jx/1.0.1/jx/doc.css">
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
        markdown: {
            smartypants: true,
            breaks:true
        }
    };
</script>
<script src="//47.94.175.234/cdn/jx/1.0.1/doc.js"></script>
</body>
</html>
```