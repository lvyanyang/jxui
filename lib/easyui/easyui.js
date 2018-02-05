/**
 * EasyUI for jQuery 1.5.3
 */

//parser.js
(function($){
    $.easyui = {
        /**
         * Get the index of array item, return -1 when the item is not found.
         */
        indexOfArray: function(a, o, id){
            for(var i=0,len=a.length; i<len; i++){
                if (id == undefined){
                    if (a[i] == o){return i;}
                } else {
                    if (a[i][o] == id){return i;}
                }
            }
            return -1;
        },
        /**
         * Remove array item, 'o' parameter can be item object or id field name.
         * When 'o' parameter is the id field name, the 'id' parameter is valid.
         */
        removeArrayItem: function(a, o, id){
            if (typeof o == 'string'){
                for(var i=0,len=a.length; i<len; i++){
                    if (a[i][o] == id){
                        a.splice(i, 1);
                        return;
                    }
                }
            } else {
                var index = this.indexOfArray(a,o);
                if (index != -1){
                    a.splice(index, 1);
                }
            }
        },
        /**
         * Add un-duplicate array item, 'o' parameter is the id field name, if the 'r' object is exists, deny the action.
         */
        addArrayItem: function(a, o, r){
            var index = this.indexOfArray(a, o, r ? r[o] : undefined);
            if (index == -1){
                a.push(r ? r : o);
            } else {
                a[index] = r ? r : o;
            }
        },
        getArrayItem: function(a, o, id){
            var index = this.indexOfArray(a, o, id);
            return index==-1 ? null : a[index];
        },
        forEach: function(data, deep, callback){
            var nodes = [];
            for(var i=0; i<data.length; i++){
                nodes.push(data[i]);
            }
            while(nodes.length){
                var node = nodes.shift();
                if (callback(node) == false){return;}
                if (deep && node.children){
                    for(var i=node.children.length-1; i>=0; i--){
                        nodes.unshift(node.children[i]);
                    }
                }
            }
        }
    };

    $.parser = {
        auto: true,
        onComplete: function(context){},
        plugins:['draggable','droppable','resizable',
            'tree','tagbox','numberbox','validatebox','searchbox',
            'layout','panel','datagrid','propertygrid','treegrid','datalist'
        ],
        parse: function(context){
            var aa = [];
            for(var i=0; i<$.parser.plugins.length; i++){
                var name = $.parser.plugins[i];
                var r = $('.easyui-' + name, context);
                if (r.length){
                    if (r[name]){
                        r.each(function(){
                            $(this)[name]($.data(this, 'options')||{});
                        });
                    } else {
                        aa.push({name:name,jq:r});
                    }
                }
            }
            if (aa.length && window.easyloader){
                var names = [];
                for(var i=0; i<aa.length; i++){
                    names.push(aa[i].name);
                }
                easyloader.load(names, function(){
                    for(var i=0; i<aa.length; i++){
                        var name = aa[i].name;
                        var jq = aa[i].jq;
                        jq.each(function(){
                            $(this)[name]($.data(this, 'options')||{});
                        });
                    }
                    $.parser.onComplete.call($.parser, context);
                });
            } else {
                $.parser.onComplete.call($.parser, context);
            }
        },

        parseValue: function(property, value, parent, delta){
            delta = delta || 0;
            var v = $.trim(String(value||''));
            var endchar = v.substr(v.length-1, 1);
            if (endchar == '%'){
                v = parseFloat(v.substr(0, v.length-1));
                if (property.toLowerCase().indexOf('width') >= 0){
                    v = Math.floor((parent.width()-delta) * v / 100.0);
                } else {
                    v = Math.floor((parent.height()-delta) * v / 100.0);
                }
            } else {
                v = parseInt(v) || undefined;
            }
            return v;
        },

        /**
         * parse options, including standard 'data-options' attribute.
         *
         * calling examples:
         * $.parser.parseOptions(target);
         * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
         */
        parseOptions: function(target, properties){
            var t = $(target);
            var options = {};

            var s = $.trim(t.attr('data-options'));
            if (s){
                if (s.substring(0, 1) != '{'){
                    s = '{' + s + '}';
                }
                options = (new Function('return ' + s))();
            }
            $.map(['width','height','left','top','minWidth','maxWidth','minHeight','maxHeight'], function(p){
                var pv = $.trim(target.style[p] || '');
                if (pv){
                    if (pv.indexOf('%') == -1){
                        pv = parseInt(pv);
                        if (isNaN(pv)){
                            pv = undefined;
                        }
                    }
                    options[p] = pv;
                }
            });

            if (properties){
                var opts = {};
                for(var i=0; i<properties.length; i++){
                    var pp = properties[i];
                    if (typeof pp == 'string'){
                        opts[pp] = t.attr(pp);
                    } else {
                        for(var name in pp){
                            var type = pp[name];
                            if (type == 'boolean'){
                                opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
                            } else if (type == 'number'){
                                opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
                            }
                        }
                    }
                }
                $.extend(options, opts);
            }
            return options;
        }
    };
    $(function(){
        var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
        $._boxModel = d.outerWidth()!=100;
        d.remove();
        d = $('<div style="position:fixed"></div>').appendTo('body');
        $._positionFixed = (d.css('position') == 'fixed');
        d.remove();

        if (!window.easyloader && $.parser.auto){
            $.parser.parse();
        }
    });

    /**
     * extend plugin to set box model width
     */
    $.fn._outerWidth = function(width){
        if (width == undefined){
            if (this[0] == window){
                return this.width() || document.body.clientWidth;
            }
            return this.outerWidth()||0;
        }
        return this._size('width', width);
    };

    /**
     * extend plugin to set box model height
     */
    $.fn._outerHeight = function(height){
        if (height == undefined){
            if (this[0] == window){
                return this.height() || document.body.clientHeight;
            }
            return this.outerHeight()||0;
        }
        return this._size('height', height);
    };

    $.fn._scrollLeft = function(left){
        if (left == undefined){
            return this.scrollLeft();
        } else {
            return this.each(function(){$(this).scrollLeft(left)});
        }
    };

    $.fn._propAttr = $.fn.prop || $.fn.attr;

    $.fn._size = function(options, parent){
        if (typeof options == 'string'){
            if (options == 'clear'){
                return this.each(function(){
                    $(this).css({width:'',minWidth:'',maxWidth:'',height:'',minHeight:'',maxHeight:''});
                });
            } else if (options == 'fit'){
                return this.each(function(){
                    _fit(this, this.tagName=='BODY' ? $('body') : $(this).parent(), true);
                });
            } else if (options == 'unfit'){
                return this.each(function(){
                    _fit(this, $(this).parent(), false);
                });
            } else {
                if (parent == undefined){
                    return _css(this[0], options);
                } else {
                    return this.each(function(){
                        _css(this, options, parent);
                    });
                }
            }
        } else {
            return this.each(function(){
                parent = parent || $(this).parent();
                $.extend(options, _fit(this, parent, options.fit)||{});
                var r1 = _setSize(this, 'width', parent, options);
                var r2 = _setSize(this, 'height', parent, options);
                if (r1 || r2){
                    $(this).addClass('easyui-fluid');
                } else {
                    $(this).removeClass('easyui-fluid');
                }
            });
        }

        function _fit(target, parent, fit){
            if (!parent.length){return false;}
            var t = $(target)[0];
            var p = parent[0];
            var fcount = p.fcount || 0;
            if (fit){
                if (!t.fitted){
                    t.fitted = true;
                    p.fcount = fcount + 1;
                    $(p).addClass('panel-noscroll');
                    if (p.tagName == 'BODY'){
                        $('html').addClass('panel-fit');
                    }
                }
                return {
                    width: ($(p).width()||1),
                    height: ($(p).height()||1)
                };
            } else {
                if (t.fitted){
                    t.fitted = false;
                    p.fcount = fcount - 1;
                    if (p.fcount == 0){
                        $(p).removeClass('panel-noscroll');
                        if (p.tagName == 'BODY'){
                            $('html').removeClass('panel-fit');
                        }
                    }
                }
                return false;
            }
        }
        function _setSize(target, property, parent, options){
            var t = $(target);
            var p = property;
            var p1 = p.substr(0,1).toUpperCase() + p.substr(1);
            var min = $.parser.parseValue('min'+p1, options['min'+p1], parent);// || 0;
            var max = $.parser.parseValue('max'+p1, options['max'+p1], parent);// || 99999;
            var val = $.parser.parseValue(p, options[p], parent);
            var fluid = (String(options[p]||'').indexOf('%') >= 0 ? true : false);

            if (!isNaN(val)){
                var v = Math.min(Math.max(val, min||0), max||99999);
                if (!fluid){
                    options[p] = v;
                }
                t._size('min'+p1, '');
                t._size('max'+p1, '');
                t._size(p, v);
            } else {
                t._size(p, '');
                t._size('min'+p1, min);
                t._size('max'+p1, max);
            }
            return fluid || options.fit;
        }
        function _css(target, property, value){
            var t = $(target);
            if (value == undefined){
                value = parseInt(target.style[property]);
                if (isNaN(value)){return undefined;}
                if ($._boxModel){
                    value += getDeltaSize();
                }
                return value;
            } else if (value === ''){
                t.css(property, '');
            } else {
                if ($._boxModel){
                    value -= getDeltaSize();
                    if (value < 0){value = 0;}
                }
                t.css(property, value+'px');
            }
            function getDeltaSize(){
                if (property.toLowerCase().indexOf('width') >= 0){
                    return t.outerWidth() - t.width();
                } else {
                    return t.outerHeight() - t.height();
                }
            }
        }
    };

})(jQuery);

//resizable.js
(function($){
    function resize(e){
        var resizeData = e.data;
        var options = $.data(resizeData.target, 'resizable').options;
        if (resizeData.dir.indexOf('e') != -1) {
            var width = resizeData.startWidth + e.pageX - resizeData.startX;
            width = Math.min(
                Math.max(width, options.minWidth),
                options.maxWidth
            );
            resizeData.width = width;
        }
        if (resizeData.dir.indexOf('s') != -1) {
            var height = resizeData.startHeight + e.pageY - resizeData.startY;
            height = Math.min(
                Math.max(height, options.minHeight),
                options.maxHeight
            );
            resizeData.height = height;
        }
        if (resizeData.dir.indexOf('w') != -1) {
            var width = resizeData.startWidth - e.pageX + resizeData.startX;
            width = Math.min(
                Math.max(width, options.minWidth),
                options.maxWidth
            );
            resizeData.width = width;
            resizeData.left = resizeData.startLeft + resizeData.startWidth - resizeData.width;
        }
        if (resizeData.dir.indexOf('n') != -1) {
            var height = resizeData.startHeight - e.pageY + resizeData.startY;
            height = Math.min(
                Math.max(height, options.minHeight),
                options.maxHeight
            );
            resizeData.height = height;
            resizeData.top = resizeData.startTop + resizeData.startHeight - resizeData.height;
        }
    }

    function applySize(e){
        var resizeData = e.data;
        var t = $(resizeData.target);
        t.css({
            left: resizeData.left,
            top: resizeData.top
        });
        if (t.outerWidth() != resizeData.width){t._outerWidth(resizeData.width)}
        if (t.outerHeight() != resizeData.height){t._outerHeight(resizeData.height)}
    }

    function doDown(e){
        $.fn.resizable.isResizing = true;
        $.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
        return false;
    }

    function doMove(e){
        resize(e);
        if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
            applySize(e)
        }
        return false;
    }

    function doUp(e){
        $.fn.resizable.isResizing = false;
        resize(e, true);
        applySize(e);
        $.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
        $(document).unbind('.resizable');
        $('body').css('cursor','');
        return false;
    }

    // get the resize direction
    function getDirection(e) {
        var opts = $(e.data.target).resizable('options');
        var tt = $(e.data.target);
        var dir = '';
        var offset = tt.offset();
        var width = tt.outerWidth();
        var height = tt.outerHeight();
        var edge = opts.edge;
        if (e.pageY > offset.top && e.pageY < offset.top + edge) {
            dir += 'n';
        } else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
            dir += 's';
        }
        if (e.pageX > offset.left && e.pageX < offset.left + edge) {
            dir += 'w';
        } else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
            dir += 'e';
        }

        var handles = opts.handles.split(',');
        handles = $.map(handles, function(h){return $.trim(h).toLowerCase();});
        if ($.inArray('all', handles) >= 0 || $.inArray(dir, handles) >= 0){
            return dir;
        }
        for(var i=0; i<dir.length; i++){
            var index = $.inArray(dir.substr(i,1), handles);
            if (index >= 0){
                return handles[index];
            }
        }
        return '';
    }

    $.fn.resizable = function(options, param){
        if (typeof options == 'string'){
            return $.fn.resizable.methods[options](this, param);
        }

        return this.each(function(){
            var opts = null;
            var state = $.data(this, 'resizable');
            if (state) {
                $(this).unbind('.resizable');
                opts = $.extend(state.options, options || {});
            } else {
                opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
                $.data(this, 'resizable', {
                    options:opts
                });
            }

            if (opts.disabled == true) {
                return;
            }
            $(this).bind('mousemove.resizable', {target:this}, function(e){
                if ($.fn.resizable.isResizing){return}
                var dir = getDirection(e);
                $(e.data.target).css('cursor', dir ? dir+'-resize' : '');
            }).bind('mouseleave.resizable', {target:this}, function(e){
                $(e.data.target).css('cursor', '');
            }).bind('mousedown.resizable', {target:this}, function(e){
                var dir = getDirection(e);
                if (dir == ''){return;}

                function getCssValue(css) {
                    var val = parseInt($(e.data.target).css(css));
                    if (isNaN(val)) {
                        return 0;
                    } else {
                        return val;
                    }
                }

                var data = {
                    target: e.data.target,
                    dir: dir,
                    startLeft: getCssValue('left'),
                    startTop: getCssValue('top'),
                    left: getCssValue('left'),
                    top: getCssValue('top'),
                    startX: e.pageX,
                    startY: e.pageY,
                    startWidth: $(e.data.target).outerWidth(),
                    startHeight: $(e.data.target).outerHeight(),
                    width: $(e.data.target).outerWidth(),
                    height: $(e.data.target).outerHeight(),
                    deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
                    deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
                };
                $(document).bind('mousedown.resizable', data, doDown);
                $(document).bind('mousemove.resizable', data, doMove);
                $(document).bind('mouseup.resizable', data, doUp);
                $('body').css('cursor', dir+'-resize');
            });
        });
    };

    $.fn.resizable.methods = {
        options: function(jq){
            return $.data(jq[0], 'resizable').options;
        },
        enable: function(jq){
            return jq.each(function(){
                $(this).resizable({disabled:false});
            });
        },
        disable: function(jq){
            return jq.each(function(){
                $(this).resizable({disabled:true});
            });
        }
    };

    $.fn.resizable.parseOptions = function(target){
        var t = $(target);
        return $.extend({},
            $.parser.parseOptions(target, [
                'handles',{minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number',edge:'number'}
            ]), {
                disabled: (t.attr('disabled') ? true : undefined)
            })
    };

    $.fn.resizable.defaults = {
        disabled:false,
        handles:'n, e, s, w, ne, se, sw, nw, all',
        minWidth: 10,
        minHeight: 10,
        maxWidth: 10000,//$(document).width(),
        maxHeight: 10000,//$(document).height(),
        edge:5,
        onStartResize: function(e){},
        onResize: function(e){},
        onStopResize: function(e){}
    };

    $.fn.resizable.isResizing = false;

})(jQuery);

// draggable.js
(function($){
    function drag(e){
        var state = $.data(e.data.target, 'draggable');
        var opts = state.options;
        var proxy = state.proxy;

        var dragData = e.data;
        var left = dragData.startLeft + e.pageX - dragData.startX;
        var top = dragData.startTop + e.pageY - dragData.startY;

        if (proxy){
            if (proxy.parent()[0] == document.body){
                if (opts.deltaX != null && opts.deltaX != undefined){
                    left = e.pageX + opts.deltaX;
                } else {
                    left = e.pageX - e.data.offsetWidth;
                }
                if (opts.deltaY != null && opts.deltaY != undefined){
                    top = e.pageY + opts.deltaY;
                } else {
                    top = e.pageY - e.data.offsetHeight;
                }
            } else {
                if (opts.deltaX != null && opts.deltaX != undefined){
                    left += e.data.offsetWidth + opts.deltaX;
                }
                if (opts.deltaY != null && opts.deltaY != undefined){
                    top += e.data.offsetHeight + opts.deltaY;
                }
            }
        }

        if (e.data.parent != document.body) {
            left += $(e.data.parent).scrollLeft();
            top += $(e.data.parent).scrollTop();
        }

        if (opts.axis == 'h') {
            dragData.left = left;
        } else if (opts.axis == 'v') {
            dragData.top = top;
        } else {
            dragData.left = left;
            dragData.top = top;
        }
    }

    function applyDrag(e){
        var state = $.data(e.data.target, 'draggable');
        var opts = state.options;
        var proxy = state.proxy;
        if (!proxy){
            proxy = $(e.data.target);
        }
        proxy.css({
            left:e.data.left,
            top:e.data.top
        });
        $('body').css('cursor', opts.cursor);
    }

    function doDown(e){
        if (!$.fn.draggable.isDragging){return false;}

        var state = $.data(e.data.target, 'draggable');
        var opts = state.options;

        var droppables = $('.droppable:visible').filter(function(){
            return e.data.target != this;
        }).filter(function(){
            var accept = $.data(this, 'droppable').options.accept;
            if (accept){
                return $(accept).filter(function(){
                    return this == e.data.target;
                }).length > 0;
            } else {
                return true;
            }
        });
        state.droppables = droppables;

        var proxy = state.proxy;
        if (!proxy){
            if (opts.proxy){
                if (opts.proxy == 'clone'){
                    proxy = $(e.data.target).clone().insertAfter(e.data.target);
                } else {
                    proxy = opts.proxy.call(e.data.target, e.data.target);
                }
                state.proxy = proxy;
            } else {
                proxy = $(e.data.target);
            }
        }

        proxy.css('position', 'absolute');
        drag(e);
        applyDrag(e);

        opts.onStartDrag.call(e.data.target, e);
        return false;
    }

    function doMove(e){
        if (!$.fn.draggable.isDragging){return false;}

        var state = $.data(e.data.target, 'draggable');
        drag(e);
        if (state.options.onDrag.call(e.data.target, e) != false){
            applyDrag(e);
        }

        var source = e.data.target;
        state.droppables.each(function(){
            var dropObj = $(this);
            if (dropObj.droppable('options').disabled){return;}

            var p2 = dropObj.offset();
            if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
                && e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
                if (!this.entered){
                    $(this).trigger('_dragenter', [source]);
                    this.entered = true;
                }
                $(this).trigger('_dragover', [source]);
            } else {
                if (this.entered){
                    $(this).trigger('_dragleave', [source]);
                    this.entered = false;
                }
            }
        });

        return false;
    }

    function doUp(e){
        if (!$.fn.draggable.isDragging){
            clearDragging();
            return false;
        }

        doMove(e);

        var state = $.data(e.data.target, 'draggable');
        var proxy = state.proxy;
        var opts = state.options;
        opts.onEndDrag.call(e.data.target, e);
        if (opts.revert){
            if (checkDrop() == true){
                $(e.data.target).css({
                    position:e.data.startPosition,
                    left:e.data.startLeft,
                    top:e.data.startTop
                });
            } else {
                if (proxy){
                    var left, top;
                    if (proxy.parent()[0] == document.body){
                        left = e.data.startX - e.data.offsetWidth;
                        top = e.data.startY - e.data.offsetHeight;
                    } else {
                        left = e.data.startLeft;
                        top = e.data.startTop;
                    }
                    proxy.animate({
                        left: left,
                        top: top
                    }, function(){
                        removeProxy();
                    });
                } else {
                    $(e.data.target).animate({
                        left:e.data.startLeft,
                        top:e.data.startTop
                    }, function(){
                        $(e.data.target).css('position', e.data.startPosition);
                    });
                }
            }
        } else {
            $(e.data.target).css({
                position:'absolute',
                left:e.data.left,
                top:e.data.top
            });
            checkDrop();
        }

        opts.onStopDrag.call(e.data.target, e);

        clearDragging();

        function removeProxy(){
            if (proxy){
                proxy.remove();
            }
            state.proxy = null;
        }

        function checkDrop(){
            var dropped = false;
            state.droppables.each(function(){
                var dropObj = $(this);
                if (dropObj.droppable('options').disabled){return;}

                var p2 = dropObj.offset();
                if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
                    && e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
                    if (opts.revert){
                        $(e.data.target).css({
                            position:e.data.startPosition,
                            left:e.data.startLeft,
                            top:e.data.startTop
                        });
                    }
                    $(this).triggerHandler('_drop', [e.data.target]);
                    removeProxy();
                    dropped = true;
                    this.entered = false;
                    return false;
                }
            });
            if (!dropped && !opts.revert){
                removeProxy();
            }
            return dropped;
        }

        return false;
    }

    function clearDragging(){
        if ($.fn.draggable.timer){
            clearTimeout($.fn.draggable.timer);
            $.fn.draggable.timer = undefined;
        }
        $(document).unbind('.draggable');
        $.fn.draggable.isDragging = false;
        setTimeout(function(){
            $('body').css('cursor','');
        },100);
    }

    $.fn.draggable = function(options, param){
        if (typeof options == 'string'){
            return $.fn.draggable.methods[options](this, param);
        }

        return this.each(function(){
            var opts;
            var state = $.data(this, 'draggable');
            if (state) {
                state.handle.unbind('.draggable');
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.draggable.defaults, $.fn.draggable.parseOptions(this), options || {});
            }
            var handle = opts.handle ? (typeof opts.handle=='string' ? $(opts.handle, this) : opts.handle) : $(this);

            $.data(this, 'draggable', {
                options: opts,
                handle: handle
            });

            if (opts.disabled) {
                $(this).css('cursor', '');
                return;
            }

            handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
                if ($.fn.draggable.isDragging){return}
                var opts = $.data(e.data.target, 'draggable').options;
                if (checkArea(e)){
                    $(this).css('cursor', opts.cursor);
                } else {
                    $(this).css('cursor', '');
                }
            }).bind('mouseleave.draggable', {target:this}, function(e){
                $(this).css('cursor', '');
            }).bind('mousedown.draggable', {target:this}, function(e){
                if (checkArea(e) == false) return;
                $(this).css('cursor', '');

                var position = $(e.data.target).position();
                var offset = $(e.data.target).offset();
                var data = {
                    startPosition: $(e.data.target).css('position'),
                    startLeft: position.left,
                    startTop: position.top,
                    left: position.left,
                    top: position.top,
                    startX: e.pageX,
                    startY: e.pageY,
                    width: $(e.data.target).outerWidth(),
                    height: $(e.data.target).outerHeight(),
                    offsetWidth: (e.pageX - offset.left),
                    offsetHeight: (e.pageY - offset.top),
                    target: e.data.target,
                    parent: $(e.data.target).parent()[0]
                };

                $.extend(e.data, data);
                var opts = $.data(e.data.target, 'draggable').options;
                if (opts.onBeforeDrag.call(e.data.target, e) == false) return;

                $(document).bind('mousedown.draggable', e.data, doDown);
                $(document).bind('mousemove.draggable', e.data, doMove);
                $(document).bind('mouseup.draggable', e.data, doUp);

                $.fn.draggable.timer = setTimeout(function(){
                    $.fn.draggable.isDragging = true;
                    doDown(e);
                }, opts.delay);
                return false;
            });

            // check if the handle can be dragged
            function checkArea(e) {
                var state = $.data(e.data.target, 'draggable');
                var handle = state.handle;
                var offset = $(handle).offset();
                var width = $(handle).outerWidth();
                var height = $(handle).outerHeight();
                var t = e.pageY - offset.top;
                var r = offset.left + width - e.pageX;
                var b = offset.top + height - e.pageY;
                var l = e.pageX - offset.left;

                return Math.min(t,r,b,l) > state.options.edge;
            }

        });
    };

    $.fn.draggable.methods = {
        options: function(jq){
            return $.data(jq[0], 'draggable').options;
        },
        proxy: function(jq){
            return $.data(jq[0], 'draggable').proxy;
        },
        enable: function(jq){
            return jq.each(function(){
                $(this).draggable({disabled:false});
            });
        },
        disable: function(jq){
            return jq.each(function(){
                $(this).draggable({disabled:true});
            });
        }
    };

    $.fn.draggable.parseOptions = function(target){
        var t = $(target);
        return $.extend({},
            $.parser.parseOptions(target, ['cursor','handle','axis',
                {'revert':'boolean','deltaX':'number','deltaY':'number','edge':'number','delay':'number'}]), {
                disabled: (t.attr('disabled') ? true : undefined)
            });
    };

    $.fn.draggable.defaults = {
        proxy:null,	// 'clone' or a function that will create the proxy object,
                       // the function has the source parameter that indicate the source object dragged.
        revert:false,
        cursor:'move',
        deltaX:null,
        deltaY:null,
        handle: null,
        disabled: false,
        edge:0,
        axis:null,	// v or h
        delay:100,

        onBeforeDrag: function(e){},
        onStartDrag: function(e){},
        onDrag: function(e){},
        onEndDrag: function(e){},
        onStopDrag: function(e){}
    };

    $.fn.draggable.isDragging = false;

})(jQuery);

// droppable.js
(function($){
    function init(target){
        $(target).addClass('droppable');
        $(target).bind('_dragenter', function(e, source){
            $.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
        });
        $(target).bind('_dragleave', function(e, source){
            $.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
        });
        $(target).bind('_dragover', function(e, source){
            $.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
        });
        $(target).bind('_drop', function(e, source){
            $.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
        });
    }

    $.fn.droppable = function(options, param){
        if (typeof options == 'string'){
            return $.fn.droppable.methods[options](this, param);
        }

        options = options || {};
        return this.each(function(){
            var state = $.data(this, 'droppable');
            if (state){
                $.extend(state.options, options);
            } else {
                init(this);
                $.data(this, 'droppable', {
                    options: $.extend({}, $.fn.droppable.defaults, $.fn.droppable.parseOptions(this), options)
                });
            }
        });
    };

    $.fn.droppable.methods = {
        options: function(jq){
            return $.data(jq[0], 'droppable').options;
        },
        enable: function(jq){
            return jq.each(function(){
                $(this).droppable({disabled:false});
            });
        },
        disable: function(jq){
            return jq.each(function(){
                $(this).droppable({disabled:true});
            });
        }
    };

    $.fn.droppable.parseOptions = function(target){
        var t = $(target);
        return $.extend({},	$.parser.parseOptions(target, ['accept']), {
            disabled: (t.attr('disabled') ? true : undefined)
        });
    };

    $.fn.droppable.defaults = {
        accept:null,
        disabled:false,
        onDragEnter:function(e, source){},
        onDragOver:function(e, source){},
        onDragLeave:function(e, source){},
        onDrop:function(e, source){}
    };
})(jQuery);

//panel.js
(function($){
    $.fn._remove=function(){
        return this.each(function(){
            $(this).remove();
            try{
                this.outerHTML="";
            }
            catch(err){
            }
        });
    };
    function _1(_2){
        _2._remove();
    };
    function _3(_4,_5){
        var _6=$.data(_4,"panel");
        var _7=_6.options;
        var _8=_6.panel;
        var _9=_8.children(".panel-header");
        var _a=_8.children(".panelx-body");
        var _b=_8.children(".panel-footer");
        var _c=(_7.halign=="left"||_7.halign=="right");
        if(_5){
            $.extend(_7,{width:_5.width,height:_5.height,minWidth:_5.minWidth,maxWidth:_5.maxWidth,minHeight:_5.minHeight,maxHeight:_5.maxHeight,left:_5.left,top:_5.top});
        }
        _8._size(_7);
        if(!_c){
            _9._outerWidth(_8.width());
        }
        _a._outerWidth(_8.width());
        if(!isNaN(parseInt(_7.height))){
            if(_c){
                if(_7.header){
                    var _d=$(_7.header)._outerWidth();
                }else{
                    _9.css("width","");
                    var _d=_9._outerWidth();
                }
                var _e=_9.find(".panel-title");
                _d+=Math.min(_e._outerWidth(),_e._outerHeight());
                var _f=_8.height();
                _9._outerWidth(_d)._outerHeight(_f);
                _e._outerWidth(_9.height());
                _a._outerWidth(_8.width()-_d-_b._outerWidth())._outerHeight(_f);
                _b._outerHeight(_f);
                _a.css({left:"",right:""}).css(_7.halign,(_9.position()[_7.halign]+_d)+"px");
                _7.panelCssWidth=_8.css("width");
                if(_7.collapsed){
                    _8._outerWidth(_d+_b._outerWidth());
                }
            }else{
                _a._outerHeight(_8.height()-_9._outerHeight()-_b._outerHeight());
            }
        }else{
            _a.css("height","");
            var min=$.parser.parseValue("minHeight",_7.minHeight,_8.parent());
            var max=$.parser.parseValue("maxHeight",_7.maxHeight,_8.parent());
            var _10=_9._outerHeight()+_b._outerHeight()+_8._outerHeight()-_8.height();
            _a._size("minHeight",min?(min-_10):"");
            _a._size("maxHeight",max?(max-_10):"");
        }
        _8.css({height:(_c?undefined:""),minHeight:"",maxHeight:"",left:_7.left,top:_7.top});
        _7.onResize.apply(_4,[_7.width,_7.height]);
        $(_4).panel("doLayout");
    };
    function _11(_12,_13){
        var _14=$.data(_12,"panel");
        var _15=_14.options;
        var _16=_14.panel;
        if(_13){
            if(_13.left!=null){
                _15.left=_13.left;
            }
            if(_13.top!=null){
                _15.top=_13.top;
            }
        }
        _16.css({left:_15.left,top:_15.top});
        _16.find(".tooltip-f").each(function(){
            $(this).tooltip("reposition");
        });
        _15.onMove.apply(_12,[_15.left,_15.top]);
    };
    function _17(_18){
        $(_18).addClass("panelx-body")._size("clear");
        var _19=$("<div class=\"panelx\"></div>").insertBefore(_18);
        _19[0].appendChild(_18);
        _19.bind("_resize",function(e,_1a){
            if($(this).hasClass("easyui-fluid")||_1a){
                _3(_18);
            }
            return false;
        });
        return _19;
    };
    function _1b(_1c){
        var _1d=$.data(_1c,"panel");
        var _1e=_1d.options;
        var _1f=_1d.panel;
        _1f.css(_1e.style);
        _1f.addClass(_1e.cls);
        _1f.removeClass("panel-hleft panel-hright").addClass("panel-h"+_1e.halign);
        _20();
        _21();
        var _22=$(_1c).panel("header");
        var _23=$(_1c).panel("body");
        var _24=$(_1c).siblings(".panel-footer");
        if(_1e.border){
            _22.removeClass("panel-header-noborder");
            _23.removeClass("panel-body-noborder");
            _24.removeClass("panel-footer-noborder");
        }else{
            _22.addClass("panel-header-noborder");
            _23.addClass("panel-body-noborder");
            _24.addClass("panel-footer-noborder");
        }
        _22.addClass(_1e.headerCls);
        _23.addClass(_1e.bodyCls);
        $(_1c).attr("id",_1e.id||"");
        if(_1e.content){
            $(_1c).panel("clear");
            $(_1c).html(_1e.content);
            $.parser.parse($(_1c));
        }
        function _20(){
            if(_1e.noheader||(!_1e.title&&!_1e.header)){
                _1(_1f.children(".panel-header"));
                _1f.children(".panelx-body").addClass("panel-body-noheader");
            }else{
                if(_1e.header){
                    $(_1e.header).addClass("panel-header").prependTo(_1f);
                }else{
                    var _25=_1f.children(".panel-header");
                    if(!_25.length){
                        _25=$("<div class=\"panel-header\"></div>").prependTo(_1f);
                    }
                    if(!$.isArray(_1e.tools)){
                        _25.find("div.panel-tool .panel-tool-a").appendTo(_1e.tools);
                    }
                    _25.empty();
                    var _26=$("<div class=\"panel-title\"></div>").html(_1e.title).appendTo(_25);
                    if(_1e.iconCls){
                        _26.addClass("panel-with-icon");
                        $("<div class=\"panel-icon\"></div>").addClass(_1e.iconCls).appendTo(_25);
                    }
                    if(_1e.halign=="left"||_1e.halign=="right"){
                        _26.addClass("panel-title-"+_1e.titleDirection);
                    }
                    var _27=$("<div class=\"panel-tool\"></div>").appendTo(_25);
                    _27.bind("click",function(e){
                        e.stopPropagation();
                    });
                    if(_1e.tools){
                        if($.isArray(_1e.tools)){
                            $.map(_1e.tools,function(t){
                                _28(_27,t.iconCls,eval(t.handler));
                            });
                        }else{
                            $(_1e.tools).children().each(function(){
                                $(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(_27);
                            });
                        }
                    }
                    if(_1e.collapsible){
                        _28(_27,"panel-tool-collapse",function(){
                            if(_1e.collapsed==true){
                                _52(_1c,true);
                            }else{
                                _3e(_1c,true);
                            }
                        });
                    }
                    if(_1e.minimizable){
                        _28(_27,"panel-tool-min",function(){
                            _5d(_1c);
                        });
                    }
                    if(_1e.maximizable){
                        _28(_27,"panel-tool-max",function(){
                            if(_1e.maximized==true){
                                _61(_1c);
                            }else{
                                _3d(_1c);
                            }
                        });
                    }
                    if(_1e.closable){
                        _28(_27,"panel-tool-close",function(){
                            _3f(_1c);
                        });
                    }
                }
                _1f.children("div.panelx-body").removeClass("panel-body-noheader");
            }
        };
        function _28(c,_29,_2a){
            var a=$("<a href=\"javascript:;\"></a>").addClass(_29).appendTo(c);
            a.bind("click",_2a);
        };
        function _21(){
            if(_1e.footer){
                $(_1e.footer).addClass("panel-footer").appendTo(_1f);
                $(_1c).addClass("panel-body-nobottom");
            }else{
                _1f.children(".panel-footer").remove();
                $(_1c).removeClass("panel-body-nobottom");
            }
        };
    };
    function _2b(_2c,_2d){
        var _2e=$.data(_2c,"panel");
        var _2f=_2e.options;
        if(_30){
            _2f.queryParams=_2d;
        }
        if(!_2f.href){
            return;
        }
        if(!_2e.isLoaded||!_2f.cache){
            var _30=$.extend({},_2f.queryParams);
            if(_2f.onBeforeLoad.call(_2c,_30)==false){
                return;
            }
            _2e.isLoaded=false;
            if(_2f.loadingMessage){
                $(_2c).panel("clear");
                $(_2c).html($("<div class=\"panel-loading\"></div>").html(_2f.loadingMessage));
            }
            _2f.loader.call(_2c,_30,function(_31){
                var _32=_2f.extractor.call(_2c,_31);
                $(_2c).panel("clear");
                $(_2c).html(_32);
                $.parser.parse($(_2c));
                _2f.onLoad.apply(_2c,arguments);
                _2e.isLoaded=true;
            },function(){
                _2f.onLoadError.apply(_2c,arguments);
            });
        }
    };
    function _33(_34){
        var t=$(_34);
        t.find(".combo-f").each(function(){
            $(this).combo("destroy");
        });
        t.find(".m-btn").each(function(){
            $(this).menubutton("destroy");
        });
        t.find(".s-btn").each(function(){
            $(this).splitbutton("destroy");
        });
        t.find(".tooltip-f").each(function(){
            $(this).tooltip("destroy");
        });
        t.children("div").each(function(){
            $(this)._size("unfit");
        });
        t.empty();
    };
    function _35(_36){
        $(_36).panel("doLayout",true);
    };
    function _37(_38,_39){
        var _3a=$.data(_38,"panel").options;
        var _3b=$.data(_38,"panel").panel;
        if(_39!=true){
            if(_3a.onBeforeOpen.call(_38)==false){
                return;
            }
        }
        _3b.stop(true,true);
        if($.isFunction(_3a.openAnimation)){
            _3a.openAnimation.call(_38,cb);
        }else{
            switch(_3a.openAnimation){
                case "slide":
                    _3b.slideDown(_3a.openDuration,cb);
                    break;
                case "fade":
                    _3b.fadeIn(_3a.openDuration,cb);
                    break;
                case "show":
                    _3b.show(_3a.openDuration,cb);
                    break;
                default:
                    _3b.show();
                    cb();
            }
        }
        function cb(){
            _3a.closed=false;
            _3a.minimized=false;
            var _3c=_3b.children(".panel-header").find("a.panel-tool-restore");
            if(_3c.length){
                _3a.maximized=true;
            }
            _3a.onOpen.call(_38);
            if(_3a.maximized==true){
                _3a.maximized=false;
                _3d(_38);
            }
            if(_3a.collapsed==true){
                _3a.collapsed=false;
                _3e(_38);
            }
            if(!_3a.collapsed){
                _2b(_38);
                _35(_38);
            }
        };
    };
    function _3f(_40,_41){
        var _42=$.data(_40,"panel");
        var _43=_42.options;
        var _44=_42.panel;
        if(_41!=true){
            if(_43.onBeforeClose.call(_40)==false){
                return;
            }
        }
        _44.find(".tooltip-f").each(function(){
            $(this).tooltip("hide");
        });
        _44.stop(true,true);
        _44._size("unfit");
        if($.isFunction(_43.closeAnimation)){
            _43.closeAnimation.call(_40,cb);
        }else{
            switch(_43.closeAnimation){
                case "slide":
                    _44.slideUp(_43.closeDuration,cb);
                    break;
                case "fade":
                    _44.fadeOut(_43.closeDuration,cb);
                    break;
                case "hide":
                    _44.hide(_43.closeDuration,cb);
                    break;
                default:
                    _44.hide();
                    cb();
            }
        }
        function cb(){
            _43.closed=true;
            _43.onClose.call(_40);
        };
    };
    function _45(_46,_47){
        var _48=$.data(_46,"panel");
        var _49=_48.options;
        var _4a=_48.panel;
        if(_47!=true){
            if(_49.onBeforeDestroy.call(_46)==false){
                return;
            }
        }
        $(_46).panel("clear").panel("clear","footer");
        _1(_4a);
        _49.onDestroy.call(_46);
    };
    function _3e(_4b,_4c){
        var _4d=$.data(_4b,"panel").options;
        var _4e=$.data(_4b,"panel").panel;
        var _4f=_4e.children(".panelx-body");
        var _50=_4e.children(".panel-header");
        var _51=_50.find("a.panel-tool-collapse");
        if(_4d.collapsed==true){
            return;
        }
        _4f.stop(true,true);
        if(_4d.onBeforeCollapse.call(_4b)==false){
            return;
        }
        _51.addClass("panel-tool-expand");
        if(_4c==true){
            if(_4d.halign=="left"||_4d.halign=="right"){
                _4e.animate({width:_50._outerWidth()+_4e.children(".panel-footer")._outerWidth()},function(){
                    cb();
                });
            }else{
                _4f.slideUp("normal",function(){
                    cb();
                });
            }
        }else{
            if(_4d.halign=="left"||_4d.halign=="right"){
                _4e._outerWidth(_50._outerWidth()+_4e.children(".panel-footer")._outerWidth());
            }
            cb();
        }
        function cb(){
            _4f.hide();
            _4d.collapsed=true;
            _4d.onCollapse.call(_4b);
        };
    };
    function _52(_53,_54){
        var _55=$.data(_53,"panel").options;
        var _56=$.data(_53,"panel").panel;
        var _57=_56.children(".panelx-body");
        var _58=_56.children(".panel-header").find("a.panel-tool-collapse");
        if(_55.collapsed==false){
            return;
        }
        _57.stop(true,true);
        if(_55.onBeforeExpand.call(_53)==false){
            return;
        }
        _58.removeClass("panel-tool-expand");
        if(_54==true){
            if(_55.halign=="left"||_55.halign=="right"){
                _57.show();
                _56.animate({width:_55.panelCssWidth},function(){
                    cb();
                });
            }else{
                _57.slideDown("normal",function(){
                    cb();
                });
            }
        }else{
            if(_55.halign=="left"||_55.halign=="right"){
                _56.css("width",_55.panelCssWidth);
            }
            cb();
        }
        function cb(){
            _57.show();
            _55.collapsed=false;
            _55.onExpand.call(_53);
            _2b(_53);
            _35(_53);
        };
    };
    function _3d(_59){
        var _5a=$.data(_59,"panel").options;
        var _5b=$.data(_59,"panel").panel;
        var _5c=_5b.children(".panel-header").find("a.panel-tool-max");
        if(_5a.maximized==true){
            return;
        }
        _5c.addClass("panel-tool-restore");
        if(!$.data(_59,"panel").original){
            $.data(_59,"panel").original={width:_5a.width,height:_5a.height,left:_5a.left,top:_5a.top,fit:_5a.fit};
        }
        _5a.left=0;
        _5a.top=0;
        _5a.fit=true;
        _3(_59);
        _5a.minimized=false;
        _5a.maximized=true;
        _5a.onMaximize.call(_59);
    };
    function _5d(_5e){
        var _5f=$.data(_5e,"panel").options;
        var _60=$.data(_5e,"panel").panel;
        _60._size("unfit");
        _60.hide();
        _5f.minimized=true;
        _5f.maximized=false;
        _5f.onMinimize.call(_5e);
    };
    function _61(_62){
        var _63=$.data(_62,"panel").options;
        var _64=$.data(_62,"panel").panel;
        var _65=_64.children(".panel-header").find("a.panel-tool-max");
        if(_63.maximized==false){
            return;
        }
        _64.show();
        _65.removeClass("panel-tool-restore");
        $.extend(_63,$.data(_62,"panel").original);
        _3(_62);
        _63.minimized=false;
        _63.maximized=false;
        $.data(_62,"panel").original=null;
        _63.onRestore.call(_62);
    };
    function _66(_67,_68){
        $.data(_67,"panel").options.title=_68;
        $(_67).panel("header").find("div.panel-title").html(_68);
    };
    var _69=null;
    $(window).unbind(".panelx").bind("resize.panel",function(){
        if(_69){
            clearTimeout(_69);
        }
        _69=setTimeout(function(){
            var _6a=$("body.layout");
            if(_6a.length){
                _6a.layout("resize");
                $("body").children(".easyui-fluid:visible").each(function(){
                    $(this).triggerHandler("_resize");
                });
            }else{
                $("body").panel("doLayout");
            }
            _69=null;
        },100);
    });
    $.fn.panel=function(_6b,_6c){
        if(typeof _6b=="string"){
            return $.fn.panel.methods[_6b](this,_6c);
        }
        _6b=_6b||{};
        return this.each(function(){
            var _6d=$.data(this,"panel");
            var _6e;
            if(_6d){
                _6e=$.extend(_6d.options,_6b);
                _6d.isLoaded=false;
            }else{
                _6e=$.extend({},$.fn.panel.defaults,$.fn.panel.parseOptions(this),_6b);
                $(this).attr("title","");
                _6d=$.data(this,"panel",{options:_6e,panel:_17(this),isLoaded:false});
            }
            _1b(this);
            $(this).show();
            if(_6e.doSize==true){
                _6d.panel.css("display","block");
                _3(this);
            }
            if(_6e.closed==true||_6e.minimized==true){
                _6d.panel.hide();
            }else{
                _37(this);
            }
        });
    };
    $.fn.panel.methods={options:function(jq){
            return $.data(jq[0],"panel").options;
        },panel:function(jq){
            return $.data(jq[0],"panel").panel;
        },header:function(jq){
            return $.data(jq[0],"panel").panel.children(".panel-header");
        },footer:function(jq){
            return jq.panel("panel").children(".panel-footer");
        },body:function(jq){
            return $.data(jq[0],"panel").panel.children(".panelx-body");
        },setTitle:function(jq,_6f){
            return jq.each(function(){
                _66(this,_6f);
            });
        },open:function(jq,_70){
            return jq.each(function(){
                _37(this,_70);
            });
        },close:function(jq,_71){
            return jq.each(function(){
                _3f(this,_71);
            });
        },destroy:function(jq,_72){
            return jq.each(function(){
                _45(this,_72);
            });
        },clear:function(jq,_73){
            return jq.each(function(){
                _33(_73=="footer"?$(this).panel("footer"):this);
            });
        },refresh:function(jq,_74){
            return jq.each(function(){
                var _75=$.data(this,"panel");
                _75.isLoaded=false;
                if(_74){
                    if(typeof _74=="string"){
                        _75.options.href=_74;
                    }else{
                        _75.options.queryParams=_74;
                    }
                }
                _2b(this);
            });
        },resize:function(jq,_76){
            return jq.each(function(){
                _3(this,_76);
            });
        },doLayout:function(jq,all){
            return jq.each(function(){
                _77(this,"body");
                _77($(this).siblings(".panel-footer")[0],"footer");
                function _77(_78,_79){
                    if(!_78){
                        return;
                    }
                    var _7a=_78==$("body")[0];
                    var s=$(_78).find("div.panelx:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.easyui-fluid:visible").filter(function(_7b,el){
                        var p=$(el).parents(".panelx-"+_79+":first");
                        return _7a?p.length==0:p[0]==_78;
                    });
                    s.each(function(){
                        $(this).triggerHandler("_resize",[all||false]);
                    });
                };
            });
        },move:function(jq,_7c){
            return jq.each(function(){
                _11(this,_7c);
            });
        },maximize:function(jq){
            return jq.each(function(){
                _3d(this);
            });
        },minimize:function(jq){
            return jq.each(function(){
                _5d(this);
            });
        },restore:function(jq){
            return jq.each(function(){
                _61(this);
            });
        },collapse:function(jq,_7d){
            return jq.each(function(){
                _3e(this,_7d);
            });
        },expand:function(jq,_7e){
            return jq.each(function(){
                _52(this,_7e);
            });
        }};
    $.fn.panel.parseOptions=function(_7f){
        var t=$(_7f);
        var hh=t.children(".panel-header,header");
        var ff=t.children(".panel-footer,footer");
        return $.extend({},$.parser.parseOptions(_7f,["id","width","height","left","top","title","iconCls","cls","headerCls","bodyCls","tools","href","method","header","footer","halign","titleDirection",{cache:"boolean",fit:"boolean",border:"boolean",noheader:"boolean"},{collapsible:"boolean",minimizable:"boolean",maximizable:"boolean"},{closable:"boolean",collapsed:"boolean",minimized:"boolean",maximized:"boolean",closed:"boolean"},"openAnimation","closeAnimation",{openDuration:"number",closeDuration:"number"},]),{loadingMessage:(t.attr("loadingMessage")!=undefined?t.attr("loadingMessage"):undefined),header:(hh.length?hh.removeClass("panel-header"):undefined),footer:(ff.length?ff.removeClass("panel-footer"):undefined)});
    };
    $.fn.panel.defaults={id:null,title:null,iconCls:null,width:"auto",height:"auto",left:null,top:null,cls:null,headerCls:null,bodyCls:null,style:{},href:null,cache:true,fit:false,border:true,doSize:true,noheader:false,content:null,halign:"top",titleDirection:"down",collapsible:false,minimizable:false,maximizable:false,closable:false,collapsed:false,minimized:false,maximized:false,closed:false,openAnimation:false,openDuration:400,closeAnimation:false,closeDuration:400,tools:null,footer:null,header:null,queryParams:{},method:"get",href:null,loadingMessage:null,loader:function(_80,_81,_82){
            var _83=$(this).panel("options");
            if(!_83.href){
                return false;
            }
            $.ajax({type:_83.method,url:_83.href,cache:false,data:_80,dataType:"html",success:function(_84){
                    _81(_84);
                },error:function(){
                    _82.apply(this,arguments);
                }});
        },extractor:function(_85){
            var _86=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
            var _87=_86.exec(_85);
            if(_87){
                return _87[1];
            }else{
                return _85;
            }
        },onBeforeLoad:function(_88){
        },onLoad:function(){
        },onLoadError:function(){
        },onBeforeOpen:function(){
        },onOpen:function(){
        },onBeforeClose:function(){
        },onClose:function(){
        },onBeforeDestroy:function(){
        },onDestroy:function(){
        },onResize:function(_89,_8a){
        },onMove:function(_8b,top){
        },onMaximize:function(){
        },onRestore:function(){
        },onMinimize:function(){
        },onBeforeCollapse:function(){
        },onBeforeExpand:function(){
        },onCollapse:function(){
        },onExpand:function(){
        }};
})(jQuery);

//layout.js
(function($){
    var _1=false;
    function _2(_3,_4){
        var _5=$.data(_3,"layout");
        var _6=_5.options;
        var _7=_5.panels;
        var cc=$(_3);
        if(_4){
            $.extend(_6,{width:_4.width,height:_4.height});
        }
        if(_3.tagName.toLowerCase()=="body"){
            cc._size("fit");
        }else{
            cc._size(_6);
        }
        var _8={top:0,left:0,width:cc.width(),height:cc.height()};
        _9(_a(_7.expandNorth)?_7.expandNorth:_7.north,"n");
        _9(_a(_7.expandSouth)?_7.expandSouth:_7.south,"s");
        _b(_a(_7.expandEast)?_7.expandEast:_7.east,"e");
        _b(_a(_7.expandWest)?_7.expandWest:_7.west,"w");
        _7.center.panel("resize",_8);
        function _9(pp,_c){
            if(!pp.length||!_a(pp)){
                return;
            }
            var _d=pp.panel("options");
            pp.panel("resize",{width:cc.width(),height:_d.height});
            var _e=pp.panel("panel").outerHeight();
            pp.panel("move",{left:0,top:(_c=="n"?0:cc.height()-_e)});
            _8.height-=_e;
            if(_c=="n"){
                _8.top+=_e;
                if(!_d.split&&_d.border){
                    _8.top--;
                }
            }
            if(!_d.split&&_d.border){
                _8.height++;
            }
        };
        function _b(pp,_f){
            if(!pp.length||!_a(pp)){
                return;
            }
            var _10=pp.panel("options");
            pp.panel("resize",{width:_10.width,height:_8.height});
            var _11=pp.panel("panel").outerWidth();
            pp.panel("move",{left:(_f=="e"?cc.width()-_11:0),top:_8.top});
            _8.width-=_11;
            if(_f=="w"){
                _8.left+=_11;
                if(!_10.split&&_10.border){
                    _8.left--;
                }
            }
            if(!_10.split&&_10.border){
                _8.width++;
            }
        };
    };
    function _12(_13){
        var cc=$(_13);
        cc.addClass("layout");
        function _14(el){
            var _15=$.fn.layout.parsePanelOptions(el);
            if("north,south,east,west,center".indexOf(_15.region)>=0){
                _19(_13,_15,el);
            }
        };
        var _16=cc.layout("options");
        var _17=_16.onAdd;
        _16.onAdd=function(){
        };
        cc.find(">div,>form>div").each(function(){
            _14(this);
        });
        _16.onAdd=_17;
        cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
        cc.bind("_resize",function(e,_18){
            if($(this).hasClass("easyui-fluid")||_18){
                _2(_13);
            }
            return false;
        });
    };
    function _19(_1a,_1b,el){
        _1b.region=_1b.region||"center";
        var _1c=$.data(_1a,"layout").panels;
        var cc=$(_1a);
        var dir=_1b.region;
        if(_1c[dir].length){
            return;
        }
        var pp=$(el);
        if(!pp.length){
            pp=$("<div></div>").appendTo(cc);
        }
        var _1d=$.extend({},$.fn.layout.paneldefaults,{width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),doSize:false,collapsible:true,onOpen:function(){
                var _1e=$(this).panel("header").children("div.panel-tool");
                _1e.children("a.panel-tool-collapse").hide();
                var _1f={north:"up",south:"down",east:"right",west:"left"};
                if(!_1f[dir]){
                    return;
                }
                var _20="layout-button-"+_1f[dir];
                var t=_1e.children("a."+_20);
                if(!t.length){
                    t=$("<a href=\"javascript:;\"></a>").addClass(_20).appendTo(_1e);
                    t.bind("click",{dir:dir},function(e){
                        _39(_1a,e.data.dir);
                        return false;
                    });
                }
                $(this).panel("options").collapsible?t.show():t.hide();
            }},_1b,{cls:((_1b.cls||"")+" layout-panel layout-panel-"+dir),bodyCls:((_1b.bodyCls||"")+" layout-body")});
        pp.panel(_1d);
        _1c[dir]=pp;
        var _21={north:"s",south:"n",east:"w",west:"e"};
        var _22=pp.panel("panel");
        if(pp.panel("options").split){
            _22.addClass("layout-split-"+dir);
        }
        _22.resizable($.extend({},{handles:(_21[dir]||""),disabled:(!pp.panel("options").split),onStartResize:function(e){
                _1=true;
                if(dir=="north"||dir=="south"){
                    var _23=$(">div.layout-split-proxy-v",_1a);
                }else{
                    var _23=$(">div.layout-split-proxy-h",_1a);
                }
                var top=0,_24=0,_25=0,_26=0;
                var pos={display:"block"};
                if(dir=="north"){
                    pos.top=parseInt(_22.css("top"))+_22.outerHeight()-_23.height();
                    pos.left=parseInt(_22.css("left"));
                    pos.width=_22.outerWidth();
                    pos.height=_23.height();
                }else{
                    if(dir=="south"){
                        pos.top=parseInt(_22.css("top"));
                        pos.left=parseInt(_22.css("left"));
                        pos.width=_22.outerWidth();
                        pos.height=_23.height();
                    }else{
                        if(dir=="east"){
                            pos.top=parseInt(_22.css("top"))||0;
                            pos.left=parseInt(_22.css("left"))||0;
                            pos.width=_23.width();
                            pos.height=_22.outerHeight();
                        }else{
                            if(dir=="west"){
                                pos.top=parseInt(_22.css("top"))||0;
                                pos.left=_22.outerWidth()-_23.width();
                                pos.width=_23.width();
                                pos.height=_22.outerHeight();
                            }
                        }
                    }
                }
                _23.css(pos);
                $("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
            },onResize:function(e){
                if(dir=="north"||dir=="south"){
                    var _27=_28(this);
                    $(this).resizable("options").maxHeight=_27;
                    var _29=$(">div.layout-split-proxy-v",_1a);
                    var top=dir=="north"?e.data.height-_29.height():$(_1a).height()-e.data.height;
                    _29.css("top",top);
                }else{
                    var _2a=_28(this);
                    $(this).resizable("options").maxWidth=_2a;
                    var _29=$(">div.layout-split-proxy-h",_1a);
                    var _2b=dir=="west"?e.data.width-_29.width():$(_1a).width()-e.data.width;
                    _29.css("left",_2b);
                }
                return false;
            },onStopResize:function(e){
                cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
                pp.panel("resize",e.data);
                _2(_1a);
                _1=false;
                cc.find(">div.layout-mask").remove();
            }},_1b));
        cc.layout("options").onAdd.call(_1a,dir);
        function _28(p){
            var _2c="expand"+dir.substring(0,1).toUpperCase()+dir.substring(1);
            var _2d=_1c["center"];
            var _2e=(dir=="north"||dir=="south")?"minHeight":"minWidth";
            var _2f=(dir=="north"||dir=="south")?"maxHeight":"maxWidth";
            var _30=(dir=="north"||dir=="south")?"_outerHeight":"_outerWidth";
            var _31=$.parser.parseValue(_2f,_1c[dir].panel("options")[_2f],$(_1a));
            var _32=$.parser.parseValue(_2e,_2d.panel("options")[_2e],$(_1a));
            var _33=_2d.panel("panel")[_30]()-_32;
            if(_a(_1c[_2c])){
                _33+=_1c[_2c][_30]()-1;
            }else{
                _33+=$(p)[_30]();
            }
            if(_33>_31){
                _33=_31;
            }
            return _33;
        };
    };
    function _34(_35,_36){
        var _37=$.data(_35,"layout").panels;
        if(_37[_36].length){
            _37[_36].panel("destroy");
            _37[_36]=$();
            var _38="expand"+_36.substring(0,1).toUpperCase()+_36.substring(1);
            if(_37[_38]){
                _37[_38].panel("destroy");
                _37[_38]=undefined;
            }
            $(_35).layout("options").onRemove.call(_35,_36);
        }
    };
    function _39(_3a,_3b,_3c){
        if(_3c==undefined){
            _3c="normal";
        }
        var _3d=$.data(_3a,"layout").panels;
        var p=_3d[_3b];
        var _3e=p.panel("options");
        if(_3e.onBeforeCollapse.call(p)==false){
            return;
        }
        var _3f="expand"+_3b.substring(0,1).toUpperCase()+_3b.substring(1);
        if(!_3d[_3f]){
            _3d[_3f]=_40(_3b);
            var ep=_3d[_3f].panel("panel");
            if(!_3e.expandMode){
                ep.css("cursor","default");
            }else{
                ep.bind("click",function(){
                    if(_3e.expandMode=="dock"){
                        _4f(_3a,_3b);
                    }else{
                        p.panel("expand",false).panel("open");
                        var _41=_42();
                        p.panel("resize",_41.collapse);
                        p.panel("panel").animate(_41.expand,function(){
                            $(this).unbind(".layout").bind("mouseleave.layout",{region:_3b},function(e){
                                if(_1==true){
                                    return;
                                }
                                if($("body>div.combo-p>div.combo-panel:visible").length){
                                    return;
                                }
                                _39(_3a,e.data.region);
                            });
                            $(_3a).layout("options").onExpand.call(_3a,_3b);
                        });
                    }
                    return false;
                });
            }
        }
        var _43=_42();
        if(!_a(_3d[_3f])){
            _3d.center.panel("resize",_43.resizeC);
        }
        p.panel("panel").animate(_43.collapse,_3c,function(){
            p.panel("collapse",false).panel("close");
            _3d[_3f].panel("open").panel("resize",_43.expandP);
            $(this).unbind(".layout");
            $(_3a).layout("options").onCollapse.call(_3a,_3b);
        });
        function _40(dir){
            var _44={"east":"left","west":"right","north":"down","south":"up"};
            var _45=(_3e.region=="north"||_3e.region=="south");
            var _46="layout-button-"+_44[dir];
            var p=$("<div></div>").appendTo(_3a);
            p.panel($.extend({},$.fn.layout.paneldefaults,{cls:("layout-expand layout-expand-"+dir),title:"&nbsp;",titleDirection:_3e.titleDirection,iconCls:(_3e.hideCollapsedContent?null:_3e.iconCls),closed:true,minWidth:0,minHeight:0,doSize:false,region:_3e.region,collapsedSize:_3e.collapsedSize,noheader:(!_45&&_3e.hideExpandTool),tools:((_45&&_3e.hideExpandTool)?null:[{iconCls:_46,handler:function(){
                        _4f(_3a,_3b);
                        return false;
                    }}]),onResize:function(){
                    var _47=$(this).children(".layout-expand-title");
                    if(_47.length){
                        _47._outerWidth($(this).height());
                        var _48=($(this).width()-Math.min(_47._outerWidth(),_47._outerHeight()))/2;
                        var top=Math.max(_47._outerWidth(),_47._outerHeight());
                        if(_47.hasClass("layout-expand-title-down")){
                            _48+=Math.min(_47._outerWidth(),_47._outerHeight());
                            top=0;
                        }
                        _47.css({left:(_48+"px"),top:(top+"px")});
                    }
                }}));
            if(!_3e.hideCollapsedContent){
                var _49=typeof _3e.collapsedContent=="function"?_3e.collapsedContent.call(p[0],_3e.title):_3e.collapsedContent;
                _45?p.panel("setTitle",_49):p.html(_49);
            }
            p.panel("panel").hover(function(){
                $(this).addClass("layout-expand-over");
            },function(){
                $(this).removeClass("layout-expand-over");
            });
            return p;
        };
        function _42(){
            var cc=$(_3a);
            var _4a=_3d.center.panel("options");
            var _4b=_3e.collapsedSize;
            if(_3b=="east"){
                var _4c=p.panel("panel")._outerWidth();
                var _4d=_4a.width+_4c-_4b;
                if(_3e.split||!_3e.border){
                    _4d++;
                }
                return {resizeC:{width:_4d},expand:{left:cc.width()-_4c},expandP:{top:_4a.top,left:cc.width()-_4b,width:_4b,height:_4a.height},collapse:{left:cc.width(),top:_4a.top,height:_4a.height}};
            }else{
                if(_3b=="west"){
                    var _4c=p.panel("panel")._outerWidth();
                    var _4d=_4a.width+_4c-_4b;
                    if(_3e.split||!_3e.border){
                        _4d++;
                    }
                    return {resizeC:{width:_4d,left:_4b-1},expand:{left:0},expandP:{left:0,top:_4a.top,width:_4b,height:_4a.height},collapse:{left:-_4c,top:_4a.top,height:_4a.height}};
                }else{
                    if(_3b=="north"){
                        var _4e=p.panel("panel")._outerHeight();
                        var hh=_4a.height;
                        if(!_a(_3d.expandNorth)){
                            hh+=_4e-_4b+((_3e.split||!_3e.border)?1:0);
                        }
                        _3d.east.add(_3d.west).add(_3d.expandEast).add(_3d.expandWest).panel("resize",{top:_4b-1,height:hh});
                        return {resizeC:{top:_4b-1,height:hh},expand:{top:0},expandP:{top:0,left:0,width:cc.width(),height:_4b},collapse:{top:-_4e,width:cc.width()}};
                    }else{
                        if(_3b=="south"){
                            var _4e=p.panel("panel")._outerHeight();
                            var hh=_4a.height;
                            if(!_a(_3d.expandSouth)){
                                hh+=_4e-_4b+((_3e.split||!_3e.border)?1:0);
                            }
                            _3d.east.add(_3d.west).add(_3d.expandEast).add(_3d.expandWest).panel("resize",{height:hh});
                            return {resizeC:{height:hh},expand:{top:cc.height()-_4e},expandP:{top:cc.height()-_4b,left:0,width:cc.width(),height:_4b},collapse:{top:cc.height(),width:cc.width()}};
                        }
                    }
                }
            }
        };
    };
    function _4f(_50,_51){
        var _52=$.data(_50,"layout").panels;
        var p=_52[_51];
        var _53=p.panel("options");
        if(_53.onBeforeExpand.call(p)==false){
            return;
        }
        var _54="expand"+_51.substring(0,1).toUpperCase()+_51.substring(1);
        if(_52[_54]){
            _52[_54].panel("close");
            p.panel("panel").stop(true,true);
            p.panel("expand",false).panel("open");
            var _55=_56();
            p.panel("resize",_55.collapse);
            p.panel("panel").animate(_55.expand,function(){
                _2(_50);
                $(_50).layout("options").onExpand.call(_50,_51);
            });
        }
        function _56(){
            var cc=$(_50);
            var _57=_52.center.panel("options");
            if(_51=="east"&&_52.expandEast){
                return {collapse:{left:cc.width(),top:_57.top,height:_57.height},expand:{left:cc.width()-p.panel("panel")._outerWidth()}};
            }else{
                if(_51=="west"&&_52.expandWest){
                    return {collapse:{left:-p.panel("panel")._outerWidth(),top:_57.top,height:_57.height},expand:{left:0}};
                }else{
                    if(_51=="north"&&_52.expandNorth){
                        return {collapse:{top:-p.panel("panel")._outerHeight(),width:cc.width()},expand:{top:0}};
                    }else{
                        if(_51=="south"&&_52.expandSouth){
                            return {collapse:{top:cc.height(),width:cc.width()},expand:{top:cc.height()-p.panel("panel")._outerHeight()}};
                        }
                    }
                }
            }
        };
    };
    function _a(pp){
        if(!pp){
            return false;
        }
        if(pp.length){
            return pp.panel("panel").is(":visible");
        }else{
            return false;
        }
    };
    function _58(_59){
        var _5a=$.data(_59,"layout");
        var _5b=_5a.options;
        var _5c=_5a.panels;
        var _5d=_5b.onCollapse;
        _5b.onCollapse=function(){
        };
        _5e("east");
        _5e("west");
        _5e("north");
        _5e("south");
        _5b.onCollapse=_5d;
        function _5e(_5f){
            var p=_5c[_5f];
            if(p.length&&p.panel("options").collapsed){
                _39(_59,_5f,0);
            }
        };
    };
    function _60(_61,_62,_63){
        var p=$(_61).layout("panel",_62);
        p.panel("options").split=_63;
        var cls="layout-split-"+_62;
        var _64=p.panel("panel").removeClass(cls);
        if(_63){
            _64.addClass(cls);
        }
        _64.resizable({disabled:(!_63)});
        _2(_61);
    };
    $.fn.layout=function(_65,_66){
        if(typeof _65=="string"){
            return $.fn.layout.methods[_65](this,_66);
        }
        _65=_65||{};
        return this.each(function(){
            var _67=$.data(this,"layout");
            if(_67){
                $.extend(_67.options,_65);
            }else{
                var _68=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),_65);
                $.data(this,"layout",{options:_68,panels:{center:$(),north:$(),south:$(),east:$(),west:$()}});
                _12(this);
            }
            _2(this);
            _58(this);
        });
    };
    $.fn.layout.methods={options:function(jq){
            return $.data(jq[0],"layout").options;
        },resize:function(jq,_69){
            return jq.each(function(){
                _2(this,_69);
            });
        },panel:function(jq,_6a){
            return $.data(jq[0],"layout").panels[_6a];
        },collapse:function(jq,_6b){
            return jq.each(function(){
                _39(this,_6b,0);
            });
        },expand:function(jq,_6c){
            return jq.each(function(){
                _4f(this,_6c);
            });
        },add:function(jq,_6d){
            return jq.each(function(){
                _19(this,_6d);
                _2(this);
                if($(this).layout("panel",_6d.region).panel("options").collapsed){
                    _39(this,_6d.region,0);
                }
            });
        },remove:function(jq,_6e){
            return jq.each(function(){
                _34(this,_6e);
                _2(this);
            });
        },split:function(jq,_6f){
            return jq.each(function(){
                _60(this,_6f,true);
            });
        },unsplit:function(jq,_70){
            return jq.each(function(){
                _60(this,_70,false);
            });
        }};
    $.fn.layout.parseOptions=function(_71){
        return $.extend({},$.parser.parseOptions(_71,[{fit:"boolean"}]));
    };
    $.fn.layout.defaults={fit:false,onExpand:function(_72){
        },onCollapse:function(_73){
        },onAdd:function(_74){
        },onRemove:function(_75){
        }};
    $.fn.layout.parsePanelOptions=function(_76){
        var t=$(_76);
        return $.extend({},$.fn.panel.parseOptions(_76),$.parser.parseOptions(_76,["region",{split:"boolean",collpasedSize:"number",minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number"}]));
    };
    $.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{region:null,split:false,collapsedSize:28,expandMode:"float",hideExpandTool:false,hideCollapsedContent:true,collapsedContent:function(_77){
            var p=$(this);
            var _78=p.panel("options");
            if(_78.region=="north"||_78.region=="south"){
                return _77;
            }
            var cc=[];
            if(_78.iconCls){
                cc.push("<div class=\"panel-icon "+_78.iconCls+"\"></div>");
            }
            cc.push("<div class=\"panel-title layout-expand-title");
            cc.push(" layout-expand-title-"+_78.titleDirection);
            cc.push(_78.iconCls?" layout-expand-with-icon":"");
            cc.push("\">");
            cc.push(_77);
            cc.push("</div>");
            return cc.join("");
        },minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000});
})(jQuery);

// tree.js
(function($){
    function _1(_2){
        var _3=$(_2);
        _3.addClass("tree");
        return _3;
    };
    function _4(_5){
        var _6=$.data(_5,"tree").options;
        $(_5).unbind().bind("mouseover",function(e){
            var tt=$(e.target);
            var _7=tt.closest("div.tree-node");
            if(!_7.length){
                return;
            }
            _7.addClass("tree-node-hover");
            if(tt.hasClass("tree-hit")){
                if(tt.hasClass("tree-expanded")){
                    tt.addClass("tree-expanded-hover");
                }else{
                    tt.addClass("tree-collapsed-hover");
                }
            }
            e.stopPropagation();
        }).bind("mouseout",function(e){
            var tt=$(e.target);
            var _8=tt.closest("div.tree-node");
            if(!_8.length){
                return;
            }
            _8.removeClass("tree-node-hover");
            if(tt.hasClass("tree-hit")){
                if(tt.hasClass("tree-expanded")){
                    tt.removeClass("tree-expanded-hover");
                }else{
                    tt.removeClass("tree-collapsed-hover");
                }
            }
            e.stopPropagation();
        }).bind("click",function(e){
            var tt=$(e.target);
            var _9=tt.closest("div.tree-node");
            if(!_9.length){
                return;
            }
            if(tt.hasClass("tree-hit")){
                _85(_5,_9[0]);
                return false;
            }else{
                if(tt.hasClass("tree-checkbox")){
                    _34(_5,_9[0]);
                    return false;
                }else{
                    _d9(_5,_9[0]);
                    _6.onClick.call(_5,_c(_5,_9[0]));
                }
            }
            e.stopPropagation();
        }).bind("dblclick",function(e){
            var _a=$(e.target).closest("div.tree-node");
            if(!_a.length){
                return;
            }
            _d9(_5,_a[0]);
            _6.onDblClick.call(_5,_c(_5,_a[0]));
            e.stopPropagation();
        }).bind("contextmenu",function(e){
            var _b=$(e.target).closest("div.tree-node");
            if(!_b.length){
                return;
            }
            _6.onContextMenu.call(_5,e,_c(_5,_b[0]));
            e.stopPropagation();
        });
    };
    function _d(_e){
        var _f=$.data(_e,"tree").options;
        _f.dnd=false;
        var _10=$(_e).find("div.tree-node");
        _10.draggable("disable");
        _10.css("cursor","pointer");
    };
    function _11(_12){
        var _13=$.data(_12,"tree");
        var _14=_13.options;
        var _15=_13.tree;
        _13.disabledNodes=[];
        _14.dnd=true;
        _15.find("div.tree-node").draggable({disabled:false,revert:true,cursor:"pointer",proxy:function(_16){
                var p=$("<div class=\"tree-node-proxy\"></div>").appendTo("body");
                p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"+$(_16).find(".tree-title").html());
                p.hide();
                return p;
            },deltaX:15,deltaY:15,onBeforeDrag:function(e){
                if(_14.onBeforeDrag.call(_12,_c(_12,this))==false){
                    return false;
                }
                if($(e.target).hasClass("tree-hit")||$(e.target).hasClass("tree-checkbox")){
                    return false;
                }
                if(e.which!=1){
                    return false;
                }
                var _17=$(this).find("span.tree-indent");
                if(_17.length){
                    e.data.offsetWidth-=_17.length*_17.width();
                }
            },onStartDrag:function(e){
                $(this).next("ul").find("div.tree-node").each(function(){
                    $(this).droppable("disable");
                    _13.disabledNodes.push(this);
                });
                $(this).draggable("proxy").css({left:-10000,top:-10000});
                _14.onStartDrag.call(_12,_c(_12,this));
                var _18=_c(_12,this);
                if(_18.id==undefined){
                    _18.id="easyui_tree_node_id_temp";
                    _60(_12,_18);
                }
                _13.draggingNodeId=_18.id;
            },onDrag:function(e){
                var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
                var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
                if(d>3){
                    $(this).draggable("proxy").show();
                }
                this.pageY=e.pageY;
            },onStopDrag:function(){
                for(var i=0;i<_13.disabledNodes.length;i++){
                    $(_13.disabledNodes[i]).droppable("enable");
                }
                _13.disabledNodes=[];
                var _19=_d0(_12,_13.draggingNodeId);
                if(_19&&_19.id=="easyui_tree_node_id_temp"){
                    _19.id="";
                    _60(_12,_19);
                }
                _14.onStopDrag.call(_12,_19);
            }}).droppable({accept:"div.tree-node",onDragEnter:function(e,_1a){
                if(_14.onDragEnter.call(_12,this,_1b(_1a))==false){
                    _1c(_1a,false);
                    $(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
                    $(this).droppable("disable");
                    _13.disabledNodes.push(this);
                }
            },onDragOver:function(e,_1d){
                if($(this).droppable("options").disabled){
                    return;
                }
                var _1e=_1d.pageY;
                var top=$(this).offset().top;
                var _1f=top+$(this).outerHeight();
                _1c(_1d,true);
                $(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
                if(_1e>top+(_1f-top)/2){
                    if(_1f-_1e<5){
                        $(this).addClass("tree-node-bottom");
                    }else{
                        $(this).addClass("tree-node-append");
                    }
                }else{
                    if(_1e-top<5){
                        $(this).addClass("tree-node-top");
                    }else{
                        $(this).addClass("tree-node-append");
                    }
                }
                if(_14.onDragOver.call(_12,this,_1b(_1d))==false){
                    _1c(_1d,false);
                    $(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
                    $(this).droppable("disable");
                    _13.disabledNodes.push(this);
                }
            },onDragLeave:function(e,_20){
                _1c(_20,false);
                $(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
                _14.onDragLeave.call(_12,this,_1b(_20));
            },onDrop:function(e,_21){
                var _22=this;
                var _23,_24;
                if($(this).hasClass("tree-node-append")){
                    _23=_25;
                    _24="append";
                }else{
                    _23=_26;
                    _24=$(this).hasClass("tree-node-top")?"top":"bottom";
                }
                if(_14.onBeforeDrop.call(_12,_22,_1b(_21),_24)==false){
                    $(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
                    return;
                }
                _23(_21,_22,_24);
                $(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
            }});
        function _1b(_27,pop){
            return $(_27).closest("ul.tree").tree(pop?"pop":"getData",_27);
        };
        function _1c(_28,_29){
            var _2a=$(_28).draggable("proxy").find("span.tree-dnd-icon");
            _2a.removeClass("tree-dnd-yes tree-dnd-no").addClass(_29?"tree-dnd-yes":"tree-dnd-no");
        };
        function _25(_2b,_2c){
            if(_c(_12,_2c).state=="closed"){
                _79(_12,_2c,function(){
                    _2d();
                });
            }else{
                _2d();
            }
            function _2d(){
                var _2e=_1b(_2b,true);
                $(_12).tree("append",{parent:_2c,data:[_2e]});
                _14.onDrop.call(_12,_2c,_2e,"append");
            };
        };
        function _26(_2f,_30,_31){
            var _32={};
            if(_31=="top"){
                _32.before=_30;
            }else{
                _32.after=_30;
            }
            var _33=_1b(_2f,true);
            _32.data=_33;
            $(_12).tree("insert",_32);
            _14.onDrop.call(_12,_30,_33,_31);
        };
    };
    function _34(_35,_36,_37,_38){
        var _39=$.data(_35,"tree");
        var _3a=_39.options;
        if(!_3a.checkbox){
            return;
        }
        var _3b=_c(_35,_36);
        if(!_3b.checkState){
            return;
        }
        var ck=$(_36).find(".tree-checkbox");
        if(_37==undefined){
            if(ck.hasClass("tree-checkbox1")){
                _37=false;
            }else{
                if(ck.hasClass("tree-checkbox0")){
                    _37=true;
                }else{
                    if(_3b._checked==undefined){
                        _3b._checked=$(_36).find(".tree-checkbox").hasClass("tree-checkbox1");
                    }
                    _37=!_3b._checked;
                }
            }
        }
        _3b._checked=_37;
        if(_37){
            if(ck.hasClass("tree-checkbox1")){
                return;
            }
        }else{
            if(ck.hasClass("tree-checkbox0")){
                return;
            }
        }
        if(!_38){
            if(_3a.onBeforeCheck.call(_35,_3b,_37)==false){
                return;
            }
        }
        if(_3a.cascadeCheck){
            _3c(_35,_3b,_37);
            _3d(_35,_3b);
        }else{
            _3e(_35,_3b,_37?"1":"0");
        }
        if(!_38){
            _3a.onCheck.call(_35,_3b,_37);
        }
    };
    function _3c(_3f,_40,_41){
        var _42=$.data(_3f,"tree").options;
        var _43=_41?1:0;
        _3e(_3f,_40,_43);
        if(_42.deepCheck){
            $.easyui.forEach(_40.children||[],true,function(n){
                _3e(_3f,n,_43);
            });
        }else{
            var _44=[];
            if(_40.children&&_40.children.length){
                _44.push(_40);
            }
            $.easyui.forEach(_40.children||[],true,function(n){
                if(!n.hidden){
                    _3e(_3f,n,_43);
                    if(n.children&&n.children.length){
                        _44.push(n);
                    }
                }
            });
            for(var i=_44.length-1;i>=0;i--){
                var _45=_44[i];
                _3e(_3f,_45,_46(_45));
            }
        }
    };
    function _3e(_47,_48,_49){
        var _4a=$.data(_47,"tree").options;
        if(!_48.checkState||_49==undefined){
            return;
        }
        if(_48.hidden&&!_4a.deepCheck){
            return;
        }
        var ck=$("#"+_48.domId).find(".tree-checkbox");
        _48.checkState=["unchecked","checked","indeterminate"][_49];
        _48.checked=(_48.checkState=="checked");
        ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
        ck.addClass("tree-checkbox"+_49);
    };
    function _3d(_4b,_4c){
        var pd=_4d(_4b,$("#"+_4c.domId)[0]);
        if(pd){
            _3e(_4b,pd,_46(pd));
            _3d(_4b,pd);
        }
    };
    function _46(row){
        var c0=0;
        var c1=0;
        var len=0;
        $.easyui.forEach(row.children||[],false,function(r){
            if(r.checkState){
                len++;
                if(r.checkState=="checked"){
                    c1++;
                }else{
                    if(r.checkState=="unchecked"){
                        c0++;
                    }
                }
            }
        });
        if(len==0){
            return undefined;
        }
        var _4e=0;
        if(c0==len){
            _4e=0;
        }else{
            if(c1==len){
                _4e=1;
            }else{
                _4e=2;
            }
        }
        return _4e;
    };
    function _4f(_50,_51){
        var _52=$.data(_50,"tree").options;
        if(!_52.checkbox){
            return;
        }
        var _53=$(_51);
        var ck=_53.find(".tree-checkbox");
        var _54=_c(_50,_51);
        if(_52.view.hasCheckbox(_50,_54)){
            if(!ck.length){
                _54.checkState=_54.checkState||"unchecked";
                $("<span class=\"tree-checkbox\"></span>").insertBefore(_53.find(".tree-title"));
            }
            if(_54.checkState=="checked"){
                _34(_50,_51,true,true);
            }else{
                if(_54.checkState=="unchecked"){
                    _34(_50,_51,false,true);
                }else{
                    var _55=_46(_54);
                    if(_55===0){
                        _34(_50,_51,false,true);
                    }else{
                        if(_55===1){
                            _34(_50,_51,true,true);
                        }
                    }
                }
            }
        }else{
            ck.remove();
            _54.checkState=undefined;
            _54.checked=undefined;
            _3d(_50,_54);
        }
    };
    function _56(_57,ul,_58,_59,_5a){
        var _5b=$.data(_57,"tree");
        var _5c=_5b.options;
        var _5d=$(ul).prevAll("div.tree-node:first");
        _58=_5c.loadFilter.call(_57,_58,_5d[0]);
        var _5e=_5f(_57,"domId",_5d.attr("id"));
        if(!_59){
            _5e?_5e.children=_58:_5b.data=_58;
            $(ul).empty();
        }else{
            if(_5e){
                _5e.children?_5e.children=_5e.children.concat(_58):_5e.children=_58;
            }else{
                _5b.data=_5b.data.concat(_58);
            }
        }
        _5c.view.render.call(_5c.view,_57,ul,_58);
        if(_5c.dnd){
            _11(_57);
        }
        if(_5e){
            _60(_57,_5e);
        }
        for(var i=0;i<_5b.tmpIds.length;i++){
            _34(_57,$("#"+_5b.tmpIds[i])[0],true,true);
        }
        _5b.tmpIds=[];
        setTimeout(function(){
            _61(_57,_57);
        },0);
        if(!_5a){
            _5c.onLoadSuccess.call(_57,_5e,_58);
        }
    };
    function _61(_62,ul,_63){
        var _64=$.data(_62,"tree").options;
        if(_64.lines){
            $(_62).addClass("tree-lines");
        }else{
            $(_62).removeClass("tree-lines");
            return;
        }
        if(!_63){
            _63=true;
            $(_62).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
            $(_62).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
            var _65=$(_62).tree("getRoots");
            if(_65.length>1){
                $(_65[0].target).addClass("tree-root-first");
            }else{
                if(_65.length==1){
                    $(_65[0].target).addClass("tree-root-one");
                }
            }
        }
        $(ul).children("li").each(function(){
            var _66=$(this).children("div.tree-node");
            var ul=_66.next("ul");
            if(ul.length){
                if($(this).next().length){
                    _67(_66);
                }
                _61(_62,ul,_63);
            }else{
                _68(_66);
            }
        });
        var _69=$(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
        _69.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
        function _68(_6a,_6b){
            var _6c=_6a.find("span.tree-icon");
            _6c.prev("span.tree-indent").addClass("tree-join");
        };
        function _67(_6d){
            var _6e=_6d.find("span.tree-indent, span.tree-hit").length;
            _6d.next().find("div.tree-node").each(function(){
                $(this).children("span:eq("+(_6e-1)+")").addClass("tree-line");
            });
        };
    };
    function _6f(_70,ul,_71,_72){
        var _73=$.data(_70,"tree").options;
        _71=$.extend({},_73.queryParams,_71||{});
        var _74=null;
        if(_70!=ul){
            var _75=$(ul).prev();
            _74=_c(_70,_75[0]);
        }
        if(_73.onBeforeLoad.call(_70,_74,_71)==false){
            return;
        }
        var _76=$(ul).prev().children("span.tree-folder");
        _76.addClass("tree-loading");
        var _77=_73.loader.call(_70,_71,function(_78){
            _76.removeClass("tree-loading");
            _56(_70,ul,_78);
            if(_72){
                _72();
            }
        },function(){
            _76.removeClass("tree-loading");
            _73.onLoadError.apply(_70,arguments);
            if(_72){
                _72();
            }
        });
        if(_77==false){
            _76.removeClass("tree-loading");
        }
    };
    function _79(_7a,_7b,_7c){
        var _7d=$.data(_7a,"tree").options;
        var hit=$(_7b).children("span.tree-hit");
        if(hit.length==0){
            return;
        }
        if(hit.hasClass("tree-expanded")){
            return;
        }
        var _7e=_c(_7a,_7b);
        if(_7d.onBeforeExpand.call(_7a,_7e)==false){
            return;
        }
        hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
        hit.next().addClass("tree-folder-open");
        var ul=$(_7b).next();
        if(ul.length){
            if(_7d.animate){
                ul.slideDown("normal",function(){
                    _7e.state="open";
                    _7d.onExpand.call(_7a,_7e);
                    if(_7c){
                        _7c();
                    }
                });
            }else{
                ul.css("display","block");
                _7e.state="open";
                _7d.onExpand.call(_7a,_7e);
                if(_7c){
                    _7c();
                }
            }
        }else{
            var _7f=$("<ul style=\"display:none\"></ul>").insertAfter(_7b);
            _6f(_7a,_7f[0],{id:_7e.id},function(){
                if(_7f.is(":empty")){
                    _7f.remove();
                }
                if(_7d.animate){
                    _7f.slideDown("normal",function(){
                        _7e.state="open";
                        _7d.onExpand.call(_7a,_7e);
                        if(_7c){
                            _7c();
                        }
                    });
                }else{
                    _7f.css("display","block");
                    _7e.state="open";
                    _7d.onExpand.call(_7a,_7e);
                    if(_7c){
                        _7c();
                    }
                }
            });
        }
    };
    function _80(_81,_82){
        var _83=$.data(_81,"tree").options;
        var hit=$(_82).children("span.tree-hit");
        if(hit.length==0){
            return;
        }
        if(hit.hasClass("tree-collapsed")){
            return;
        }
        var _84=_c(_81,_82);
        if(_83.onBeforeCollapse.call(_81,_84)==false){
            return;
        }
        hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
        hit.next().removeClass("tree-folder-open");
        var ul=$(_82).next();
        if(_83.animate){
            ul.slideUp("normal",function(){
                _84.state="closed";
                _83.onCollapse.call(_81,_84);
            });
        }else{
            ul.css("display","none");
            _84.state="closed";
            _83.onCollapse.call(_81,_84);
        }
    };
    function _85(_86,_87){
        var hit=$(_87).children("span.tree-hit");
        if(hit.length==0){
            return;
        }
        if(hit.hasClass("tree-expanded")){
            _80(_86,_87);
        }else{
            _79(_86,_87);
        }
    };
    function _88(_89,_8a){
        var _8b=_8c(_89,_8a);
        if(_8a){
            _8b.unshift(_c(_89,_8a));
        }
        for(var i=0;i<_8b.length;i++){
            _79(_89,_8b[i].target);
        }
    };
    function _8d(_8e,_8f){
        var _90=[];
        var p=_4d(_8e,_8f);
        while(p){
            _90.unshift(p);
            p=_4d(_8e,p.target);
        }
        for(var i=0;i<_90.length;i++){
            _79(_8e,_90[i].target);
        }
    };
    function _91(_92,_93){
        var c=$(_92).parent();
        while(c[0].tagName!="BODY"&&c.css("overflow-y")!="auto"){
            c=c.parent();
        }
        var n=$(_93);
        var _94=n.offset().top;
        if(c[0].tagName!="BODY"){
            var _95=c.offset().top;
            if(_94<_95){
                c.scrollTop(c.scrollTop()+_94-_95);
            }else{
                if(_94+n.outerHeight()>_95+c.outerHeight()-18){
                    c.scrollTop(c.scrollTop()+_94+n.outerHeight()-_95-c.outerHeight()+18);
                }
            }
        }else{
            c.scrollTop(_94);
        }
    };
    function _96(_97,_98){
        var _99=_8c(_97,_98);
        if(_98){
            _99.unshift(_c(_97,_98));
        }
        for(var i=0;i<_99.length;i++){
            _80(_97,_99[i].target);
        }
    };
    function _9a(_9b,_9c){
        var _9d=$(_9c.parent);
        var _9e=_9c.data;
        if(!_9e){
            return;
        }
        _9e=$.isArray(_9e)?_9e:[_9e];
        if(!_9e.length){
            return;
        }
        var ul;
        if(_9d.length==0){
            ul=$(_9b);
        }else{
            if(_9f(_9b,_9d[0])){
                var _a0=_9d.find("span.tree-icon");
                _a0.removeClass("tree-file").addClass("tree-folder tree-folder-open");
                var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_a0);
                if(hit.prev().length){
                    hit.prev().remove();
                }
            }
            ul=_9d.next();
            if(!ul.length){
                ul=$("<ul></ul>").insertAfter(_9d);
            }
        }
        _56(_9b,ul[0],_9e,true,true);
    };
    function _a1(_a2,_a3){
        var ref=_a3.before||_a3.after;
        var _a4=_4d(_a2,ref);
        var _a5=_a3.data;
        if(!_a5){
            return;
        }
        _a5=$.isArray(_a5)?_a5:[_a5];
        if(!_a5.length){
            return;
        }
        _9a(_a2,{parent:(_a4?_a4.target:null),data:_a5});
        var _a6=_a4?_a4.children:$(_a2).tree("getRoots");
        for(var i=0;i<_a6.length;i++){
            if(_a6[i].domId==$(ref).attr("id")){
                for(var j=_a5.length-1;j>=0;j--){
                    _a6.splice((_a3.before?i:(i+1)),0,_a5[j]);
                }
                _a6.splice(_a6.length-_a5.length,_a5.length);
                break;
            }
        }
        var li=$();
        for(var i=0;i<_a5.length;i++){
            li=li.add($("#"+_a5[i].domId).parent());
        }
        if(_a3.before){
            li.insertBefore($(ref).parent());
        }else{
            li.insertAfter($(ref).parent());
        }
    };
    function _a7(_a8,_a9){
        var _aa=del(_a9);
        $(_a9).parent().remove();
        if(_aa){
            if(!_aa.children||!_aa.children.length){
                var _ab=$(_aa.target);
                _ab.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
                _ab.find(".tree-hit").remove();
                $("<span class=\"tree-indent\"></span>").prependTo(_ab);
                _ab.next().remove();
            }
            _60(_a8,_aa);
        }
        _61(_a8,_a8);
        function del(_ac){
            var id=$(_ac).attr("id");
            var _ad=_4d(_a8,_ac);
            var cc=_ad?_ad.children:$.data(_a8,"tree").data;
            for(var i=0;i<cc.length;i++){
                if(cc[i].domId==id){
                    cc.splice(i,1);
                    break;
                }
            }
            return _ad;
        };
    };
    function _60(_ae,_af){
        var _b0=$.data(_ae,"tree").options;
        var _b1=$(_af.target);
        var _b2=_c(_ae,_af.target);
        if(_b2.iconCls){
            _b1.find(".tree-icon").removeClass(_b2.iconCls);
        }
        $.extend(_b2,_af);
        _b1.find(".tree-title").html(_b0.formatter.call(_ae,_b2));
        if(_b2.iconCls){
            _b1.find(".tree-icon").addClass(_b2.iconCls);
        }
        _4f(_ae,_af.target);
    };
    function _b3(_b4,_b5){
        if(_b5){
            var p=_4d(_b4,_b5);
            while(p){
                _b5=p.target;
                p=_4d(_b4,_b5);
            }
            return _c(_b4,_b5);
        }else{
            var _b6=_b7(_b4);
            return _b6.length?_b6[0]:null;
        }
    };
    function _b7(_b8){
        var _b9=$.data(_b8,"tree").data;
        for(var i=0;i<_b9.length;i++){
            _ba(_b9[i]);
        }
        return _b9;
    };
    function _8c(_bb,_bc){
        var _bd=[];
        var n=_c(_bb,_bc);
        var _be=n?(n.children||[]):$.data(_bb,"tree").data;
        $.easyui.forEach(_be,true,function(_bf){
            _bd.push(_ba(_bf));
        });
        return _bd;
    };
    function _4d(_c0,_c1){
        var p=$(_c1).closest("ul").prevAll("div.tree-node:first");
        return _c(_c0,p[0]);
    };
    function _c2(_c3,_c4){
        _c4=_c4||"checked";
        if(!$.isArray(_c4)){
            _c4=[_c4];
        }
        var _c5=[];
        $.easyui.forEach($.data(_c3,"tree").data,true,function(n){
            if(n.checkState&&$.easyui.indexOfArray(_c4,n.checkState)!=-1){
                _c5.push(_ba(n));
            }
        });
        return _c5;
    };
    function _c6(_c7){
        var _c8=$(_c7).find("div.tree-node-selected");
        return _c8.length?_c(_c7,_c8[0]):null;
    };
    function _c9(_ca,_cb){
        var _cc=_c(_ca,_cb);
        if(_cc&&_cc.children){
            $.easyui.forEach(_cc.children,true,function(_cd){
                _ba(_cd);
            });
        }
        return _cc;
    };
    function _c(_ce,_cf){
        return _5f(_ce,"domId",$(_cf).attr("id"));
    };
    function _d0(_d1,id){
        return _5f(_d1,"id",id);
    };
    function _5f(_d2,_d3,_d4){
        var _d5=$.data(_d2,"tree").data;
        var _d6=null;
        $.easyui.forEach(_d5,true,function(_d7){
            if(_d7[_d3]==_d4){
                _d6=_ba(_d7);
                return false;
            }
        });
        return _d6;
    };
    function _ba(_d8){
        _d8.target=$("#"+_d8.domId)[0];
        return _d8;
    };
    function _d9(_da,_db){
        var _dc=$.data(_da,"tree").options;
        var _dd=_c(_da,_db);
        if(_dc.onBeforeSelect.call(_da,_dd)==false){
            return;
        }
        $(_da).find("div.tree-node-selected").removeClass("tree-node-selected");
        $(_db).addClass("tree-node-selected");
        _dc.onSelect.call(_da,_dd);
    };
    function _9f(_de,_df){
        return $(_df).children("span.tree-hit").length==0;
    };
    function _e0(_e1,_e2){
        var _e3=$.data(_e1,"tree").options;
        var _e4=_c(_e1,_e2);
        if(_e3.onBeforeEdit.call(_e1,_e4)==false){
            return;
        }
        $(_e2).css("position","relative");
        var nt=$(_e2).find(".tree-title");
        var _e5=nt.outerWidth();
        nt.empty();
        var _e6=$("<input class=\"tree-editor\">").appendTo(nt);
        _e6.val(_e4.text).focus();
        _e6.width(_e5+20);
        _e6._outerHeight(18);
        _e6.bind("click",function(e){
            return false;
        }).bind("mousedown",function(e){
            e.stopPropagation();
        }).bind("mousemove",function(e){
            e.stopPropagation();
        }).bind("keydown",function(e){
            if(e.keyCode==13){
                _e7(_e1,_e2);
                return false;
            }else{
                if(e.keyCode==27){
                    _ed(_e1,_e2);
                    return false;
                }
            }
        }).bind("blur",function(e){
            e.stopPropagation();
            _e7(_e1,_e2);
        });
    };
    function _e7(_e8,_e9){
        var _ea=$.data(_e8,"tree").options;
        $(_e9).css("position","");
        var _eb=$(_e9).find("input.tree-editor");
        var val=_eb.val();
        _eb.remove();
        var _ec=_c(_e8,_e9);
        _ec.text=val;
        _60(_e8,_ec);
        _ea.onAfterEdit.call(_e8,_ec);
    };
    function _ed(_ee,_ef){
        var _f0=$.data(_ee,"tree").options;
        $(_ef).css("position","");
        $(_ef).find("input.tree-editor").remove();
        var _f1=_c(_ee,_ef);
        _60(_ee,_f1);
        _f0.onCancelEdit.call(_ee,_f1);
    };
    function _f2(_f3,q){
        var _f4=$.data(_f3,"tree");
        var _f5=_f4.options;
        var ids={};
        $.easyui.forEach(_f4.data,true,function(_f6){
            if(_f5.filter.call(_f3,q,_f6)){
                $("#"+_f6.domId).removeClass("tree-node-hidden");
                ids[_f6.domId]=1;
                _f6.hidden=false;
            }else{
                $("#"+_f6.domId).addClass("tree-node-hidden");
                _f6.hidden=true;
            }
        });
        for(var id in ids){
            _f7(id);
        }
        function _f7(_f8){
            var p=$(_f3).tree("getParent",$("#"+_f8)[0]);
            while(p){
                $(p.target).removeClass("tree-node-hidden");
                p.hidden=false;
                p=$(_f3).tree("getParent",p.target);
            }
        };
    };
    $.fn.tree=function(_f9,_fa){
        if(typeof _f9=="string"){
            return $.fn.tree.methods[_f9](this,_fa);
        }
        var _f9=_f9||{};
        return this.each(function(){
            var _fb=$.data(this,"tree");
            var _fc;
            if(_fb){
                _fc=$.extend(_fb.options,_f9);
                _fb.options=_fc;
            }else{
                _fc=$.extend({},$.fn.tree.defaults,$.fn.tree.parseOptions(this),_f9);
                $.data(this,"tree",{options:_fc,tree:_1(this),data:[],tmpIds:[]});
                var _fd=$.fn.tree.parseData(this);
                if(_fd.length){
                    _56(this,this,_fd);
                }
            }
            _4(this);
            if(_fc.data){
                _56(this,this,$.extend(true,[],_fc.data));
            }
            _6f(this,this);
        });
    };
    $.fn.tree.methods={options:function(jq){
            return $.data(jq[0],"tree").options;
        },loadData:function(jq,_fe){
            return jq.each(function(){
                _56(this,this,_fe);
            });
        },getNode:function(jq,_ff){
            return _c(jq[0],_ff);
        },getData:function(jq,_100){
            return _c9(jq[0],_100);
        },reload:function(jq,_101){
            return jq.each(function(){
                if(_101){
                    var node=$(_101);
                    var hit=node.children("span.tree-hit");
                    hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
                    node.next().remove();
                    _79(this,_101);
                }else{
                    $(this).empty();
                    _6f(this,this);
                }
            });
        },getRoot:function(jq,_102){
            return _b3(jq[0],_102);
        },getRoots:function(jq){
            return _b7(jq[0]);
        },getParent:function(jq,_103){
            return _4d(jq[0],_103);
        },getChildren:function(jq,_104){
            return _8c(jq[0],_104);
        },getChecked:function(jq,_105){
            return _c2(jq[0],_105);
        },getSelected:function(jq){
            return _c6(jq[0]);
        },isLeaf:function(jq,_106){
            return _9f(jq[0],_106);
        },find:function(jq,id){
            return _d0(jq[0],id);
        },select:function(jq,_107){
            return jq.each(function(){
                _d9(this,_107);
            });
        },check:function(jq,_108){
            return jq.each(function(){
                _34(this,_108,true);
            });
        },uncheck:function(jq,_109){
            return jq.each(function(){
                _34(this,_109,false);
            });
        },collapse:function(jq,_10a){
            return jq.each(function(){
                _80(this,_10a);
            });
        },expand:function(jq,_10b){
            return jq.each(function(){
                _79(this,_10b);
            });
        },collapseAll:function(jq,_10c){
            return jq.each(function(){
                _96(this,_10c);
            });
        },expandAll:function(jq,_10d){
            return jq.each(function(){
                _88(this,_10d);
            });
        },expandTo:function(jq,_10e){
            return jq.each(function(){
                _8d(this,_10e);
            });
        },scrollTo:function(jq,_10f){
            return jq.each(function(){
                _91(this,_10f);
            });
        },toggle:function(jq,_110){
            return jq.each(function(){
                _85(this,_110);
            });
        },append:function(jq,_111){
            return jq.each(function(){
                _9a(this,_111);
            });
        },insert:function(jq,_112){
            return jq.each(function(){
                _a1(this,_112);
            });
        },remove:function(jq,_113){
            return jq.each(function(){
                _a7(this,_113);
            });
        },pop:function(jq,_114){
            var node=jq.tree("getData",_114);
            jq.tree("remove",_114);
            return node;
        },update:function(jq,_115){
            return jq.each(function(){
                _60(this,$.extend({},_115,{checkState:_115.checked?"checked":(_115.checked===false?"unchecked":undefined)}));
            });
        },enableDnd:function(jq){
            return jq.each(function(){
                _11(this);
            });
        },disableDnd:function(jq){
            return jq.each(function(){
                _d(this);
            });
        },beginEdit:function(jq,_116){
            return jq.each(function(){
                _e0(this,_116);
            });
        },endEdit:function(jq,_117){
            return jq.each(function(){
                _e7(this,_117);
            });
        },cancelEdit:function(jq,_118){
            return jq.each(function(){
                _ed(this,_118);
            });
        },doFilter:function(jq,q){
            return jq.each(function(){
                _f2(this,q);
            });
        }};
    $.fn.tree.parseOptions=function(_119){
        var t=$(_119);
        return $.extend({},$.parser.parseOptions(_119,["url","method",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean",lines:"boolean",dnd:"boolean"}]));
    };
    $.fn.tree.parseData=function(_11a){
        var data=[];
        _11b(data,$(_11a));
        return data;
        function _11b(aa,tree){
            tree.children("li").each(function(){
                var node=$(this);
                var item=$.extend({},$.parser.parseOptions(this,["id","iconCls","state"]),{checked:(node.attr("checked")?true:undefined)});
                item.text=node.children("span").html();
                if(!item.text){
                    item.text=node.html();
                }
                var _11c=node.children("ul");
                if(_11c.length){
                    item.children=[];
                    _11b(item.children,_11c);
                }
                aa.push(item);
            });
        };
    };
    var _11d=1;
    var _11e={render:function(_11f,ul,data){
            var _120=$.data(_11f,"tree");
            var opts=_120.options;
            var _121=$(ul).prev(".tree-node");
            var _122=_121.length?$(_11f).tree("getNode",_121[0]):null;
            var _123=_121.find("span.tree-indent, span.tree-hit").length;
            var cc=_124.call(this,_123,data);
            $(ul).append(cc.join(""));
            function _124(_125,_126){
                var cc=[];
                for(var i=0;i<_126.length;i++){
                    var item=_126[i];
                    if(item.state!="open"&&item.state!="closed"){
                        item.state="open";
                    }
                    item.domId="_easyui_tree_"+_11d++;
                    cc.push("<li>");
                    cc.push("<div id=\""+item.domId+"\" class=\"tree-node\">");
                    for(var j=0;j<_125;j++){
                        cc.push("<span class=\"tree-indent\"></span>");
                    }
                    if(item.state=="closed"){
                        cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
                        cc.push("<span class=\"tree-icon tree-icon-font tree-folder "+(item.iconCls?item.iconCls:"")+"\"></span>");
                    }else{
                        if(item.children&&item.children.length){
                            cc.push("<span class=\"tree-hit tree-expanded\"></span>");
                            cc.push("<span class=\"tree-icon tree-icon-font tree-folder tree-folder-open "+(item.iconCls?item.iconCls:"")+"\"></span>");
                        }else{
                            cc.push("<span class=\"tree-indent\"></span>");
                            cc.push("<span class=\"tree-icon tree-icon-font tree-file "+(item.iconCls?item.iconCls:"")+"\"></span>");
                        }
                    }
                    if(this.hasCheckbox(_11f,item)){
                        var flag=0;
                        if(_122&&_122.checkState=="checked"&&opts.cascadeCheck){
                            flag=1;
                            item.checked=true;
                        }else{
                            if(item.checked){
                                $.easyui.addArrayItem(_120.tmpIds,item.domId);
                            }
                        }
                        item.checkState=flag?"checked":"unchecked";
                        cc.push("<span class=\"tree-checkbox tree-checkbox"+flag+"\"></span>");
                    }else{
                        item.checkState=undefined;
                        item.checked=undefined;
                    }
                    cc.push("<span class=\"tree-title\">"+opts.formatter.call(_11f,item)+"</span>");
                    cc.push("</div>");
                    if(item.children&&item.children.length){
                        var tmp=_124.call(this,_125+1,item.children);
                        cc.push("<ul style=\"display:"+(item.state=="closed"?"none":"block")+"\">");
                        cc=cc.concat(tmp);
                        cc.push("</ul>");
                    }
                    cc.push("</li>");
                }
                return cc;
            };
        },hasCheckbox:function(_127,item){
            var _128=$.data(_127,"tree");
            var opts=_128.options;
            if(opts.checkbox){
                if($.isFunction(opts.checkbox)){
                    if(opts.checkbox.call(_127,item)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(opts.onlyLeafCheck){
                        if(item.state=="open"&&!(item.children&&item.children.length)){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
            return false;
        }};
    $.fn.tree.defaults={url:null,method:"post",animate:false,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,dnd:false,data:null,queryParams:{},formatter:function(node){
            return node.text;
        },filter:function(q,node){
            var qq=[];
            $.map($.isArray(q)?q:[q],function(q){
                q=$.trim(q);
                if(q){
                    qq.push(q);
                }
            });
            for(var i=0;i<qq.length;i++){
                var _129=node.text.toLowerCase().indexOf(qq[i].toLowerCase());
                if(_129>=0){
                    return true;
                }
            }
            return !qq.length;
        },loader:function(_12a,_12b,_12c){
            var opts=$(this).tree("options");
            if(!opts.url){
                return false;
            }
            $.ajax({type:opts.method,url:opts.url,data:_12a,dataType:"json",success:function(data){
                    _12b(data);
                },error:function(){
                    _12c.apply(this,arguments);
                }});
        },loadFilter:function(data,_12d){
            return data;
        },view:_11e,onBeforeLoad:function(node,_12e){
        },onLoadSuccess:function(node,data){
        },onLoadError:function(){
        },onClick:function(node){
        },onDblClick:function(node){
        },onBeforeExpand:function(node){
        },onExpand:function(node){
        },onBeforeCollapse:function(node){
        },onCollapse:function(node){
        },onBeforeCheck:function(node,_12f){
        },onCheck:function(node,_130){
        },onBeforeSelect:function(node){
        },onSelect:function(node){
        },onContextMenu:function(e,node){
        },onBeforeDrag:function(node){
        },onStartDrag:function(node){
        },onStopDrag:function(node){
        },onDragEnter:function(_131,_132){
        },onDragOver:function(_133,_134){
        },onDragLeave:function(_135,_136){
        },onBeforeDrop:function(_137,_138,_139){
        },onDrop:function(_13a,_13b,_13c){
        },onBeforeEdit:function(node){
        },onAfterEdit:function(node){
        },onCancelEdit:function(node){
        }};
})(jQuery);