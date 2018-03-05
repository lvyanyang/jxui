# 前端构建工具

本项目前端构建工具使用的是百度公司出品的[`FIS3`](https://github.com/fex-team/fis3)

[官方文档](http://fis.baidu.com/fis3/docs/beginning/intro.html)

FIS3 是面向前端的工程构建工具。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。

> 本文档展示命令，如果是 Windows 请打开 cmd 输入命令执行，如果是类 Unix 系统，请打开任意终端输入命令执行。

## 安装 Node 和 NPM

详细过程参考官网 https://nodejs.org

> Node **版本要求** 0.8.x，0.10.x, 0.12.x，4.x，6.x，不在此列表中的版本不予支持。最新版本 node 支持会第一时间跟进，支持后更新支持列表。

- Ubuntu 用户使用 `apt-get` 安装 node 后，安装的程序名叫 `nodejs`，需要软链成 `node`
- Windows 用户安装完成后需要在 CMD 下确认是否能执行 node 和 npm

## 淘宝 NPM 镜像
淘宝 NPM 镜像是一个完整 `npmjs.org` 镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。为了加快安装速度,建议使用`cnpm`代替`npm`.

安装`cnpm`

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

详细过程参考官网 http://npm.taobao.org/

## 安装 FIS3

```bash
cnpm install -g fis3
```

- `-g` 安装到全局目录，必须使用全局安装，当全局安装后才能在命令行（cmd或者终端）找到 `fis3` 命令
- 安装过程中遇到问题具体请参考 [fis#565](https://github.com/fex-team/fis/issues/565) 解决
- 如果已经安装了 [FIS](https://github.com/fex-team/fis)，也执行上面的命令进行安装，FIS3 和 FIS 是不同的构建工具，向下无法完全兼容。如果要从 FIS 迁移到 FIS3，请参考文档 [FIS 升级 FIS3](../fis2-to-fis3.md)
- 如果 npm 长时间运行无响应，推荐使用 [cnpm](http://npm.taobao.org/) 来安装

安装完成后执行 `fis3 -v` 判断是否安装成功，如果安装成功，则显示类似如下信息：

```
$ fis3 -v

 [INFO] Currently running fis3 (/Users/Your/Dev/fis3/dev/fis3)

  v3.0.0

   /\\\\\\\\\\\\\\\  /\\\\\\\\\\\     /\\\\\\\\\\\
   \/\\\///////////  \/////\\\///    /\\\/////////\\\
    \/\\\                 \/\\\      \//\\\      \///
     \/\\\\\\\\\\\         \/\\\       \////\\\
      \/\\\///////          \/\\\          \////\\\
       \/\\\                 \/\\\             \////\\\
        \/\\\                 \/\\\      /\\\      \//\\\
         \/\\\              /\\\\\\\\\\\ \///\\\\\\\\\\\/
          \///              \///////////    \///////////
```

如果提示找不到 `fis3` 命令并且 **npm** 安装成功退出，请参考文档 [fis#565](https://github.com/fex-team/fis/issues/565) 解决
如果windows下提示 `basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")` 则找到 C:\Users\win-7\AppData\Roaming\npm下面的fis脚本删除，留下fis.cmd就好了（没有识别系统是不是Windows）
## 升级 FIS3

```bash
cnpm update -g fis3
```
或重装

```bash
cnpm install -g fis3
```