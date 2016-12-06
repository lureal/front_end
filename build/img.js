/**
 * img.js
 * @description 执行 img 操作
 */

var img = require('gulp-imagemin');

exports = module.exports = {
    dev: dev,
    prod: prod
};

/**
 * JavaScript 相关操作
 * @param  Object gulp   gulp 对象
 * @param  Object config weboack 配置文件
 * @param  Array  files  等待处理的文件列表
 * @param  String dest   输出路径
 * @param  String name    项目名称
 */
function dev(gulp, files, dest) {
    gulp.src(files)
        .pipe(gulp.dest(dest))
}

function prod(gulp, files, dest) {
    gulp.src(files)
        .pipe(img())
        .pipe(gulp.dest(dest))
}
