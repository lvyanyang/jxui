/**
 * 主界面模块
 */
var App = function () {

    var $body = $(document.body);
    var $center = $('#layout-center');
    var $west = $('#layout-west');
    var $tree = $west.find('.jxtree');
    var $navHome = $('#nav_home');
    var $navLogout = $('#nav_logout');
    var $menuFilter = $tree.parent().find('.jxtree-filter');

    /**
     * 初始化导航菜单
     */
    var initTree = function () {
        var treeOps = {
            maskMsg: $tree.data('maskMsg') || '正在加载菜单...',
            onLoadSuccess: function () {
                var hashId = window.location.hash.replace('#', '');
                if (hashId) {
                    var node = $(this).tree('find', hashId);
                    if (!node) return;
                    $(this).tree('expandTo', node.target);
                    $(this).tree('select', node.target);
                    loadPage(node.url, node.text);
                }
                else {
                    loadHome();
                }
            },
            onClick: function (node) {
                $(this).tree('expand', node.target);
                loadPage(node.url, node.text);
                window.location.hash = node.id;
            },
            onDblClick: function (node) {
                if (node.state === 'open') {
                    $(this).tree('collapse', node.target);
                }
            },
            onContextMenu: function (e, node) {
                $(this).tree('select', node.target);
                e.preventDefault();
            }
        };
        if ($menuFilter.length > 0) {
            treeOps.filterBox = $menuFilter;
        }
        $tree.jxoptions(treeOps);
    };

    /**
     * 加载主页
     */
    var loadHome = function () {
        var url = $center.data('url');
        var title = $center.data('title');
        loadPage(url, title);
    };

    /**
     * 初始化主布局
     */
    var initLayout = function () {
        jx.monitorLayoutPanel($body, 'west', 'webapp');
    };

    /**
     * 初始化导航按钮
     */
    var initNav = function () {
        $navHome.on('click', function () {
            window.location.hash = '';
            loadHome();
        });

        $navLogout.on('click', function () {
            var url = $(this).data('url');
            layer.confirm('注：您确定要安全退出本次登录吗？', {icon: 0, title: '系统提示', skin: 'jxnav-layer'}, function (index) {
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {}
                }).done(function (result) {
                    layer.close(index);
                    if (result.success) {
                        window.location.href = result.url;
                    } else {

                    }
                }).fail(function (request) {
                    if (request.responseJSON) {
                        layer.alert(request.responseJSON.message || '登录失败');
                    }
                    else {
                        layer.alert(request.statusText || '登录失败');
                    }
                });
            });
        });

        // $('.icon-bubbles').jxflash();

        $('#user_feedback').click(function () {
            jx.require('sweetalert', function () {
                swal({
                    title: '恭喜您,操作成功!',
                    text: '请点击确定按钮',
                    type: 'success',
                    allowOutsideClick: true,
                    html: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: '<i class="icon-like"></i> 确定',
                    cancelButtonText: '取消'
                });
            });
        });

        $('#user_message').click(function () {
            jx.require('sweetalert', function () {
                swal({
                    title: '很抱歉,您没有操作的权限!',
                    text: '请点击确定按钮',
                    type: 'error',
                    html: true,
                    confirmButtonClass: 'btn-danger',
                    confirmButtonText: '<i class="icon-dislike"></i> 确定'
                });
            });
        });
    };

    /**
     * 加载页面
     * @param title 标题
     * @param url Url
     */
    var loadPage = function (url, title) {
        if (!url || url === '#') return;
        var centerPanel = $body.layout('panel', 'center');
        var _url = url + ((/\?/).test(url) ? '&' : '?') + '_ts=' + (Date.now());
        var _title = title || centerPanel.title;
        centerPanel.panel({
            title: null,
            content: '<iframe frameborder="0" style="width:100%;height:100%;" src="' + _url + '" ></iframe>'
        });

        centerPanel.mask('正在加载 <span style="color: red;font-weight: bold;">' + _title + '</span> 请稍等...', 500);
        centerPanel.find('iframe').on('load', function () {
            centerPanel.unmask();
        });
    };

    /**
     * 应用程序初始化
     */
    var init = function () {
        initTree();
        initLayout();
        initNav();
    };

    //初始化调用
    init();

    return {
        /**
         * 加载页面
         * @param url Url
         * @param title 标题
         */
        loadPage: function (url, title) {
            loadPage(url, title);
        }
    }
};

//初始化主界面
jx.ready(function () {
    window.app = App();
});