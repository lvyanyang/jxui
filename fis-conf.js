//region 发布设置

// rm -rf ./dist/* && fis3 release

fis.hook('relative');
fis.match("**", {
    relative: true,//相对路径
    deploy: [
        fis.plugin('skip-packed', {}),
        fis.plugin('local-deliver', {
            to: '/homes/App/jxui'
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
    '.gitignore',
    'README.md'
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
fis.match('/lib/{simple-line-icons,line-awesome,font-awesome}/(*.{woff,woff2})', {
    release: '/font/$1'
}).match('/page/login/font/(*.{woff,woff2})', {
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
        useTrack: true,
        '/app.css': '/page/app/app.css',
        '/app.js': '/page/app/app.js',
        '/login.css': '/page/login/login.css',
        '/login.js': '/page/login/login.js',
        //region jx.css
        '/jx.css': [
            '/lib/pace/pace.css',
            '/lib/easyui/easyui.css',
            '/lib/easyui/treegrid.css',
            '/lib/font-awesome/font-awesome.css',
            '/lib/line-awesome/line-awesome.css',
            '/lib/simple-line-icons/simple-line-icons.css',
            '/lib/animate/animate.css',//动画库
            '/lib/loadmask/loadmask.css',
            '/lib/toastr/toastr.css',
            '/lib/bootstrap/bootstrap.css',
            '/lib/protip/protip.css',
            '/lib/layer/layer.css',
            '/lib/icheck/square/square.css',
            '/lib/fileinputx/fileinputx.css',
            '/lib/bootstrap-datepicker/bootstrap-datepicker.css',
            '/lib/bootstrap-touchspin/bootstrap-touchspin.css',
            '/lib/bootstrap-popover-x/bootstrap-popover-x.css',
            '/lib/wizard/wizard.css',
            '/lib/select2/select2.css',
            '/lib/easyui/easyfix.css',
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
            '/lib/protip/protip.js',
            '/lib/layer/layer.js',
            '/lib/icheck/icheck.js',
            '/lib/easyui/easyui.js',
            '/lib/easyui/treegrid.js',
            '/lib/bootstrap/bootstrap.js',
            '/lib/fileinputx/fileinputx.js',
            '/lib/bootstrap-datepicker/bootstrap-datepicker.js',
            '/lib/bootstrap-maxlength/bootstrap-maxlength.js',
            '/lib/bootstrap-touchspin/bootstrap-touchspin.js',
            '/lib/bootstrap-popover-x/bootstrap-popover-x.js',
            '/lib/bootstrap-contextmenu/bootstrap-contextmenu.js',
            '/lib/wizard/wizard.js',
            '/lib/select2/select2.js',
            '/jx/jx.js',
            '/plugin/base/**.js',
            '/plugin/core/**.js',
            '/plugin/data/**.js',
            '/plugin/form/**.js',
            '/plugin/other/**.js'
        ],
        //endregion
        '/doc.css': [
            '/lib/docsify/themes/vue.css',
            '/lib/docsify/themes/copy.css',
            '/lib/docsify/themes/jx.css'
        ],
        '/doc.js': [
            '/lib/docsify/docsify.js',
            '/lib/docsify/plugins/*.js',
            '/lib/docsify/prismjs/*.js'
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