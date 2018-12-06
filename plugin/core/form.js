/**
 * 表单组件
 */

//实现类
jx.ui.Form = function (element, options) {
    var $element = $(element);
    var isTableLayout = options.layout === 'table';

    var protipElement = function ($ele) {
        if (options.protipElement) {
            return options.protipElement($ele);
        }
        return $ele;
    };

    var ajaxSubmit = function () {
        if ($element.valid() === false) {
            return;
        }
        var data = {};
        $element.find('input[type=checkbox]').each(function () {
            if ($(this).prop('checked') === false) {
                var name = $(this).attr('name');
                data[name] = $(this).data('uncheckedValue');
            }
        });

        var $requestVerificationToken = $('[name=__RequestVerificationToken]');
        if ($requestVerificationToken.length > 0) {
            data['__RequestVerificationToken'] = $requestVerificationToken.val();
        }

        $.extend(data, options.submitParams);

        //region beforesubmit 事件

        var e = $.Event('beforesubmit');
        $element.triggerHandler(e, [data]);
        if (e.result === false) {
            return;
        }

        //endregion

        var ops = $.extend({}, options, {
            data: data,
            dataType: 'json',
            //beforeSend: function () {
            //},
            //complete: function () {
            //},
            error: function (result) {
                options.maskTarget.unmask();
                $element.triggerHandler('errorsubmit', [result]);
                if (options.silent === true) {
                    return;
                }
                jx.ajaxFail(result);
            },
            success: function (result) {
                options.maskTarget.unmask();
                $element.triggerHandler('aftersubmit', [result]);
            }
        });
        options.maskTarget.mask(options.maskMsg, options.maskDelay);
        $element.ajaxSubmit(ops);
    };

    //初始化插件
    var init = function () {
        if (!options.maskTarget) {
            options.maskTarget = $(document.body);
        }
        if (!options.submitParams) {
            options.submitParams = {};
        }
        var valid = {};

        if (!isTableLayout) {
            options.highlightElement = function (element) {
                return $(element).closest('.form-group');
            };
            options.errorPlacement = function (error, element) {
                if (element.parent(".input-group").size() > 0) {
                    error.insertAfter(element.parent(".input-group"));
                } else if (element.attr("data-error-container")) {
                    error.appendTo(element.attr("data-error-container"));
                } else if (element.parents('.icheck-list').size() > 0) {
                    error.appendTo(element.parents('.icheck-list'));
                } else if (element.parents('.icheck-inline').size() > 0) {
                    error.appendTo(element.parents('.icheck-inline'));
                } else if (element.parents('.radio-list').size() > 0) {
                    error.appendTo(element.parents('.radio-list'));
                } else if (element.parents('.iradio-inline').size() > 0) {
                    error.appendTo(element.parents('.iradio-inline'));
                } else if (element.is('.jxselect2')) {
                    error.appendTo(element.parent());
                } else if (element.is('.jxfileupload')) {
                    error.appendTo(element.closest('.file-input'));
                } else if (element.is('.jxspin')) {
                    error.insertAfter(element.parent(".input-group"));
                } else {
                    error.insertAfter(element);
                }
            };
        }

        valid = {
            messages: {},
            rules: {},
            errorPlacement: function (error, element) {
                if (options.errorPlacement) {
                    options.errorPlacement(error, element);
                }
                if (options.protip === true) {
                    if (element.data('protip') === false) return;
                    var pele = protipElement(element);
                    pele.protipSet({
                        title: error.html()
                    });
                }
            },
            highlight: function (element) {
                var $ele = $(element);
                if (options.highlightElement) {
                    options.highlightElement($ele).addClass('has-error');
                }
            },
            unhighlight: function (element) {
                var $ele = $(element);
                if (options.highlightElement) {
                    options.highlightElement($ele).removeClass('has-error');
                }
                if (options.protip === true) {
                    if ($ele.data('protip') === false) return;
                    var pele = protipElement($ele);
                    pele.protipSet({
                        title: null
                    });
                }
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            invalidHandler: function (e, instance) {
                var $ele = $(instance.errorList[0].element);
                $(document.body).animate({
                    scrollTop: $ele.offset().top - 15
                }, 'slow');

                $ele[0].focus();
                if (options.msgtip === true && instance.errorList.length > 0) {
                    toastr.clear();
                    toastr.error(instance.errorList[0].message || '请按规则填写表单', '');
                }
            },
            submitHandler: function () {
                ajaxSubmit();
            }
        };

        //转换验证规则
        $element.find('[data-validate]').each(function () {
            var name = $(this).attr('name');
            if (!name) {
                console.log(this);
                console.log('请指定name属性');
                return;
            }
            var rule = $(this).data('validate');
            if (rule) {
                var obj = jx.toObj(rule);
                var ruleObj = {};
                var msgObj = {};
                $.each(obj, function (k, v) {
                    if (jx.isArray(v)) {
                        ruleObj[k] = v[0];
                        msgObj[k] = v[1];
                    }
                    else {
                        ruleObj[k] = v;
                    }
                });
                valid.rules[name] = ruleObj;
                valid.messages[name] = msgObj;
                if (options.requiredStar === true && ruleObj.required === true && $(this).data('star') !== false) {
                    if ($(this).hasClass('jxcheck')) {
                        $(this).closest('.input-group').prepend('<div class="required required-icheck-inline-wrapper"></div>');
                    }
                    else {
                        if (isTableLayout) {
                            $(this).closest('td').prepend('<div class="required required-wrapper"></div>');
                        }
                        else {
                            $(this).before('<div class="required required-wrapper"></div>');
                        }
                    }
                }
            }
            // var name = $(this).attr('name');
            // var rule = $(this).data('validate');
            // var message = $(this).data('validateMessage');
            // if (rule) {
            //     valid.rules[name] = jx.toObj(rule);
            // }
            // if (message) {
            //     valid.messages[name] = jx.toObj(message);
            // }
        });

        if (options.validateOptions) {
            $.extend(valid, options.validateOptions);
        }
        $element.validate(valid);

        if (jx.debug) {
            console.log('表单验证选项:%o', valid);
        }

        if (options.protip === true) {
            if ($.protip) {
                $.protip({
                    iconTemplate: '<i class="fa fa-{icon}"></i>',
                    defaults: {
                        // trigger:'sticky',
                        position: 'bottom-left',
                        icon: 'info-circle',
                        scheme: 'red'
                    }
                });
            }
        }
    }();

    return {
        getOptions: function () {
            return options;
        },
        setOptions: function (ops) {
            $.extend(options, ops);
        },
        /**
         * 序列化表单值
         */
        serialize: function () {
            return $element.formSerialize();
        },
        /**
         * 重置表单
         */
        reset: function () {
            $element.resetForm();
        },
        /**
         * 清空表单
         */
        clear: function () {
            $element.clearForm();
        },
        /**
         * 提交表单
         */
        submit: function () {
            ajaxSubmit();
        }
    }
};

//插件定义
jx.plugin({
    name: 'jxform',
    create: jx.ui.Form,
    options: function (element) {
        return jx.parseOptions($(element), ['maskMsg', 'maskDelay', 'layout',
            {maskTarget: 'jquery'}, {protip: 'boolean'}, {msgtip: 'boolean'}]);
    },
    defaults: {
        /**
         * 消息提示容器
         */
        maskTarget: null,

        /**
         * 加载提示消息
         */
        maskMsg: '正在提交数据,请稍等...',

        /**
         * 加载提示延迟毫秒
         */
        maskDelay: 100,

        /**
         * 布局方式
         */
        layout: 'table',

        /**
         * 是否显示浮动提示
         */
        protip: true,

        /**
         * 是否显示消息提示
         */
        msgtip: true,

        /**
         * 自动显示必填星号
         */
        requiredStar: true,

        /**
         * 提交参数
         */
        submitParams: {},

        /**
         * 验证选项
         */
        validateOptions: {
            errorElement: 'span',
            errorClass: 'help-block help-block-error',
            focusInvalid: false,
            ignore: ':hidden'
        },

        highlightElement: function ($ele) {
            return $ele.closest('td');
        },

        /**
         * 获取提示元素
         */
        protipElement: function ($ele) {
            //|| $ele.is('.editormd-markdown-textarea')
            if ($ele.is('select.jxchosen,select.jxselect2')) {
                return $ele.next();
            }
            return $ele;
        }
    }
});
