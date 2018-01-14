/**
 * 框架核心库
 */

//region 框架核心库

var JX = window.jx = function () {

    //region 私有变量

    var eventBeforeInit = 'jx_eventBeforeInit',
        eventInit = 'jx_eventInit',
        eventAfterInit = 'jx_eventAfterInit',
        libPath = 'lib/', basePath = '',
        isDebug = false,
        loaded = [], promise = false, deferred = $.Deferred(), modules = {},
        depends = [], isready = false, callbacks = {};

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

    /**
     * 获取框架参数
     */
    var getBasePath = function () {
        var jsPath = document.currentScript ? document.currentScript.src : function () {
            var js = document.scripts
                , last = js.length - 1
                , src;
            for (var i = last; i > 0; i--) {
                if (js[i].readyState === 'interactive') {
                    src = js[i].src;
                    break;
                }
            }
            return src || js[last].src;
        }();
        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1) + libPath;
    };

    /**
     * 加载js
     */
    var loadJS = function (url) {
        if (loaded[url]) return loaded[url].promise();

        var _url = url;
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

        var _url = url;
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
                urls.push(basePath + _u);
            }
        }
    };

    //endregion

    //region 初始化

    basePath = getBasePath();
    isDebug = document.currentScript.dataset.debug === 'true' || false;

    //endregion

    return {
        version: '1.0.1',
        isReady: isready,
        debug: isDebug,
        basePath: basePath,
        app: top.App,

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
                var name = $(this).attr('name');
                obj[name] = $(this).attr('value');
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

        /**
         * 转为布尔
         * @param str
         */
        toBoolean: function (str) {
            if (!str) return false;
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
         * 解析选项, 包括属性 data-options'.
         *
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

        plugin: function (config) {
            var name = config.name;
            if (!config['instance']) {
                alert('请指定创建插件实例函数');
                return;
            }

            /**
             * 插件定义
             * @param options 配置选项
             */
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

                return this.each(function () {
                    var $element = $(this);
                    var instance = $element.data(name);
                    if (!instance) {
                        var ops = $.extend(true, {}, $.fn[name].defaults, $.fn[name].parseOptions($element), options);
                        instance = config['instance']($element, ops);
                        $element.data(name, instance);
                    }
                });
            };

            /**
             * 解析配置选项
             * @param {jQuery} $element 目标对象
             * @returns {object} 返回插件配置选项
             */
            $.fn[name].parseOptions = function ($element) {
                return jx.parseOptions($element);
            };
            if (config.options) {
                $.fn[name].parseOptions = config.options;
            }

            /**
             * 插件默认值配置选项
             */
            $.fn[name].defaults = {};
            if (config.defaults) {
                $.fn[name].defaults = config.defaults;
            }

        },

        /**
         * body fadeIn
         */
        bodyFadeIn: function (speed) {
            $(document.body).fadeIn(speed || 100);
        },

        extend: function (object) {
            $.extend(this, object);
        },

        /**
         * 注册模块
         */
        regModules: function (mods) {
            if (mods) {
                mods = mods || {};
                $.extend(modules, mods);
            }
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
            $(document).on(eventBeforeInit, callback);
        },
        onInit: function (callback) {
            $(document).on(eventInit, callback);
        },
        onAfterInit: function (callback) {
            $(document).on(eventAfterInit, callback);
        },

        ready: function (deps, callback) {
            if (isready === true) return;
            isready = true;

            var $doc = $(document);
            $(function () {
                jx.depend(deps);
                $doc.triggerHandler(eventBeforeInit);
                jx.require(depends, function () {
                    if (jx.isFunc(deps)) {
                        callback = deps;
                    }
                    if (callback) {
                        callback();
                    }
                    $.when($doc.triggerHandler(eventInit)).done(function () {
                        $doc.triggerHandler(eventAfterInit);
                    });
                });
            });
        }
    }
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

    jxoptions: function (ops) {
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
    //动画库
    animate: 'animate/animate.css',
    //时间控件
    clockpicker: [
        'bootstrap-clockpicker/bootstrap-clockpicker.css',
        'bootstrap-clockpicker/bootstrap-clockpicker.js'
    ],
    //日期时间控件
    datetime: [
        'bootstrap-datetimepicker/bootstrap-datetimepicker.css',
        'bootstrap-datetimepicker/bootstrap-datetimepicker.js'
    ],
    fileinput: [
        'bootstrap-fileinput/css/fileinput.css',
        'bootstrap-fileinput/fileinput.js',
        'bootstrap-fileinput/fileinput_locale_zh.js',
        'bootstrap-fileinput/theme.js'
    ],
    sweetalert: [
        'bootstrap-sweetalert/sweetalert.css',
        'bootstrap-sweetalert/sweetalert.js'
    ],
    switch: [
        'bootstrap-switch/bootstrap-switch.css',
        'bootstrap-switch/bootstrap-switch.js'
    ],
    touchspin: [
        'bootstrap-touchspin/bootstrap-touchspin.css',
        'bootstrap-touchspin/bootstrap-touchspin.js'
    ],
    icheck: [
        'icheck/flat/flat.css',
        'icheck/icheck.js'
    ],
    //树形表格控件
    treegrid: [
        'easyui/css/datagrid.css',
        'easyui/js/datagrid.js',
        'easyui/js/treegrid.js'
    ],
    //Markdown编辑控件
    editormd: [
        'editormd/css/editormd.css',
        'editormd/editormd.js'
    ],
    //对称加密算法
    encrypt: 'jquery/jquery.encrypt.js',
    //md5加密算法
    md5: 'jquery/jquery.md5.js',
    //文本框输入掩码
    inputmask: 'jquery/jquery.inputmask.js',
    //颜色控件
    minicolor: [
        'jquery-minicolors/jquery-minicolors.css',
        'jquery-minicolors/jquery-minicolors.js'
    ],
    //文章编辑控件
    kindeditor: 'kindeditor/kindeditor.js',
    //下拉选择控件
    select2: [
        'select2/select2.css',
        'select2/select2.js'
    ],
    //向导控件
    wizard: [
        'wizard/wizard.css',
        'wizard/wizard.js'
    ]
});

//endregion

//region 框架核心初始化

$(window).on('load', function () {
    JX.ready();
});

jx.onInit(function (e) {

    var $target = $(e.target);

    //region bootstrapSwitch

    if ($().bootstrapSwitch) {
        $target.find('.jxswitch').bootstrapSwitch();
    }

    //endregion

    //region maxlength

    if ($().maxlength) {
        $target.find('input[maxlength]').maxlength();
    }

    //endregion

    // //region mCustomScrollbar
    // if ($().mCustomScrollbar) {
    //     $target.find('.jxscroll').mCustomScrollbar({
    //         theme: 'minimal-dark'
    //     });
    // }
    // //endregion

    //region tooltip

    if ($().tooltip) {
        $target.find('[data-toggle="tooltip"]').tooltip({
            placement: 'bottom'
        });
    }

    //endregion

    //region fileupload
    if ($().fileinput) {
        $target.find('.uifileupload').each(function () {
            var ops = {
                language: 'zh',
                showCaption: true,
                showRemove: false,
                showUpload: false,
                showPreview: false,
                showClose: false,
                uploadAsync: false
            };
            $(this).fileinput(ops);
        });
    }
    //endregion

    //region scroller
    if ($().slimScroll) {
        $target.find('.scroller').each(function () {
            if ($(this).attr('data-initialized')) {
                return; // exit
            }

            var height;

            if ($(this).attr('data-height')) {
                height = $(this).attr('data-height');
            } else {
                height = $(this).css('height');
            }

            $(this).slimScroll({
                allowPageScroll: true, // allow page scroll when the element scroll is ended
                size: '7px',
                color: ($(this).attr('data-handle-color') ? $(this).attr('data-handle-color') : '#bbb'),
                wrapperClass: ($(this).attr('data-wrapper-class') ? $(this).attr('data-wrapper-class') : 'slimScrollDiv'),
                railColor: ($(this).attr('data-rail-color') ? $(this).attr('data-rail-color') : '#eaeaea'),
                position: 'right',
                height: height,
                alwaysVisible: ($(this).attr('data-always-visible') == '1' ? true : false),
                railVisible: ($(this).attr('data-rail-visible') == '1' ? true : false),
                disableFadeOut: true
            });

            $(this).attr('data-initialized', '1');
        });
    }
    //endregion

    //region TouchSpin
    if ($().TouchSpin) {
        $target.find('.jxspin').TouchSpin();
    }
    //endregion

    //region icheck
    if ($().iCheck) {
        $target.find('.jxicheck').each(function () {
            var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_flat-red';
            var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_flat-red';

            $(this).iCheck({
                checkboxClass: checkboxClass,
                radioClass: radioClass
            });
        });
    }
    //endregion
});

//endregion