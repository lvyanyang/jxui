//region 发布设置

// rm -rf ./dist/* && fis3 release

fis.hook('relative');
fis.match("**", {
    relative: true,//相对路径
    deploy: [
        fis.plugin('skip-packed', {}),
        fis.plugin('local-deliver', {
            to: '../dist/'
        })
    ]
});

//endregion

//region 排除的文件

fis.set('project.ignore', [
    'dist/**',
    'node_modules/**',
    'tmp/**',
    'fis-conf.js',
    '.git/**',
    '.svn/**',
    '.gitignore'
]);

//endregion

//region 文件压缩

// fis.match('*.js', {
//     optimizer: fis.plugin('uglify-js')
// }).match('*.css', {
//   optimizer: fis.plugin('clean-css')
// }).match('*.png', {
//   optimizer: fis.plugin('png-compressor')
// });

fis.media('min').match('(/**).(js)', {
    optimizer: fis.plugin('uglify-js'),
    release: '$1.min.$2'
}).match('(/**).(css)', {
    optimizer: fis.plugin('clean-css'),
    release: '$1.min.$2'
}).match('*.png', {
    optimizer: fis.plugin('png-compressor')
});

//endregion

//region 合并配置

//忽略以_开头的html文件
fis.match('_*.html', {
    release: false
});

// fis.match('/api/**', {
//     release: false
// });

//region 字体文件
fis.match('/lib/{simple-line-icons,line-awesome,font-awesome}/(*.woff2)', {
    release: '/font/$1'
}).match('/page/login/font/(*.woff2)', {
    release: '/font/$1'
});
//endregion

//region 图片文件
fis.match('/page/**.{png,jpg,gif}', {
    release: false
}).match('/lib/{loadmask,bootstrap-popover-x,layer,jfgrid,scrollbar,jquery-minicolors}/(*.{png,jpg,gif})', {
    release: false
}).match('/lib/layer/img/(*.{png,jpg,gif})', {
    release: false
});
//endregion

//region package
fis.match('::package', {
    packager: fis.plugin('map', {
        useTrack: false,
        '/app.css': '/page/app/app.css',
        '/app.js': '/page/app/app.js',
        '/login.css': '/page/login/login.css',
        '/login.js': '/page/login/login.js',
        //region jx.css
        '/jx.css': [
            '/lib/pace/pace.css',
            '/lib/loadmask/loadmask.css',
            '/lib/toastr/toastr.css',
            '/lib/easyui/easyui.css',
            '/lib/bootstrap/bootstrap.css',
            '/lib/font-awesome/font-awesome.css',
            '/lib/line-awesome/line-awesome.css',
            '/lib/simple-line-icons/simple-line-icons.css',
            '/lib/protip/protip.css',
            '/lib/scrollbar/jquery.mCustomScrollbar.css',
            '/lib/layer/layer.css',
            '/lib/fileinputx/fileinputx.css',
            '/lib/bootstrap-datepicker/bootstrap-datepicker.css',
            '/lib/chosen/chosen.css',
            '/lib/jfgrid/jfgrid.css',
            '/jx/jx.css'
        ],
        //endregion
        //region jx.js
        '/jx.js': [
            '/lib/pace/pace.js',
            '/lib/jquery/jquery.js',
            '/lib/loadmask/loadmask.js',
            '/lib/toastr/toastr.js',
            '/lib/jquery/jquery.form.js',
            '/lib/jquery/jquery.storage.js',
            '/lib/jquery/jquery.validate.js',
            '/lib/jquery-slimscroll/jquery-slimscroll.js',
            '/lib/protip/protip.js',
            '/lib/scrollbar/jquery.mousewheel.js',
            '/lib/scrollbar/jquery.mCustomScrollbar.js',
            '/lib/layer/layer.js',
            '/lib/easyui/easyui.js',
            '/lib/bootstrap/bootstrap.js',
            '/lib/fileinputx/fileinputx.js',
            '/lib/bootstrap-datepicker/bootstrap-datepicker.js',
            '/lib/bootstrap-maxlength/bootstrap-maxlength.js',
            '/lib/chosen/chosen.js',
            '/lib/jfgrid/jfgrid.js',
            '/jx/jx.js',
            '/plugin/**.js'
        ],
        //endregion
        '/doc.css': [
            '/doc/themes/vue.css',
            '/doc/themes/copy.css',
            '/doc/themes/jx.css'
        ],
        '/doc.js': [
            '/doc/docsify.js',
            '/doc/plugins/*.js',
            '/doc/prismjs/*.js'
        ]
    })
});
//endregion

// fis.match('::package', {
//     postpackager: fis.plugin('loader', {
//         allInOne: true
//     })
// });

//endregion