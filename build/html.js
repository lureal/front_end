/**
 * html.js
 * @description 执行html 操作
 */

var webpack = require('webpack'); // 模块加载器 webpack
var gutil = require('gulp-util'); // gulp 工具
var fileinclude = require('gulp-file-include'); // 加载文件
var replace = require('gulp-replace'); // 全局替换字符串
var revReplace = require('gulp-rev-replace'); // 替换 html 中的版本号
var swig = require('gulp-swig'); // swig 模板

exports = module.exports = {
    html: html,
    htmlWithInc: htmlWithInc,
    md5: md5
};

/**
 * html 相关操作
 * @param  Object gulp    gulp 对象
 * @param  Array  files   等待处理的文件列表
 * @param  String dest    输出路径
 * @param  String name    项目名称
 */
function html(gulp, files, dest, name) {
    gulp.src(files)
        .pipe(swig({defaults: { cache: false }}))
        .pipe(replace(/#proj_name#\/html\/(.*?)\.html/g, name + '/$1'))
        .pipe(replace(/#proj_name#/g, name))
        .pipe(gulp.dest(dest))
}

/**
 * html 相关操作
 * @description 采用 gulp-file-include 插件
 * @param  Object gulp    gulp 对象
 * @param  Array  files   等待处理的文件列表
 * @param  String dest    输出路径
 * @param  String name    项目名称
 */
function htmlWithInc(gulp, files, dest, name) {
    gulp.src(files)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './' + name
        }))
        .pipe(replace(/#proj_name#\/html\/(.*?)\.html/g, name + '/$1'))
        .pipe(replace(/#proj_name#/g, name))
        .pipe(gulp.dest(dest))
}

/**
 * 将 html 种的地址替换成 md5
 * @param  Object gulp    gulp 对象
 * @param  Array  files   等待处理的文件列表
 * @param  String dest    输出路径
 * @param  Array manifest manifest数组 [0] -> jsManifest(gulp.src导进的) [1] -> cssManifest(gulp.src导进的)
 */
function md5(gulp, files, dest, manifest) {

    gulp.src(files)
        .pipe(revReplace({
            manifest: manifest[0]
        }))
        .pipe(revReplace({
            manifest: manifest[1]
        }))
        .pipe(gulp.dest(dest))

}
