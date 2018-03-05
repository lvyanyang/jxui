/**
 * 框架核心库
 */

//region 框架核心库
window.jx = function () {

    //region 私有变量

    var deferred = $.Deferred();
    var promise = false, isReady = false;
    var eventBeforeInit = 'jx_eventBeforeInit',
        eventPreInit = 'jx_eventPreInit',
        eventInit = 'jx_eventInit',
        eventAfterInit = 'jx_eventAfterInit',
        loaded = [], depends = [], modules = {}, callbacks = {};

    //endregion

    //region 私有方法

    /**
     * 格式化字符串
     * @param args 参数数组
     * @returns {string}
     * @private
     */
    var formatString = function (args) {
        var _str = args[0];//第一个参数
        var _data = args[1];//第二个参数
        var _pdata;
        //如果第二个参数是数组或者对象类型,把第二个参数当做数据容器
        if (_data && (Array.isArray(_data) || _data.constructor === Object)) {
            _pdata = _data;
        }
        else { //第二个参数不是数组或者对象类型,从第二个参数开始截取数组当做数据容器
            _pdata = Array.prototype.slice.call(args, 1);
        }
        //字符串替换,正则搜索大括号中的多个数字或者字母
        return _str.replace(/{([\d|\w]+)}/g, function (match, number) {
            return typeof _pdata[number] !== 'undefined' ? _pdata[number] : match;
        });
    };

    /**
     * 使用逗号或者空格分隔字符串为数组
     * @param str 待分隔的字符串
     * @returns {Array} 返回数组
     * @private
     */
    var splitString = function (str) {
        return str.split(/[\s+|,]/);
    };

    /**
     * 获取类库基路径
     */
    var getBasePath = function () {
        var jsPath = document.currentScript.src;
        // console.log('jsPath');
        // console.log(jsPath);
        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    };

    /**
     * 创建命名空间
     * @private
     */
    var ns = function (args) {
        var arr = args, o, i, j, c, n;
        if (typeof args === 'string') {
            arr = [args];
        }
        for (i = 0; i < arr.length; i++) { //接收多个参数
            c = arr[i].split('.');//把参数的字符串用点分隔为数组
            o = window;//设置当前对象为顶层对象
            for (j = 0; j < c.length; j++) { //循环每个命名空间对象
                n = c[j]; //当前命名空间名称
                o[n] = o[n] || {}; //如果没有定义,生成对象
                o = o[n]; //设置当前对象
            }
        }
    };

    /**
     * 指定的父节点下面是否有节点
     * @param rows
     * @param parentid
     * @return {boolean}
     */
    var treeNodeExists = function (rows, parentid) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id === parentid) return true;
        }
        return false;
    };

    /**
     * 把节点转换为EasyUI使用的节点格式
     * @param {array} rows
     * @return {array}
     */
    var treeNodeConvert = function (rows) {
        var nodes = [];
        //获取root节点
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!treeNodeExists(rows, row['pid'])) {
                nodes.push(row);
            }
        }

        var toDo = [];
        for (i = 0; i < nodes.length; i++) {
            toDo.push(nodes[i]);
        }
        while (toDo.length) {
            var node = toDo.shift();
            for (i = 0; i < rows.length; i++) {
                row = rows[i];
                if (row['pid'] === node.id) {
                    var child = row;
                    if (node.children) {
                        node.children.push(child);
                    } else {
                        node.children = [child];
                    }
                    //node.state = 'closed';
                    toDo.push(child);
                }
            }
        }
        return nodes;
    };

    var processDebugFile = function (url) {
        if (!url) {
            return url;
        }
        if (jx.debug) {
            return url;
        }
        var fileIndex = url.lastIndexOf('/') + 1;
        var extIndex = url.lastIndexOf('.');
        var fileDir = url.substring(0, fileIndex);
        var fileName = url.substring(fileIndex, extIndex);
        var fileExt = url.substring(extIndex);
        return fileDir + fileName + '.min' + fileExt;
    };

    /**
     * 加载js
     */
    var loadJS = function (url) {
        if (loaded[url]) return loaded[url].promise();

        var _url = processDebugFile(url);

        if (jx.debug) {
            _url = jx.setUrlParam(url, '_', Date.now());
        }

        var deferred = $.Deferred();
        var script = document.createElement('script');
        script.src = _url;
        script.onload = function (e) {
            deferred.resolve(e);
        };
        script.onerror = function (e) {
            deferred.reject(e);
        };
        document.body.appendChild(script);
        loaded[url] = deferred;
        if (jx.debug) {
            console.log('动态加载JS  : url = ' + _url);
        }
        return deferred.promise();
    };

    /**
     * 加载css
     */
    var loadCSS = function (url) {
        if (loaded[url]) return loaded[url].promise();

        var _url = processDebugFile(url);
        if (jx.debug) {
            _url = jx.setUrlParam(url, '_', Date.now());
        }
        var deferred = $.Deferred();
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = _url;
        style.onload = function (e) {
            deferred.resolve(e);
        };
        style.onerror = function (e) {
            deferred.reject(e);
        };
        document.head.appendChild(style);
        loaded[url] = deferred;
        if (jx.debug) {
            console.log('动态加载CSS : url = ' + _url);
        }

        return deferred.promise();
    };

    /**
     * 加载css/js
     */
    var loadRes = function (urls) {
        urls = Array.isArray(urls) ? urls : splitString(urls);

        if (!promise) {
            promise = deferred.promise();
        }

        $.each(urls, function (index, src) {
            promise = promise.then(function () {
                return src.indexOf('.css') >= 0 ? loadCSS(src) : loadJS(src);
            });
        });
        deferred.resolve();
        return promise;
    };

    /**
     * 解析模块
     * @param {Array} urls 数组
     * @param {String|Array} moduleStr 模块字符串
     * @private
     */
    var parseModule = function (urls, moduleStr) {
        moduleStr = moduleStr || [];
        var __u;
        var _modules = Array.isArray(moduleStr) ? moduleStr : splitString(moduleStr);

        for (var i = 0; i < _modules.length; i++) {
            var name = _modules[i];
            var m = modules[name];
            if (!m) {
                continue;
                // m = name + '.js';
            }

            if (m.constructor === Object) { //对象类型
                if (m['depend']) {
                    parseModule(urls, m['depend']);
                }
                __u = m.url;
            } else {
                __u = m;
            }
            _parseModuleUrl(urls, __u);
        }
    };

    /**
     * 解析模块字符串中的url
     * @param {Array} urls 数组
     * @param {String|Array} __u 路径字符串
     * @private
     */
    var _parseModuleUrl = function (urls, __u) {
        var _urls = Array.isArray(__u) ? __u : splitString(__u);
        for (var j = 0; j < _urls.length; j++) {
            var _u = _urls[j];
            if (_u.startsWith('http') || _u.startsWith('//')) {
                urls.push(_u);
            }
            else if (_u.startsWith('/')) {
                urls.push(window.location.origin + _u);
            }
            else {
                urls.push(_u);
            }
        }
    };

    /**
     * 关闭Chrome浏览器
     */
    var closeChrome = function () {
        var browserName = navigator.appName;
        if (browserName === 'Netscape') {
            window.open('', '_self', '');

            if (window.opener !== undefined) {
                //for chrome
                window.opener.returnValue = '1';
            }
            else {
                window.returnValue = '1';
            }

            window.close();
        }
        else {
            window.close();
        }
    };

    //endregion

    return {

        /**
         * 版本
         */
        version: '1.0.0',

        /**
         * 是否调试
         */
        debug: document.currentScript.dataset.debug === 'true' || false,

        /**
         * 类库url
         */
        libDir: getBasePath() + 'lib/',

        /**
         * 格式化字符串,支持位置变量:id:{0},name:{1}
         * @param {string} str 字符串
         */
        formatString: function (str) {
            return formatString(arguments);
        },

        /**
         * 创建命名空间
         */
        ns: function () {
            ns(arguments);
        },

        /**
         * 获取类库基础路径
         */
        getBasePath: function () {
            return getBasePath();
        },

        /**
         * 序列化表单,使用控件name属性作为键名
         * @param $form 表单对象
         * @return {object} 返回表单数据对象
         */
        serialize: function ($form) {
            var obj = {};
            var data = $form.serializeArray();
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                obj[item.name] = item.value;
            }
            $form.find('input[type=checkbox]').each(function () {
                if ($(this).prop('checked') === false) {
                    var name = $(this).attr('name');
                    obj[name] = $(this).data('uncheckedValue');
                }
            });
            return obj;
        },

        /**
         * 创建UUID.(Universally Unique Identifier 通用唯一识别码)
         * @return {string}
         */
        uuid: function () {
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 3 | 8);
                return v.toString(16);
            }).toLowerCase();
        },

        /**
         * 获取body标签内的html字符串
         * @param {string} content 待截取的字符串
         * @returns {string} 如果content不包含body标签,则返回原始字符串
         */
        getBody: function (content) {
            var _reg = /<body[^>]*>([\s\S]*)<\/body>/;
            var result = _reg.exec(content);
            if (result && result.length === 2)
                return result[1];
            return content;
        },

        /**
         * 获取ajax请求错误信息
         * @param httpRequest
         */
        getAjaxError: function (httpRequest) {
            var msg = '';
            if (!httpRequest['responseJSON']) {
                msg = jx.getBody(httpRequest.responseText) || httpRequest.responseText;
            }
            else {
                msg = httpRequest['responseJSON'].msg;
            }
            return msg;
        },

        /**
         * 生成随机数字(min-max之间)
         * @param {number} min 最小值
         * @param {number} max 最大值
         * @return {number}
         */
        randomNumber: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * 生成随机字符串
         * @param {number} len 字符串总长度
         * @return {string}
         */
        randomString: function (len) {
            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var str = '';
            for (var i = 0; i < len; ++i) {
                var rand = Math.floor(Math.random() * alphabet.length);
                str += alphabet.substring(rand, rand + 1);
            }
            return str;
        },

        /**
         * 获取固定长度的字符串
         * @param {string} str 原始字符串
         * @param {number} total 字符串总长度
         * @param {string} [defaults='0'] 默认补充字符
         */
        fixLen: function (str, total, defaults) {
            str = str.toString();
            if (typeof defaults === 'undefined') {
                defaults = '0';
            }
            var result = '';
            var times = total - (str.length);
            for (var i = 1; i <= times; i++) {
                result += defaults;
            }
            return result + str;
        },

        /**
         * 格式化为日期
         * @param {Date} date 日期
         * @param {string} format 格式
         * @example jx.formatDate(new Date('2014/07/10 10:21:12'),'MM-dd')
         */
        formatDate: function (date, format) {
            if (typeof format === 'undefined') {
                format = 'yyyy-MM-dd';
            }
            var o = {
                'M+': date.getMonth() + 1,                  //month
                'd+': date.getDate(),                       //day
                'h+': date.getHours(),                      //hour
                'm+': date.getMinutes(),                    //minute
                's+': date.getSeconds(),                    //second
                'q+': Math.floor((date.getMonth() + 3) / 3),//quarter
                'S': date.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length === 1 ? o[k] :
                            ('00' + o[k]).substr(('' + o[k]).length));
                }
            }
            return format;
        },

        /**
         * 格式化为标准日期时间
         * @param {Date} date
         */
        formatDateTime: function (date) {
            return this.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },

        /**
         * 格式化为标准时间
         * @param {Date} date
         */
        formatTime: function (date) {
            return this.formatDate(date, 'hh:mm:ss');
        },

        /**
         * 检查是否为空
         * 字符串/数字/布尔
         * 数组:没有任何元素,返回true
         * 对象:没有任何成员,返回true
         * 函数:返回false
         * @return {boolean}
         */
        isEmpty: function (obj) {
            if (!obj) return true;
            if (this.isFunc(obj)) {
                return false;
            }
            if (this.isArray(obj) || this.isObj(obj)) {
                return Object.keys(obj).length === 0;
            }
            else {
                return !(!!obj);
            }
        },

        /**
         * 是否是整数
         * @param {string} str 字符串
         * @return {boolean}
         */
        isInt: function (str) {
            return (new RegExp(/^\d+$/).test(str));
        },

        /**
         * 是否是数字
         * @return {boolean}
         */
        isNumber: function (obj) {
            return $.isNumeric(obj);
        },

        /**
         * 是否是字符串
         * @return {boolean}
         */
        isString: function (obj) {
            return typeof obj === 'string';
        },

        /**
         * 是否是布尔值
         * @return {boolean}
         */
        isBool: function (obj) {
            return typeof obj === 'boolean';
        },

        /**
         * 是否是对象类型
         * @return {boolean}
         */
        isObj: function (obj) {
            return typeof obj === 'object';
        },

        /**
         * 是否是数组类型
         * @return {boolean}
         */
        isArray: function (obj) {
            return Array.isArray(obj);
        },

        /**
         * 是否未定义
         * @param obj
         * @returns {boolean}
         */
        isUndefined: function (obj) {
            return typeof obj === 'undefined';
        },

        /**
         * 是否是函数类型
         * @return {boolean}
         */
        isFunc: function (obj) {
            return typeof obj === 'function';
        },

        /**
         * 是否包含汉字
         * @param {string} str 字符串
         * @return {boolean}
         */
        hasChinese: function (str) {
            return (new RegExp(/[\u4E00-\u9FA5]/).test(str));
        },

        /**
         * 字符串转为对象
         * @param {string|object} str 字符串
         * @return {object}
         */
        toObj: function (str) {
            if (typeof str === 'object') return str;
            if (typeof str !== 'string') return str;
            str = str && str.trim();
            if (!str) return {};
            if (str === 'null') return null;

            try {
                if (str.substring(0, 1) !== '{') {
                    str = '{' + str + '}';
                }
                return (new Function('return ' + str))();
            } catch (e) {
                console.log('jx.toObject("' + str + '") 发生异常:' + e);
                return null;
            }
        },

        /**
         * 字符串转为数组
         * @param {string|Array} str 字符串
         * @return {Array}
         */
        toArray: function (str) {
            if (Array.isArray(str)) return str;
            if (typeof str !== 'string') return str;

            str = str && str.trim();
            if (!str) return [];
            if (str === 'null') return null;

            try {
                if (str.substring(0, 1) !== '[') {
                    str = '[' + str + ']';
                }
                return (new Function('return ' + str))();
            } catch (e) {
                console.log('jx.toArray("' + str + '") 发生异常:' + e);
                return null;
            }
        },

        /**
         * 字符串转为函数 'function(){...}' 或 'getName' 或 'USER.getName' 均可
         * @param str 字符串
         * @return {*}
         */
        toFunc: function (str) {
            if (!str) return undefined;

            if (str.startsWith('function')) {
                return (new Function('return ' + str))();
            }

            var m_arr = str.split('.');
            var fn = window;

            for (var i = 0; i < m_arr.length; i++) {
                fn = fn[m_arr[i]];
            }
            if (typeof fn === 'function') {
                return fn;
            }

            return undefined;
        },

        /**
         * 转为数字
         * @param str
         */
        toNumber: function (str) {
            if (!str) return -1;
            return parseFloat(str);
        },

        toDecimal: function (num) {
            if (num == null) {
                num = "0"
            }
            num = num.toString().replace(/\$|\,/g, "");
            if (isNaN(num)) {
                num = "0"
            }
            var sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            var cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10) {
                cents = "0" + cents
            }
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + "" + num.substring(num.length - (4 * i + 3))
            }
            return (((sign) ? "" : "-") + num + "." + cents)
        },

        /**
         * 转为布尔
         * @param str
         */
        toBoolean: function (str) {
            if (typeof str === 'boolean') {
                return str;
            }
            return str == 'true' || str == '1';
        },

        /**
         * 计算js表达的值
         * @param str 字符串
         */
        calcVal: function (str) {
            if (typeof str === 'object') return str;
            if (typeof str !== 'string') return str;
            str = str && str.trim();
            if (!str) return null;
            if (str === 'null') return null;

            try {
                return (new Function('return ' + str))();
            } catch (e) {
                console.log('jx.calcVal("' + str + '") 发生异常:' + e);
                return null;
            }
        },

        /**
         * 获取Url参数
         * @param key 键名
         * @returns {*}
         */
        getUrlParam: function (key) {
            var search = location.search.slice(1);
            var arr = search.split('&');
            for (var i = 0; i < arr.length; i++) {
                var ar = arr[i].split('=');
                if (ar[0] === key) {
                    var v = decodeURI(ar[1]);
                    if (typeof v === 'undefined') {
                        return '';
                    } else {
                        return v;
                    }
                }
            }
            return '';
        },

        /**
         * 设置Url参数
         * @param url url地址
         * @param key 键名
         * @param value 键值
         * @return {string}
         */
        setUrlParam: function (url, key, value) {
            var newUrl = '';
            var reg = new RegExp('(^|)' + key + '=([^&]*)(|$)');
            var tmp = key + '=' + value;
            if (url.match(reg) !== null) {
                newUrl = url.replace(eval(reg), tmp);
            } else {
                if (url.match('[\?]')) {
                    newUrl = url + '&' + tmp;
                }
                else {
                    newUrl = url + '?' + tmp;
                }
            }
            return newUrl;
        },

        /**
         * 创建iframe
         * @param {string} url 页面Url
         * @return {string}
         */
        createIframe: function (url) {
            return '<iframe frameborder="0" style="width:100%;height:100%;" src="' + url + '" ></iframe>';
        },

        /**
         * 监视laout面板宽度/展开/合上状态
         * @param {jQuery} $layout 布局对象
         * @param {string} region=north|west|east|south 方位
         * @param {string} [name] 名称
         */
        monitorLayoutPanel: function ($layout, region, name) {
            if (!name) {
                name = '';
            } else {
                name += '_';
            }
            var widthKey = name + region + '_width';
            var expandKey = name + region + '_expand';
            var $panel = $layout.layout('panel', region);
            var currentWidth = 0;
            if (localStorage.getItem(widthKey) != null) {
                $panel.panel('resize', {
                    width: localStorage.getItem(widthKey)
                });
                $layout.layout('resize');
            }

            if (localStorage.getItem(expandKey) != null) {
                var isExpand = localStorage.getItem(expandKey) == 'true';
                setTimeout(function () {
                    if (isExpand === true) {
                        $layout.layout('expand', region);
                    }
                    else {
                        $layout.layout('collapse', region);
                    }
                }, 1);
            }

            $layout.layout({
                onCollapse: function (r) {
                    if (r === region) {
                        localStorage.setItem(expandKey, 'false');
                    }
                },
                onExpand: function (r) {
                    if (r === region) {
                        localStorage.setItem(expandKey, 'true');
                    }
                }
            });

            $panel.panel({
                onResize: function (w, h) {
                    if (currentWidth !== w) {
                        localStorage.setItem(widthKey, w);
                        currentWidth = w;
                    }
                }
            });
        },

        /**
         * 递归树节点
         * @param {object} data EasyTreeJson
         * @param {function} callback 回调函数
         */
        treeRecursion: function (data, callback) {
            var self = this;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (callback) {
                    callback(item);
                }
                if (item.children && item.children.length > 0) {
                    self.treeRecursion(item.children, callback);
                }
            }
        },

        /**
         * 把平行数据转换为层级数据
         * @param {array} rows 平行数据
         * @return {array} 转换为层级数据
         */
        treeConvert: function (rows) {
            return treeNodeConvert(rows);
        },

        /**
         * 阻止事件冒泡和默认行为
         * @param e
         */
        stope: function (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        },

        /**
         * 返回延时执行回调函数代理函数
         */
        delay: function () {
            var core = function () {
                var sTimeoutId = null;
                var self = this;

                /**
                 * 延时执行回调函数
                 * @param cback 回调函数
                 * @param time 延时（毫秒），默认500毫秒
                 */
                this.run = function (cback, time) {
                    if (!time) {
                        time = 500;
                    }
                    if (sTimeoutId && sTimeoutId > 0) {
                        clearTimeout(sTimeoutId);
                    }
                    sTimeoutId = setTimeout(function () {
                        if (cback) {
                            cback();
                        }
                    }, time);
                };
            };
            return new core();
        },

        /**
         * 打印当前文档
         */
        print: function () {
            setTimeout(function () {
                window.print();
                setTimeout(function () {
                    closeChrome();
                }, 1);
            }, 1);
        },

        /**
         * 封装ajax请求
         * @param ops
         */
        ajax: function (ops) {
            var defaults = {
                confirm: null,
                maskTarget: null,
                maskMsg: null,
                maskDelay: 100,
                type: 'post',
                dataType: 'json',
                error:function (request) {
                    if (request.responseJSON) {
                        layer.alert(request.responseJSON.message || '提交失败');
                    }
                    else {
                        layer.alert(request.statusText || '退出失败');
                    }
                }
            };
            var _success = ops.success;
            var options = $.extend({}, defaults, ops);
            if (!options.maskTarget) {
                options.maskTarget = $(document.body);
            }

            options.showMask = function () {
                if (options.maskMsg) {
                    options.maskTarget.mask(options.maskMsg, options.maskDelay);
                }
            };

            options.success = function (data, textStatus, jqXHR) {
                if (options.maskMsg) {
                    options.maskTarget.unmask();
                }
                if (_success) {
                    _success(data, textStatus, jqXHR);
                }
            };

            if (options.confirm) {
                jx.confirm(options.confirm, function (ok, index) {
                    if (ok) {
                        options.showMask();
                        $.ajax(options);
                    }
                });
            }
            else {
                options.showMask();
                $.ajax(options);
            }
        },

        /**
         * 解析选项, 包括属性 data-options'.
         * 例子:
         * jx.parseOptions($element);
         * jx.parseOptions($element, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
         */
        parseOptions: function ($target, properties) {
            var s = $.trim($target.attr('data-options'));
            var options = jx.toObj(s);
            if (properties) {
                var opts = {};
                var v = '';
                for (var i = 0; i < properties.length; i++) {
                    var pp = properties[i];
                    if (jx.isString(pp)) {
                        opts[pp] = $target.data(pp);
                    } else {
                        for (var name in pp) {
                            if (typeof $target.data(name) === 'undefined') {
                                continue;
                            }
                            var type = pp[name];
                            if (type === 'boolean') {
                                opts[name] = Boolean($target.data(name));
                            } else if (type === 'number') {
                                opts[name] = Number($target.data(name));
                            } else if (type === 'object') {
                                v = $target.data(name);
                                if (jx.isObj(v)) {
                                    opts[name] = v;
                                }
                                else {
                                    if (v && v.substring(0, 1) != '{') {
                                        v = '{' + v + '}';
                                    }
                                    opts[name] = (new Function('return ' + v))();
                                }
                            } else if (type === 'jquery') {
                                v = $target.data(name);
                                opts[name] = (new Function('return ' + v))();
                            } else if (type === 'array') {
                                v = $target.data(name);
                                if (jx.isArray(v)) {
                                    opts[name] = v;
                                }
                                else {
                                    if (v && v.substring(0, 1) != '[') {
                                        v = '[' + v + ']';
                                    }
                                    opts[name] = (new Function('return ' + v))();
                                }
                            }
                        }
                    }
                }
                $.extend(options, opts);
            }
            $.extend(true, options, $target.data('jxoptions'));
            return options;
        },

        /**
         * 定义插件
         * @param config
         */
        plugin: function (config) {
            var defs = {
                name: null,//插件名称
                create: null,//创建管理类
                selector: null,//插件选择器
                depend: null,//插件依赖
                auto: true,//自动实例化
                defaults: {},//插件默认值
                options: null,//解析插件选项
                onLoad: null, //加载插件事件
                onInstance: null //实例化插件事件
            };
            if (!config.name) {
                console.error('请指定插件名称');
                console.error(config);
                return;
            }
            if (!config.create) {
                console.error('请指定插件管理类');
                console.error(config);
                return;
            }
            $.extend(defs, config);

            if (!defs.selector) {
                defs.selector = '.' + defs.name;
            }
            if (jx.isUndefined(defs.auto)) {
                defs.auto = true;
            }
            if (!defs.defaults) {
                defs.defaults = {};
            }
            if (!defs.options) {
                defs.options = function (element) {
                    return jx.parseOptions($(element));
                };
            }
            if (!defs.onInstance && defs.auto === true) {
                defs.onInstance = function (e) {
                    $.fn[name].call($(e.target).find(defs.selector));
                };
            }

            var name = defs.name;
            $.fn[name] = function (options) {

                //如果options的类型是字符串，说明是方法调用
                if (typeof options === 'string') {
                    var instance = this.data(name);
                    var funcName = options;
                    if (!$.isFunction(instance[funcName])) {
                        return;
                    }
                    var args = arguments;
                    [].shift.apply(args);
                    if (args && args.length === 0) {
                        return instance[funcName]();
                    } else {
                        return instance[funcName].apply(instance, args);
                    }
                }

                this.each(function () {
                    var $element = $(this);
                    var ops = $.extend(true, {}, $.fn[name].defaults, $.fn[name].options(this), options);
                    var instance = $element.data(name);
                    if (!instance) {
                        instance = defs.create(this, ops || {});
                        if (!instance) {
                            instance = {};
                        }
                        $element.data(name, instance);
                    }
                    else if (options && $.isFunction(instance.setOptions)) {
                        instance.setOptions(options);
                    }
                });
                return this.eq(0).data(name)
            };
            $.fn[name].defaults = defs.defaults;
            $.fn[name].options = defs.options;

            jx.onBeforeInit(function () {
                if (defs.onLoad) {
                    defs.onLoad();
                }
                if (document.querySelector(defs.selector)) {
                    jx.depend(defs.depend);//插件依赖
                    jx.onInit(defs.onInstance);
                }
            });
        },

        extend: function (object) {
            $.extend(this, object);
        },

        /**
         * 注册模块
         * @param mods 模块
         */
        regModules: function (mods) {
            if (mods) {
                mods = mods || {};
                $.extend(modules, mods);
            }
        },

        /**
         * 获取模块对象
         * @returns {{}}
         */
        getModules: function () {
            return modules;
        },

        regCallbacks: function (name, fn) {
            if (!name) {
                alert('请指定回调函数名称:regCallbacks');
                return;
            }
            if (!fn) {
                alert('请指定回调函数:regCallbacks');
                return;
            }

            if (!callbacks[name]) {
                callbacks[name] = [];
            }
            callbacks[name].push(fn);
        },

        getCallbacks: function (name) {
            if (!name) {
                alert('请指定回调函数名称:getCallbacks');
                return;
            }
            return callbacks[name] || [];
        },

        /**
         * 动态加载模块
         * @param deps 依赖的模块字符串
         * @param callback 完成后回调函数
         */
        require: function (deps, callback) {
            var urls = [];
            parseModule(urls, deps);
            if (urls.length > 0) {
                loadRes(urls).then(callback);
            }
            else if (callback) {
                callback();
            }
            return this;
        },

        /**
         * 声明模块依赖
         * @param deps 依赖的模块字符串
         */
        depend: function (deps) {
            if (!deps) return;
            if (jx.isString(deps)) {
                deps = splitString(deps);
            }
            for (var i = 0; i < deps.length; i++) {
                depends.push(deps[i]);
            }
        },

        onBeforeInit: function (callback) {
            if (callback) {
                $(document).on(eventBeforeInit, callback);
            }
        },
        onPreInit: function (callback) {
            if (callback) {
                $(document).on(eventPreInit, callback);
            }
        },
        onInit: function (callback) {
            if (callback) {
                $(document).on(eventInit, callback);
            }
        },
        onAfterInit: function (callback) {
            if (callback) {
                $(document).on(eventAfterInit, callback);
            }
        },

        ready: function (deps, callback) {
            if (jx.isFunc(deps)) {
                callback = deps;
            }
            else {
                jx.depend(deps);
            }
            jx.onPreInit(callback);
        },

        complete: function (deps, callback) {
            if (jx.isFunc(deps)) {
                callback = deps;
            }
            else {
                jx.depend(deps);
            }
            jx.onAfterInit(callback);
        },

        _boot: function () {
            $(function () {
                var $document = $(document);
                $.when($document.triggerHandler(eventBeforeInit)).done(function () {
                    jx.require(depends, function () {
                        $.when($document.triggerHandler(eventPreInit)).done(function () {
                            $.when($document.triggerHandler(eventInit)).done(function () {
                                $('.page-loading').fadeOut("fast", function () {
                                    $(this).remove();
                                });
                                $document.triggerHandler(eventAfterInit);
                            });
                        });
                    });
                });
            });
        }
    };
}();
//endregion

//region jQuery扩展

$.fn.extend({
    animateClass: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        jQuery(this).addClass('animated ' + animationName).one(animationEnd, function () {
            jQuery(this).removeClass('animated ' + animationName);
        });

        if (callback) {
            jQuery(this).one(animationEnd, callback);
        }
    },

    animateDelay: function (value) {
        var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
        for (var i = 0; i < vendors.length; i++) {
            jQuery(this).css(vendors[i] + 'animation-delay', value);
        }
    },

    animateDuration: function (value) {
        var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
        for (var i = 0; i < vendors.length; i++) {
            jQuery(this).css(vendors[i] + 'animation-duration', value);
        }
    },

    /**
     * 闪烁元素
     */
    jxflash: function (speed) {
        if (!speed) {
            speed = 1000;
        }
        var $element = $(this);
        $element.jxunflash();

        function run() {
            $element.css('opacity', '1');
            var flashTimeoutId = setTimeout(function () {
                $element.css('opacity', '0');
            }, speed / 2);
            $element.data('flashTimeoutId', flashTimeoutId);
        }

        var flashIntervalId = setInterval(run, speed);
        $element.data('flashIntervalId', flashIntervalId);
    },

    /**
     * 取消闪烁元素
     */
    jxunflash: function () {
        var $element = $(this);
        var flashIntervalId = $element.data('flashIntervalId');
        if (flashIntervalId) {
            clearInterval(flashIntervalId);
        }
        var flashTimeoutId = $element.data('flashTimeoutId');
        if (flashTimeoutId) {
            clearTimeout(flashTimeoutId);
        }
        $element.css('opacity', '1');
    },

    /**
     * 滑动滚动条到指定元素的位置
     */
    jxscrollTo: function ($target, offset) {
        // if (!speed) {
        //     speed = 'slow';
        // }
        if (!$target) {
            return;
        }
        if (!offset) {
            offset = 0;
        }
        var stop = $target.offset().top - $(this).offset().top + $(this).scrollTop();
        $(this).scrollTop(stop + offset);
        // $(this).animate({
        //     scrollTop: $target.offset().top + offset
        // }, speed);
    },

    /**
     * 是否是指定的标签
     * @param {String} tagName 标签名称
     * @returns {Boolean} 如果是,返回true
     */
    isTag: function (tagName) {
        if (!tagName) return false;
        if (!$(this).prop('tagName')) return false;
        return $(this)[0].tagName.toLowerCase() === tagName.toLowerCase();
    },

    /**
     * 判断当前元素是否已经绑定某个事件
     * @param {String} eventName
     */
    isBind: function (eventName) {
        var _events = $(this).data('events');
        return _events && eventName && _events[eventName];
    },

    onSelect2Select: function (callback) {
        $(this).on('select2:select', callback);
    },

    options: function (ops) {
        if (!ops) return;
        var $this = $(this);
        $this.data('jxoptions', ops);
        return this;
    },

    /**
     * 监视记录布局面板宽度/展开/合上
     * @param {string} region=north|west|east|south 方位
     * @param {string} [name] 模块名称
     */
    monitorLayout: function (region, name) {
        jx.monitorLayoutPanel($(this), region, name);
        return this;
    }
});

//endregion

//region 注册模块

jx.regModules({
    //时间控件
    clockpicker: [
        jx.libDir + 'bootstrap-clockpicker/bootstrap-clockpicker.css',
        jx.libDir + 'bootstrap-clockpicker/bootstrap-clockpicker.js'
    ],
    //日期时间控件
    datetime: [
        jx.libDir + 'bootstrap-datetimepicker/bootstrap-datetimepicker.css',
        jx.libDir + 'bootstrap-datetimepicker/bootstrap-datetimepicker.js'
    ],
    fileinput: [
        jx.libDir + 'bootstrap-fileinput/css/fileinput.css',
        jx.libDir + 'bootstrap-fileinput/fileinput.js',
        jx.libDir + 'bootstrap-fileinput/fileinput_locale_zh.js',
        jx.libDir + 'bootstrap-fileinput/theme.js'
    ],
    sweetalert: [
        jx.libDir + 'bootstrap-sweetalert/sweetalert.css',
        jx.libDir + 'bootstrap-sweetalert/sweetalert.js'
    ],
    switch: [
        jx.libDir + 'bootstrap-switch/bootstrap-switch.css',
        jx.libDir + 'bootstrap-switch/bootstrap-switch.js'
    ],
    //Markdown编辑控件
    editormd: [
        jx.libDir + 'editormd/css/editormd.css',
        jx.libDir + 'editormd/editormd.js'
    ],
    //对称加密算法
    encrypt: jx.libDir + 'jquery/jquery.encrypt.js',
    //md5加密算法
    md5: jx.libDir + 'jquery/jquery.md5.js',
    //文本框输入掩码
    inputmask: jx.libDir + 'jquery/jquery.inputmask.js',
    //颜色控件
    minicolor: [
        jx.libDir + 'jquery-minicolors/jquery-minicolors.css',
        jx.libDir + 'jquery-minicolors/jquery-minicolors.js'
    ],
    //文章编辑控件
    kindeditor: jx.libDir + 'kindeditor/kindeditor.js',
    //jfgrid表格控件
    jfgrid: [
        jx.libDir + 'scrollbar/jquery.mCustomScrollbar.css',
        jx.libDir + 'jfgrid/jfgrid.css',
        jx.libDir + 'scrollbar/jquery.mousewheel.js',
        jx.libDir + 'scrollbar/jquery.mCustomScrollbar.js',
        jx.libDir + 'jfgrid/jfgrid.js'
    ],
    chosen: [
        jx.libDir + 'chosen/chosen.css',
        jx.libDir + 'chosen/chosen.js'
    ],
    echarts: jx.libDir + 'echarts/echarts.js'
});

//endregion

//region 框架核心初始化
jx._boot();
//endregion