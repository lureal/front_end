/**
 * css.js
 * @description 执行 css 操作
 */

var less = require('gulp-less'); // 编译 less
var miniCss = require('gulp-minify-css'); // 压缩 css
var replace = require('gulp-replace'); // 全局替换字符串
var rev = require('gulp-rev');

exports = module.exports = {
    dev: dev,
    prod: prod
};

/**
 * 开发环境
 * @param  Object gulp    gulp 对象
 * @param  Array  files   等待处理的文件列表
 * @param  String dest    输出路径
 * @param  String name    项目名称
 */
function dev(gulp, files, dest, name) {
    gulp.src(files)
        .pipe(less())
        .pipe(miniCss())
        .pipe(replace(/#proj_name#/g, name))
        .pipe(gulp.dest(dest))
}

/**
 * 正式环境
 * @param  Object gulp    gulp 对象
 * @param  Array  files   等待处理的文件列表
 * @param  String dest    输出路径
 * @param  String name    项目名称
 */
function prod(gulp, files, dest, name) {
    gulp.src(files)
        .pipe(less())
        .pipe(miniCss())
        .pipe(replace(/#proj_name#/g, name))
        .pipe(rev())
        .pipe(gulp.dest(dest))
        .pipe(rev.manifest({
            merge: true
        }))
        .pipe(gulp.dest(dest))
}
