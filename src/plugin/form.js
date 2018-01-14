/**
 * 表单组件
 */

(function ($) {

    //函数扩展
    /**
     * 调整验证选项回调
     * @param callback
     */
    jx.onFormValidateOptionsInit = function (callback) {
        jx.regCallbacks('jxform.validateOptions.init', callback);
    };

    //实现类
    var Form = function ($ele, ops) {
        var $element = $ele;
        var options = ops || {};

        var init = function () {
            if (!options.maskTarget) {
                options.maskTarget = $element;
            }

            var valid = {
                errorElement: 'span',
                errorClass: 'help-block help-block-error',
                focusInvalid: false,
                ignore: ':hidden',
                messages: {},
                rules: {},
                errorPlacement: function (error, element) {
                    // if (element.parent(".input-group").size() > 0) {
                    //     error.insertAfter(element.parent(".input-group"));
                    // } else if (element.attr("data-error-container")) {
                    //     error.appendTo(element.attr("data-error-container"));
                    // } else if (element.parents('.icheck-list').size() > 0) {
                    //     error.appendTo(element.parents('.icheck-list'));
                    // } else if (element.parents('.icheck-inline').size() > 0) {
                    //     error.appendTo(element.parents('.icheck-inline'));
                    // } else if (element.parents('.radio-list').size() > 0) {
                    //     error.appendTo(element.parents('.radio-list'));
                    // } else if (element.parents('.iradio-inline').size() > 0) {
                    //     error.appendTo(element.parents('.iradio-inline'));
                    // } else if (element.is('.uiselect')) {
                    //     error.appendTo(element.parent());
                    // } else if (element.is('.uifileupload')) {
                    //     error.appendTo(element.closest('.file-input'));
                    // } else if (element.is('.uispin')) {
                    //     error.insertAfter(element.parent(".input-group"));
                    // } else {
                    //     error.insertAfter(element);
                    // }
                    // error.insertAfter(element);

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

            //#region jxform.validateOptions.init

            var validateOptionsCallbacks = jx.getCallbacks('jxform.validateOptions.init');
            for (var j = 0; j < validateOptionsCallbacks.length; j++) {
                var cback = validateOptionsCallbacks[j];
                if (!cback) continue;
                cback(valid);
            }

            //#endregion

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
                    if (options.requiredStar === true && ruleObj.required === true) {
                        $(this).closest('td').prepend('<div class="required required-wrapper"></div>');
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
        };

        var protipElement = function ($ele) {
            if (options.protipElement) {
                return options.protipElement($ele);
            }
            return $ele;
        };

        /**
         * 提交表单
         */
        var ajaxSubmit = function () {
            if ($element.valid()===false) {
                return;
            }
            var data = {};
            $element.find('input[type=checkbox]').each(function () {
                if ($(this).prop('checked') !== true) {
                    var name = $(this).attr('name');
                    data[name] = $(this).prop('checked');
                }
            });

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
                    jx.ajaxFail(result);
                    $element.triggerHandler('errorsubmit', [result]);
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
        init();

        return {
            /**
             * 序列化表单值
             */
            serialize: function () {
                return $element.formSerialize();
            },
            /**
             * 重置表单
             */
            resetForm: function () {
                $element.resetForm();
            },
            /**
             * 清空表单
             */
            clearForm: function () {
                $element.clearForm();
            },
            /**
             * 提交表单
             */
            ajaxSubmit:function () {
                ajaxSubmit();
            }
        }
    };

    //插件定义
    jx.plugin({
        name: 'jxform',
        instance: function ($ele, ops) {
            return Form($ele, ops);
        },
        options: function ($ele) {
            return jx.parseOptions($ele, ['maskMsg', 'maskDelay',
                {maskTarget: 'object'}, {protip: 'boolean'}, {msgtip: 'boolean'}]);
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
             * 验证选项
             */
            validateOptions: {},

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

    //实例化
    jx.onAfterInit(function (e) {
        $(e.target).find('form.jxform').jxform();
    });

}(jQuery));