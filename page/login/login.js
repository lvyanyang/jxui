/**
 * 登录模块
 */
var Login = function () {
    //变量赋值
    var $account = $('#account');
    var $password = $('#password');
    var $captcha = $('#captcha');
    var $captchaImg = $('#captcha_img');
    var $autoLogin = $('#auto_login');
    var $form = $('#login_form');
    var $btnLogin = $('#btn_login');
    var $captchaContainer = $('.captcha-container');
    var loginUrl = $form.data('url');

    // var timeoutHandle = -1;

    /**
     * 初始化验证码
     */
    var initCaptcha = function () {
        if (requireCaptcha()) { //需要验证码
            refreshCaptcha();
        }
        $captchaImg.on('click', refreshCaptcha);
    };

    /**
     * 刷新验证码
     */
    var refreshCaptcha = function () {
        var url = $captchaImg.data('url') + '?_t=' + Math.random();
        $captchaImg.attr('src', url);
    };

    /**
     * 显示消息
     * @param msg 消息内容
     */
    var showMsg = function (msg) {
        toastr.error(msg);
    };

    /**
     * 隐藏消息
     */
    var hideMsg = function () {
        toastr.clear();
    };

    /**
     * 是否需要验证码
     */
    var requireCaptcha = function () {
        return $('.captcha-container').css('display') != 'none';
    };

    /**
     * 初始化控件事件
     */
    var initEvent = function () {

        $btnLogin.on('click', function () {
            hideMsg();
            login();
        });

        $account.on('keydown', function (e) {
            hideMsg();
            if (e.keyCode === 13) { //回车
                if (!$(this).val().length) {
                    showMsg($(this).data('msg'));
                }
                else {
                    $password.focus();
                }
            }
        });

        $password.on('keydown', function (e) {
            hideMsg();
            if (e.keyCode === 27) { //Esc
                $account.focus();
                return;
            }
            if (e.keyCode === 13) { //回车
                if (!$(this).val()) {
                    showMsg($(this).data('msg'));
                }
                else if (requireCaptcha()) {
                    $captcha.focus();
                }
                else {
                    login();
                }
            }
        });

        if (requireCaptcha()) { //需要验证码
            $captcha.on('keydown', function (e) {
                hideMsg();
                if (e.keyCode === 27) { //Esc
                    $password.focus();
                    return;
                }
                if (e.keyCode === 13) { //回车
                    if (!$(this).val()) {
                        showMsg($(this).data('msg'));
                    }
                    else {
                        login();
                    }
                }
            });
        }
    };

    /**
     * 验证文本框
     * 验证通过返回true,不通过返回false
     */
    var valid = function () {
        if (!$account.val()) {
            showMsg($account.data('msg'));
            $account.focus();
            return false;
        }
        if (!$password.val()) {
            showMsg($password.data('msg'));
            $password.focus();
            return false;
        }
        if (requireCaptcha()) { //需要验证码
            if (!$captcha.val()) {
                showMsg($captcha.data('msg'));
                $captcha.focus();
                return false;
            }
        }
        if (!loginUrl) {
            showMsg('请指定登录验证Url');
            return false;
        }
        return true;
    };

    /**
     * 禁用文本框
     */
    var disableInput = function () {
        // timeoutHandle = setTimeout(function () {}, 500);
        $account.attr('disabled', '');
        $password.attr('disabled', '');
        $captcha.attr('disabled', '');
        $autoLogin.attr('disabled', '');
        $btnLogin.val('登录中..').attr('disabled', '');
    };

    /**
     * 启用文本框
     */
    var enableInput = function () {
        // clearTimeout(timeoutHandle);
        $account.removeAttr('disabled');
        $password.removeAttr('disabled');
        $captcha.removeAttr('disabled');
        $autoLogin.removeAttr('disabled');
        $btnLogin.val('登 录').removeAttr('disabled');
    };

    /**
     * 获取提交的数据
     */
    var getPostData = function () {
        var d = {
            account: $account.val(),
            password: $password.val(),
            captcha: $captcha.val(),
            autoLogin: $autoLogin.prop('checked'),
            browser: '',
            device: '',
            os: ''
        };
        var pubkey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCaa9HnhyNTF1O8ChMmPPKZC8NFSCw+didy6Rf/nTBdzF/y/wvgz9CVfDjmatetmj3zLaFiyWjHCYw6f7e+TKGKCSq92qVGIFkCIhWoMcPPigrV8x75OjzZnfvfJsoOyllh7GqCJYAVLBq37wyWjOEXmJ41yHUv10e+562YP000KQIDAQAB';
        // 利用公钥加密
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubkey);
        return {d: encrypt.encrypt(JSON.stringify(d))};
    };

    /**
     * 系统登录
     */
    var login = function () {
        if (!valid()) {
            return;
        }
        hideMsg();
        disableInput();
        var send = function () {
            $.ajax({
                url: loginUrl,
                type: 'post',
                dataType: 'json',
                data: getPostData()
            }).done(function (result) {
                if (result.success) {
                    $btnLogin.val('登陆成功,正在跳转...');
                    window.location.href = result.url || '/';
                } else {
                    showMsg(result.msg);
                    enableInput();
                    //if (result.captcha == '1') {
                        $captchaContainer.show(200);
                        refreshCaptcha();
                        $captcha.focus();
                    //}
                }
            }).fail(function (request) {
                if (request.responseJSON) {
                    showMsg(request.responseJSON.message || '登录失败');
                }
                else {
                    showMsg(request.statusText || '登录失败');
                }
                enableInput();
            });
        };
        jx.require('encrypt', send);
    };

    /**
     * 系统登录初始化
     */
    var init = function () {
        initCaptcha();
        initEvent();
    }();
};

jx.ready(function () {
    window.login = Login();
});