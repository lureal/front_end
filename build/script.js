/**
 * script.js
 * @description 执行 js 相关操作
 */

var webpack = require('webpack-stream'); // 模块加载器 webpack
var gutil = require('gulp-util'); // gulp 工具
var replace = require('gulp-replace'); // 全局替换字符串
var rev = require('gulp-rev'); // 生成附带版本号文件和版本号汇总对应 json

exports = module.exports = {
    dev: dev,
    prod: prod
};

/**
 * 开发环境
 * @param  Object gulp   gulp 对象
 * @param  Object config weboack 配置文件
 * @param  Array  files  等待处理的文件列表
 * @param  String dest   输出路径
 * @param  String name    项目名称
 */
function dev(gulp, files, config, dest, name) {
    gulp.src(files)
        .pipe(webpack(config))
        .pipe(replace(/#proj_name#\/html\/(.*?)\.html/g, name+"/$1"))
        .pipe(replace(/#proj_name#/g, name))
        .pipe(gulp.dest(dest))
}

/**
 * 正式环境
 * @param  Object gulp   gulp 对象
 * @param  Object config weboack 配置文件
 * @param  Array  files  等待处理的文件列表
 * @param  String dest   输出路径
 * @param  String name    项目名称
 */
function prod(gulp, files, config, dest, name) {
    gulp.src(files)
        .pipe(webpack(config))
        .pipe(replace(/#proj_name#\/html\/(.*?)\.html/g, name+"/$1"))
        .pipe(replace(/#proj_name#/g, name))
        .pipe(rev())
        .pipe(gulp.dest(dest))
        .pipe(rev.manifest({
            merge: true
        }))
        .pipe(gulp.dest(dest))
}
