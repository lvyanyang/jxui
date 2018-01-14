# 核心库
> 本篇主要介绍核心基础库的底层函数的功能和用法。

核心对象定义在全局`window`对象上，调用方式为:`window.jx`。也可以简写为：`jx`

```javascript
jx.version;//核心库的版本
jx.debug;//核心库是否调试状态
jx.uuid();//生成一个通用唯一识别码
```

## 公共函数

### formatString(str,...)

格式化输出字符串，支持位置变量和命名变量。

```javascript
//位置变量
jx.formatString('编号:{0},姓名:{1}',1001,'张三');

//命名变量
var user = { id:1001,name:'张三' };
jx.formatString('编号:{id},姓名:{name}',user);

// 输出：
// "编号:1001,姓名:张三"
```

### ns(str...)

创建命名空间

```javascript
//创建单个命名空间
jx.ns('XCI.UI.Grid');

//同时创建多个命名空间
jx.ns('XCI.UI','System.Out','NCI.Out');
```

### randomNumber(min, max)
生成一个在`min`和`max`之间的随机数
- min {number} 最小值
- max {number} 最大值

### randomString(len)
生成随机字符串，包含字母大小写以及数字
- len {number} 总长度

### uuid()
生成一个Universally Unique Identifier(通用唯一识别码)
eg：`70014dbc14b64239a01278f2487781d3`
 
### serialize($form)
序列化表单，返回使用控件name属性作为键名的对象
```html
<form>
    <input name="account" placeholder="账号"/>
    <input name="password" placeholder="密码" type="password"/>
    <input name="captcha" placeholder="验证码"/>
    <input name="auto_login" type="checkbox" value="true">
</form>
<script>
jx.serialize($('form'))
// 输出：
// {account: "sa", password: "1", captcha: "114d", auto_login: "true"}
</script>
```

### getBody(str) 
获取body标签内的html字符串（使用正则匹配）
- str 包含html标签的字符串

### fixLen(str, total, [defaults])
获取固定长度的字符串
- str {string} 原始字符串
- total {number} 字符串总长度
- defaults {string} 原始字符串长度不足时，指定默认补充字符，默认：0。
       
### formatDateTime(date)
格式化为标准日期时间
- date {Date} 日期对象
```javascript
jx.formatDateTime(new Date())
//输出："2018-01-10 15:52:01"
jx.formatDateTime(new Date('2014/07/10 10:21:12'))
//输出："2014-07-10 10:21:12"
```

### formatTime(date)
格式化为标准时间
- date {Date} 日期对象
```javascript
jx.formatTime(new Date())
//输出："15:59:54"
jx.formatTime(new Date('2014/07/10 10:21:12'))
//输出："10:21:12"
```

### formatDate(date, format)
格式化日期
- date {Date} 日期对象
- format {string} 格式字符串，默认：`yyyy-MM-dd`

| 格式 | 说明 |
| --- | --- |
| y+ | 年 | 
| M+ | 月 | 
| d+ | 日 | 
| h+ | 时 | 
| m+ | 分 | 
| s+ | 秒 | 
| S | 毫秒 | 
| q+ | 季度 | 

```javascript
jx.formatDate(new Date())
//输出："2018-01-10"
jx.formatDate(new Date('2014/07/10 10:21:12'))
//输出："2014-07-10"
jx.formatDate(new Date('2014/07/10 10:21:12'),'MM-dd hh:mm')
//输出："07-10 10:21"
```
### isEmpty(obj) 
检查输入项是否为空
- `null` 、`undefined` 、`空字符串`、`数字0`，返回true
- 数组：没有任何元素，返回true
- 对象：没有任何成员，返回true
- 函数：直接返回false

### isInt(obj)
检查输入项是否是整数

### isNumber(obj)
检查输入项是否是数字
 
### isString(obj)
检查输入项是否是字符串

### isBool(obj)
检查输入项是否是布尔值
输入 `true` `false` 返回true，其余都返回false   
       
### isArray(obj)
检查输入项是否是数组

### isObj(obj)
检查输入项是否是对象

### isFunc(obj)
检查输入项是否是函数
        
### hasChinese(str)
检查输入项是否包含汉字
       
### toObj(str)
字符串转为对象

```javascript
jx.toObj("{ id:1001,name:'张三' }")
//输出：{id: 1001, name: "张三"}
jx.toObj("id:1001,name:'张三'")
//输出：{id: 1001, name: "张三"}
```

### toArray(str)
字符串转为数组  
```javascript
jx.toArray('[1,2,3,4,5]')
//输出：(5) [1, 2, 3, 4, 5]

jx.toArray("['a','b','c','d','e']")
//输出：(5) ["a", "b", "c", "d", "e"]

jx.toArray("'a','b','c','d','e'")
//输出：(5) ["a", "b", "c", "d", "e"]
```
     
### toFunc(str)   
字符串转为函数
```javascript
var func = jx.toFunc('function (){ console.log("我是动态匿名函数"); }');
func();
//输出：我是动态匿名函数
```
  
### toNumber(str)  
字符串转为数字     
 
### calcVal(str)
动态计算字符脚本值
 
### getUrlParam(key)
获取当前页面Url指定的参数值
```javascript
window.location.href;
//输出："http://localhost:4000/dist/demo/?id=1001"
jx.getUrlParam('id');
//输出："1001"

window.location.href;
//输出："http://localhost:4000/dist/demo/"
jx.getUrlParam('id');
//输出：""
```

### setUrlParam(url, key, value)
设置Url参数名和参数值
```javascript
jx.setUrlParam('user/index','id',1002)
//输出："user/index?id=1002"
jx.setUrlParam('user/index?id=1001','name','李四')
//输出："user/index?id=1001&name=李四"
```
               
### monitorLayoutPanel($layout, region, name)
监视layout面板宽度/展开/合上状态
主要针对EasyUI Layout布局，当面板的宽度和展开状态发生变化时自动记忆状态
- $layout {jQuery} 布局对象
- region=north|west|east|south {string} 方位
- name {string} 组件名称
                          
### treeRecursion(data, [callback])
递归树节点
主要针对EasyUI Tree控件
- data {array} 树节点
- callback {function} 回调函数

### treeConvert(rows) 
把平行数据转换为层级数据
主要针对EasyUI Tree控件数据结构

### stope(e)                         
阻止事件冒泡和默认行为                                           
```javascript
e = e || window.event;
e.preventDefault();
e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
```                                                
                                     
### parseOptions($target, properties)                                                       
解析可视化组件选项，关于解析组件选项请查看[系统插件](jx-plugin.md)

```javascript
jx.parseOptions($target);
jx.parseOptions($target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
```                                                       
                                                                         
### plugin(config)
定义系统插件，关于系统插件请查看[系统插件](jx-plugin.md)
                                                                   
### extend(object)
扩展核心对象

### regModules(mods)
注册模块
- mods 模块对象，关于模块对象请查看[模块对象](jx-modules.md)

### regCallbacks(name, fn)
注册全局回调函数
- name 全局回调函数名称,同一名称可以注册多个回调函数，在使用`getCallbacks(name)`函数获取时会返回一个数组
- fn 回调函数

### getCallbacks(name)
获取全局回调函数
- name 全局回调函数名称    
    
### require(deps, callback)
动态加载模块
- deps 依赖的[模块对象](jx-modules.md)
- callback 加载完成后回调函数

### depend(deps, callback)
声明模块依赖，只是声明依赖并不加载，在`ready`函数调用时才加载模块，关于执行顺序请查看[模块对象](jx-modules.md)
- deps 依赖的[模块对象](jx-modules.md)
              
### ready([deps], [callback])
页面启动函数，用来初始化组件，关于页面事件及执行顺序请查看[页面事件](jx-event.md)
