/**
 * 构建工具
 * @description 友钱前端构建工具，使用 gulp，用于生成项目
 */
var gulp = require('gulp');
var argv = require('yargs').argv; // 命令行工具
var path = require('path'); // 路径库
var webpack = require('webpack'); // webpack
var _ = require('lodash'); // 函数库
var del = require('del'); // 删除操作

// 加载构建工具模块
var css = require('./build/css');
var js = require('./build/script');
var html = require('./build/html');
var img = require('./build/img');

// cpboss 后台
generateProjTask('ferrari', true, {
    css: {
        src: ['./ferrari/src/less/aso.less']
    }
});

generateProjTask('test', true, {
    css: {
        src: ['./test/src/less/aso.less']
    }
});

// demo 项目
generateProjTask('demo', false);

// 干货铺子管理后台
generateProjTask('puzi-admin', false);

// 各类活动
generateProjTask('wesdom', false);

// 微思敦管理后台
generateProjTask('wesdom-admin', false);

// 友钱单独推广页面
generateProjTask('cpapp', false);

// BOSS 后台
generateProjTask('boss', false);

// 微思敦广告管理后台
generateProjTask('dsp', false);

// 微思敦广告管理后台
generateProjTask('customer-admin', false);

// 微思敦广告平台: 客户管理平台
generateProjTask('wead', false);

// 微思敦广告平台: dsp 优化，重新使用一个项目
generateProjTask('wdsp', false);

/**
 * 公共操作
 * =============================================================================
 */

/**
 * generateProjTask
 * @param String name           项目名称
 * @param Object useFileInclude 是否使用 gulp-file-include 插件（cpboss），建议不使用这个插件
 * @param Object pathObj        路径对象，用于定义输出输入路径
 */
function generateProjTask(name, useFileInclude, pathObj) {

    // 默认参数
    var obj = {
        css: {
            src: ['./' + name + '/src/less/**/*.less'],
            dist: './' + name + '/dist/css'
        },
        js: {
            src: ['./' + name + '/src/js/**/*.js'],
            dist: './' + name + '/dist/js'
        },
        html: {
            src: ['./' + name + '/src/html/**/*.html'],
            dist: './' + name + '/dist/html'
        },
        img: {
            src: ['./' + name + '/src/img/**/*.*'],
            dist: './' + name + '/dist/img'
        }
    };

    // 如果传入参数，则合并参数
    if(obj) {
        obj = _.merge(obj, pathObj);
    }

    // 编译 less 文件
    // 测试环境下编译 less
    gulp.task('devCss:' + name, function() {
        css.dev(gulp, obj.css.src, obj.css.dist, name);
    });

    // 正式环境下编译 less
    gulp.task('css:' + name, function() {
        del.sync(obj.css.dist, function() {
        });
        css.prod(gulp, obj.css.src, obj.css.dist, name);
    });

    // 编译 js 文件
    // 测试环境下编译 js
    gulp.task('devJs:' + name, function() {
        js.dev(gulp, obj.js.src, require('./' + name + '/webpack.config.js'), obj.js.dist, name);
    })

    // 正式环境下编译 js
    gulp.task('js:' + name, function() {
        del.sync(obj.js.dist, function() {
        })
        js.prod(gulp, obj.js.src, require('./' + name + '/webpack.config.js'), obj.js.dist, name);
    });

    // 编译图片
    // 开发环境编译图像
    gulp.task('devimg:' + name, function() {
        img.dev(gulp, obj.img.src, obj.img.dist);
    });

    // 正式环境编译图像
    gulp.task('img:' + name, function() {
        img.prod(gulp, obj.img.src, obj.img.dist);
    })

    // 编译 html 文件
    gulp.task('html:' + name, function() {

        if(useFileInclude) {
            html.htmlWithInc(gulp, obj.html.src, obj.html.dist, name);
            return;
        }

        html.html(gulp, obj.html.src, obj.html.dist, name);
    });

    // 执行 md5 替换
    gulp.task('md5:' + name, function() {
        html.md5(gulp, obj.html.dist + '/**/*.html', obj.html.dist, [
            gulp.src(obj.js.dist + '/rev-manifest.json'),
            gulp.src(obj.css.dist + '/rev-manifest.json')
        ]);
    });

    // 监视所有文件
    gulp.task('watch:' + name, [
        'devCss:' + name,
        'devJs:' + name,
        'html:' + name,
        'devimg:' + name

    ], function() {
        gulp.watch('./' + name + '/src/**/*.*', [
            'devCss:' + name,
            'devJs:' + name,
            'html:' + name,
            'devimg:' + name
        ])
    });

    // 启动服务器并监视所有文件
    gulp.task('default:' + name, ['watch:' + name]);

    // 构建项目
    gulp.task('build:' + name, [
        'css:' + name,
        'js:' + name,
        'html:' + name,
        'img:' + name
    ]);
}
